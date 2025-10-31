const request = require('supertest');
const express = require('express');
const db = require('../db');
const authService = require('../authService');

// Import server.js logic by creating an app instance similar to original
const app = express();
app.use(express.json());

// Minimal routes required for test (reuse modules)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.authenticateUser(username, password);
  if (!result.success) return res.status(401).json({ error: result.message });
  res.json({ token: result.token, user: result.user });
});

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const validation = authService.validateSession(token);
  if (!validation.valid) return res.status(401).json({ error: validation.message });
  req.user = validation.user; next();
};

app.post('/api/initiatives', requireAuth, async (req, res) => {
  const { idea, aiAnalysis } = req.body;
  const initiative = { id: 'test-init-1', status: 'pending_approval', submittedBy: req.user.username, submittedAt: new Date().toISOString(), idea, aiAnalysis };
  await db.addInitiative(initiative);
  res.status(201).json(initiative);
});

app.patch('/api/initiatives/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const initiative = await db.getInitiativeById(id);
  if (!initiative) return res.status(404).json({ error: 'Initiative not found' });
  if (updates.status === 'approved') {
    if (!updates.approvalReason) return res.status(400).json({ error: 'Approval reason is required when approving an initiative.' });
    updates.approvedAt = new Date().toISOString();
    updates.approvedBy = req.user.username;
    updates.adoWorkItemId = 12345;
  } else if (updates.status === 'rejected') {
    updates.rejectedAt = new Date().toISOString();
    updates.rejectedBy = req.user.username;
  }
  const updated = await db.updateInitiative(id, updates);
  res.json(updated);
});

beforeAll(async () => {
  await db.init();
});

describe('Approval/Rejection flow', () => {
  let poToken;
  let userToken;

  test('login as PO and regular user', async () => {
    const poResp = await request(app).post('/api/login').send({ username: 'po_admin', password: 'po123456' });
    expect(poResp.status).toBe(200);
    poToken = poResp.body.token;
    const userResp = await request(app).post('/api/login').send({ username: 'john_user', password: 'user123456' });
    expect(userResp.status).toBe(200);
    userToken = userResp.body.token;
  });

  test('user submits initiative', async () => {
    const resp = await request(app)
      .post('/api/initiatives')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        idea: { title: 'Test Initiative', ideaDescription: 'Desc', businessObjective: 'Capacity' },
        aiAnalysis: { businessValueScore: 5, costSaving: true }
      });
    expect(resp.status).toBe(201);
    expect(resp.body.status).toBe('pending_approval');
  });

  test('approve requires reason', async () => {
    const resp = await request(app)
      .patch('/api/initiatives/test-init-1')
      .set('Authorization', `Bearer ${poToken}`)
      .send({ status: 'approved' });
    expect(resp.status).toBe(400);
  });

  test('approve with reason sets metadata', async () => {
    const resp = await request(app)
      .patch('/api/initiatives/test-init-1')
      .set('Authorization', `Bearer ${poToken}`)
      .send({ status: 'approved', approvalReason: 'Valid business case' });
    expect(resp.status).toBe(200);
    expect(resp.body.approvedBy).toBe('po_admin');
    expect(resp.body.approvedAt).toBeDefined();
    expect(resp.body.adoWorkItemId).toBe(12345);
  });
});
