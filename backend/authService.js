const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// For demo purposes - simple session storage (in production, use Redis or similar)
const sessions = new Map();

/**
 * Read users from the JSON file
 */
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    throw new Error('Failed to read users data');
  }
}

/**
 * Find a user by username
 */
async function findUserByUsername(username) {
  const users = await readUsers();
  return users.find(u => u.username === username);
}

/**
 * Authenticate user with username and password
 */
async function authenticateUser(username, password) {
  const user = await findUserByUsername(username);
  
  if (!user) {
    return { success: false, message: 'Invalid username or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return { success: false, message: 'Invalid username or password' };
  }

  // Create session
  const sessionToken = generateSessionToken();
  const sessionData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
    createdAt: new Date().toISOString()
  };
  
  sessions.set(sessionToken, sessionData);

  return {
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    }
  };
}

/**
 * Validate session token
 */
function validateSession(token) {
  if (!token) {
    return { valid: false, message: 'No token provided' };
  }

  const sessionData = sessions.get(token);
  
  if (!sessionData) {
    return { valid: false, message: 'Invalid or expired session' };
  }

  return { valid: true, user: sessionData };
}

/**
 * Logout user (destroy session)
 */
function logout(token) {
  if (token) {
    sessions.delete(token);
    return { success: true, message: 'Logged out successfully' };
  }
  return { success: false, message: 'No token provided' };
}

/**
 * Generate a random session token
 */
function generateSessionToken() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Hash password (utility function for creating new users)
 */
async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
}

module.exports = {
  authenticateUser,
  validateSession,
  logout,
  hashPassword,
  findUserByUsername
};
