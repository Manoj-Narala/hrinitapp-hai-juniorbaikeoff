# User Authentication Guide

## Overview

The HR Approval App for Initiative (HAI) now includes a complete user authentication system with role-based access control (RBAC). The system supports two user roles:
- **Product Owner (PO)**: Can submit ideas AND approve/reject initiatives
- **Regular User**: Can only submit ideas

## User Accounts

### 1. Product Owner Account
```
Username: po_admin
Password: po123456
Role: PO
Name: Product Owner
Email: po@company.com
```

**Permissions:**
- ✅ Submit new initiative ideas
- ✅ View all initiatives in the approval dashboard
- ✅ Approve initiatives (creates ADO work items)
- ✅ Reject initiatives with reason

### 2. Regular User Account
```
Username: john_user
Password: user123456
Role: USER
Name: John Smith
Email: john@company.com
```

**Permissions:**
- ✅ Submit new initiative ideas
- ✅ View all initiatives in the approval dashboard
- ❌ Cannot approve or reject initiatives

## How Authentication Works

### Login Flow
1. User opens the application
2. Login form is displayed
3. User enters username and password
4. Backend validates credentials against `data/users.json`
5. If valid, a session token is generated and returned
6. Token is stored in `localStorage`
7. Token is sent with every API request in the `Authorization` header

### Session Management
- Sessions are stored in-memory on the backend server
- Each session has a unique token
- Token format: `session_<timestamp>_<randomstring>`
- Tokens persist until user logs out or server restarts

### Protected Routes
All API endpoints (except `/api/login`) require authentication:
- `/api/analyze` - Requires authentication
- `/api/initiatives` - Requires authentication
- `/api/initiatives/:id` - Requires authentication
- `/api/initiatives/:id/approve` - **Requires PO role**
- `/api/initiatives/:id/reject` - **Requires PO role**

## Technical Implementation

### Backend Components

#### 1. `backend/authService.js`
Handles all authentication logic:
- `authenticateUser(username, password)` - Validates credentials
- `validateSession(token)` - Checks if token is valid
- `logout(token)` - Destroys session
- `hashPassword(plainPassword)` - Utility for hashing passwords

#### 2. `backend/server.js` Middleware
Two middleware functions protect routes:
- `requireAuth` - Validates authentication token
- `requireRole(role)` - Checks user has specific role

#### 3. `data/users.json`
User database with bcrypt-hashed passwords:
```json
[
  {
    "id": "user-1",
    "username": "po_admin",
    "password": "$2b$10$...",
    "role": "PO",
    "name": "Product Owner",
    "email": "po@company.com"
  }
]
```

### Frontend Components

#### 1. `LoginForm.vue`
- Beautiful login UI with demo credentials displayed
- Form validation
- Error handling
- Stores token and user info in localStorage

#### 2. `App.vue` Authentication State
- Checks for existing token on load
- Validates token with backend
- Shows login form if not authenticated
- Shows main app if authenticated
- Handles logout

#### 3. `AppHeader.vue`
- Displays logged-in user info
- Shows user name, role, and avatar
- Logout button
- Visual distinction for PO users (indigo badge)

#### 4. `InitiativeDetailModal.vue`
- Shows approve/reject buttons only for PO users
- Displays informative message for regular users

#### 5. `api.js` Interceptors
- **Request Interceptor**: Adds token to all requests
- **Response Interceptor**: Handles 401 errors (auto-logout)

## Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Passwords never stored in plain text
- ✅ Passwords never sent in responses

### Token Security
- ✅ Random session tokens
- ✅ Tokens validated on every request
- ✅ Invalid tokens trigger auto-logout
- ✅ Logout destroys server-side session

### API Security
- ✅ All routes protected by authentication
- ✅ Role-based authorization for sensitive actions
- ✅ CORS enabled for frontend communication

## Adding New Users

### Method 1: Using generatePasswords.js
```bash
cd backend
# Edit generatePasswords.js to add new user
node generatePasswords.js
```

### Method 2: Manual Addition
1. Hash password using bcrypt:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('yourpassword', 10);
```

2. Add to `data/users.json`:
```json
{
  "id": "user-3",
  "username": "new_user",
  "password": "<bcrypt hash>",
  "role": "USER",  // or "PO"
  "name": "Full Name",
  "email": "email@company.com",
  "createdAt": "2025-10-30T10:00:00.000Z"
}
```

## Testing Authentication

### Test as Product Owner
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Login with: **po_admin** / **po123456**
4. Submit an idea → See it in dashboard → Click to approve/reject

### Test as Regular User
1. Login with: **john_user** / **user123456**
2. Submit an idea → See it in dashboard → Click initiative
3. **Notice**: No approve/reject buttons (message displayed instead)

## API Examples

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"po_admin","password":"po123456"}'
```

Response:
```json
{
  "message": "Login successful",
  "token": "session_1730289600_abc123",
  "user": {
    "id": "user-1",
    "username": "po_admin",
    "role": "PO",
    "name": "Product Owner",
    "email": "po@company.com"
  }
}
```

### Authenticated Request
```bash
curl http://localhost:3000/api/initiatives \
  -H "Authorization: Bearer session_1730289600_abc123"
```

### Logout
```bash
curl -X POST http://localhost:3000/api/logout \
  -H "Authorization: Bearer session_1730289600_abc123"
```

## Troubleshooting

### "Invalid username or password"
- ✅ Check username spelling (case-sensitive)
- ✅ Check password (case-sensitive)
- ✅ Verify `data/users.json` exists and has valid hashes

### "401 Unauthorized" on API calls
- ✅ Check token is stored in localStorage
- ✅ Check backend server is running
- ✅ Try logging out and logging in again

### Auto-logout on page load
- ✅ Backend server may have restarted (sessions are in-memory)
- ✅ Token may have been manually deleted from localStorage

### Cannot approve/reject as PO
- ✅ Verify you're logged in as `po_admin`
- ✅ Check browser console for errors
- ✅ Verify backend middleware is working (check server logs)

## Future Enhancements

Potential improvements for production:
1. **Persistent Sessions**: Use Redis or database instead of in-memory
2. **JWT Tokens**: Replace session tokens with JWTs
3. **Password Reset**: Email-based password recovery
4. **Multi-factor Auth**: SMS or authenticator app 2FA
5. **Audit Logs**: Track who approved/rejected what and when
6. **User Management UI**: Admin panel to create/edit users
7. **Password Requirements**: Enforce complexity rules
8. **Rate Limiting**: Prevent brute force attacks
9. **Session Expiry**: Auto-logout after inactivity
10. **Remember Me**: Persistent login option

## Files Modified/Created

### Backend
- ✅ `backend/authService.js` - Authentication service (NEW)
- ✅ `backend/server.js` - Added auth middleware and endpoints
- ✅ `backend/generatePasswords.js` - Password hash generator (NEW)
- ✅ `data/users.json` - User database (NEW)

### Frontend
- ✅ `frontend/src/components/LoginForm.vue` - Login UI (NEW)
- ✅ `frontend/src/App.vue` - Authentication state management
- ✅ `frontend/src/components/AppHeader.vue` - User info display & logout
- ✅ `frontend/src/components/InitiativeDetailModal.vue` - Role-based buttons
- ✅ `frontend/src/api.js` - Auth interceptors

### Dependencies
- ✅ `bcryptjs` - Password hashing library

---

**Remember**: The demo passwords are for development only. In production, enforce strong password requirements and use proper secret management!
