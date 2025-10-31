const authService = require('../authService');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');

// Helper to load users raw
function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

describe('authService', () => {
  let originalUsers;
  beforeAll(() => {
    originalUsers = loadUsers();
  });

  test('authenticateUser returns success for valid credentials', async () => {
    const poUser = originalUsers.find(u => u.username === 'po_admin');
    expect(poUser).toBeTruthy();
    const result = await authService.authenticateUser('po_admin', 'po123456');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.user.role).toBe('PO');
  });

  test('authenticateUser fails for invalid user', async () => {
    const result = await authService.authenticateUser('ghost_user', 'whatever');
    expect(result.success).toBe(false);
  });

  test('validateSession returns valid for issued token', async () => {
    const login = await authService.authenticateUser('po_admin', 'po123456');
    const validation = authService.validateSession(login.token);
    expect(validation.valid).toBe(true);
    expect(validation.user.username).toBe('po_admin');
  });

  test('logout invalidates session', async () => {
    const login = await authService.authenticateUser('po_admin', 'po123456');
    authService.logout(login.token);
    const validation = authService.validateSession(login.token);
    expect(validation.valid).toBe(false);
  });
});
