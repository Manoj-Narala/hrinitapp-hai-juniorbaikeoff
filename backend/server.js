require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const AIService = require('./aiService');
const authService = require('./authService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize AI Service
const aiService = new AIService(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins (for local network only)
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const validation = authService.validateSession(token);
  
  if (!validation.valid) {
    return res.status(401).json({ error: validation.message });
  }
  
  req.user = validation.user;
  next();
};

// Role-based authorization middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database
db.init().then(() => {
  console.log('Database initialized');
});

// ==================== API Routes ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== Authentication Routes ====================

/**
 * Login endpoint
 * POST /api/login
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const result = await authService.authenticateUser(username, password);
    
    if (!result.success) {
      return res.status(401).json({ error: result.message });
    }
    
    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/**
 * Logout endpoint
 * POST /api/logout
 */
app.post('/api/logout', requireAuth, (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = authService.logout(token);
    res.json(result);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed. Please try again.' });
  }
});

/**
 * Get current user info
 * GET /api/me
 */
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ==================== Initiative Routes ====================

/**
 * Generate AI analysis for an idea
 * POST /api/analyze
 */
app.post('/api/analyze', requireAuth, async (req, res) => {
  try {
    const { ideaDescription, businessObjective, businessValue, monetaryValue } = req.body;

    // Validate input
    if (!ideaDescription || !businessObjective) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['ideaDescription', 'businessObjective']
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured. Please set GEMINI_API_KEY in environment variables.'
      });
    }

    const analysis = await aiService.generateAnalysis(req.body);
    res.json(analysis);
  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI analysis',
      message: error.message 
    });
  }
});

/**
 * Get all initiatives
 * GET /api/initiatives
 */
app.get('/api/initiatives', requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let initiatives = await db.getAllInitiatives();

    // Filter by status if provided
    if (status && status !== 'all') {
      initiatives = initiatives.filter(init => init.status === status);
    }

    // Sort by submission date (newest first)
    initiatives.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json(initiatives);
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({ error: 'Failed to fetch initiatives' });
  }
});

/**
 * Get a single initiative by ID
 * GET /api/initiatives/:id
 */
app.get('/api/initiatives/:id', requireAuth, async (req, res) => {
  try {
    const initiative = await db.getInitiativeById(req.params.id);
    
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }

    res.json(initiative);
  } catch (error) {
    console.error('Error fetching initiative:', error);
    res.status(500).json({ error: 'Failed to fetch initiative' });
  }
});

/**
 * Create a new initiative
 * POST /api/initiatives
 */
app.post('/api/initiatives', requireAuth, async (req, res) => {
  try {
    const { idea, aiAnalysis, submittedBy } = req.body;

    // Validate input
    if (!idea || !aiAnalysis) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['idea', 'aiAnalysis']
      });
    }

    const initiative = {
      id: uuidv4(),
      status: 'pending_approval',
      submittedBy: submittedBy || 'anonymous',
      submittedAt: new Date().toISOString(),
      idea,
      aiAnalysis
    };

    const created = await db.addInitiative(initiative);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating initiative:', error);
    res.status(500).json({ error: 'Failed to create initiative' });
  }
});

/**
 * Update an initiative (for approval/rejection) - Requires PO role
 * PATCH /api/initiatives/:id
 */
app.patch('/api/initiatives/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get the initiative first
    const initiative = await db.getInitiativeById(id);
    
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }

    // Check permissions
    // Regular users can only edit their own pending or rejected ideas
    if (req.user.role !== 'PO') {
      if (initiative.submittedBy !== req.user.username) {
        return res.status(403).json({ error: 'You can only edit your own ideas' });
      }
      if (initiative.status !== 'pending_approval' && initiative.status !== 'rejected') {
        return res.status(403).json({ error: 'You can only edit pending or rejected ideas' });
      }
      
      // When a user edits a rejected idea, reset it to pending and clear rejection details
      if (initiative.status === 'rejected') {
        updates.status = 'pending_approval';
        updates.rejectedAt = null;
        updates.rejectionReason = null;
        updates.submittedAt = new Date().toISOString(); // Update submission time
      }
    }

    // Add timestamp based on status change (PO actions)
    if (updates.status === 'approved') {
      // Require approvalReason for PO approvals
      if (!updates.approvalReason || typeof updates.approvalReason !== 'string' || !updates.approvalReason.trim()) {
        return res.status(400).json({ error: 'Approval reason is required when approving an initiative.' });
      }
      updates.approvedAt = new Date().toISOString();
      // Track approver username
      updates.approvedBy = req.user.username;
      // Capture approval reason if provided
      if (updates.approvalReason && typeof updates.approvalReason === 'string') {
        updates.approvalReason = updates.approvalReason.trim();
      }
      
      // Simulate ADO work item creation
      updates.adoWorkItemId = Math.floor(10000 + Math.random() * 90000);
    } else if (updates.status === 'rejected') {
      updates.rejectedAt = new Date().toISOString();
      // Track who rejected
      updates.rejectedBy = req.user.username;
    }

    const updated = await db.updateInitiative(id, updates);
    res.json(updated);
  } catch (error) {
    console.error('Error updating initiative:', error);
    if (error.message === 'Initiative not found') {
      res.status(404).json({ error: 'Initiative not found' });
    } else {
      res.status(500).json({ error: 'Failed to update initiative' });
    }
  }
});

/**
 * Delete an initiative - Requires PO role
 * DELETE /api/initiatives/:id
 */
app.delete('/api/initiatives/:id', requireAuth, requireRole('PO'), async (req, res) => {
  try {
    const deleted = await db.deleteInitiative(req.params.id);
    res.json({ message: 'Initiative deleted successfully', initiative: deleted });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    if (error.message === 'Initiative not found') {
      res.status(404).json({ error: 'Initiative not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete initiative' });
    }
  }
});

// ==================== Error Handling ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== Start Server ====================

app.listen(PORT, () => {
  console.log(`\n🚀 HR Initiative Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Service: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET    /api/health`);
  console.log(`  POST   /api/analyze`);
  console.log(`  GET    /api/initiatives`);
  console.log(`  GET    /api/initiatives/:id`);
  console.log(`  POST   /api/initiatives`);
  console.log(`  PATCH  /api/initiatives/:id`);
  console.log(`  DELETE /api/initiatives/:id\n`);
});
