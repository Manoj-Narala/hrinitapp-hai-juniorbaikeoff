# Comprehensive Testing Checklist

This checklist covers end-to-end functional, UX, role-based, data integrity, and regression tests for the Initiative Management application.

---

## 0. Environment & Pre-Flight

- [ ] Backend running (`cd backend && npm run dev` or start script) – no startup errors
- [ ] Frontend running (`cd frontend && npm run dev`)
- [ ] `.env` configured (API key optional – AI fallbacks handled)
- [ ] Clean browser session (incognito) / localStorage cleared
- [ ] System date/time correct (for timestamp assertions)
- [ ] JSON data file `data/initiatives.json` valid (no syntax errors)

---

## 1. Authentication & Sessions

### 1.1 Product Owner Login
- [ ] Login form visible on first load
- [ ] Login with `po_admin` / valid password succeeds
- [ ] Header shows PO role badge
- [ ] Redirect lands on New Initiative form

### 1.2 Regular User Login
- [ ] Login with `john_user` shows User role (no PO actions)
- [ ] Cannot access approval actions

### 1.3 Invalid Credentials
- [ ] Wrong user → error message
- [ ] Wrong password → error (no token stored)

### 1.4 Token Persistence
- [ ] Refresh retains session
- [ ] Manual token removal triggers redirect to login on protected fetch

### 1.5 Logout
- [ ] Logout clears token and returns to login

---

## 2. New Initiative Form (Idea Submission)

### 2.1 Required Fields
- [ ] Title required (error shown when blank)
- [ ] Description required
- [ ] Business Objective required

### 2.2 Optional Fields Acceptance
- [ ] Principal Features accepts multiline
- [ ] Business Value (1–10) validated (reject <1 or >10)
- [ ] Monetary Value accepts number (thousand units) and empty state
- [ ] Persons Affected optional text retained
- [ ] Business Areas Affected optional text retained

### 2.3 Platform Clients Impacted (NEW)
Clients list (14): Next, Aubin and Wills, GAP, Laura Ashley, Reiss, Victoria's Secret, JoJo Maman Bébé, Lipsy, Next Beauty, Bath and Body, Made, Joules, FatFace, Cath Kidston
- [ ] All 14 toggles rendered and correctly spelled
- [ ] Selecting multiple accumulates in `platformClientsImpacted`
- [ ] Deselect removes from array
- [ ] Submission payload includes array (inspect network request)
- [ ] No clients selected → payload has empty array

### 2.4 Form Validation & UX
- [ ] Submit button disabled until required fields filled
- [ ] Loading spinner appears during AI analysis
- [ ] Error message shown if backend (simulate 500) fails

### 2.5 Reset / Reopen Behavior
- [ ] After successful submission, opening new form shows cleared state (including platform clients)

---

## 3. AI Analysis & Statement of Work
- [ ] Generated businessValueScore present if user left blank
- [ ] User-provided businessValue overrides AI (flag displayed)
- [ ] Cost Saving badge toggles (true vs false)
- [ ] Statement of Work text preserved

---

## 4. My Submitted Ideas Table

### 4.1 Column Layout & Data
- [ ] Columns include: Idea, BV Score, Value, Type, Status, Submitted By, Submitted, Approved/Rejected By, Approved/Rejected On, ADO Item, Actions
- [ ] Vertical grid lines present (border-collapse)
- [ ] For approved rows Approved By/On populated; for others dash

### 4.2 Dynamic Headers (Rejected Tab)
- [ ] Switching to Rejected tab changes headers to Rejected By / Rejected On
- [ ] Rejected rows show `rejectedBy` (po_admin backfill) and date

### 4.3 Rejection / Approval Rationale Rows
- [ ] Rejection reason row visible under rejected ideas only in Rejected tab
- [ ] Approval rationale row visible under approved ideas only in Approved tab

### 4.4 Edit & Resubmit Workflow
- [ ] Rejected idea shows edit icon with orange styling
- [ ] Editing rejected idea resets status to Pending PO Review
- [ ] Rejection metadata cleared after resubmit (rejectedAt, rejectionReason)

### 4.5 Platform Clients Persistence
- [ ] Submitted idea with platform clients shows them in detail modal (list)

---

## 5. Approval Dashboard

### 5.1 Filters
- [ ] Filter buttons switch dataset (Pending, Approved, Rejected, All)
- [ ] Counts match underlying items

### 5.2 Dynamic Headers (Rejected Filter)
- [ ] Approved By/On → Rejected By/On swap works
- [ ] Rejected rows show red date styling

### 5.3 Review Modal
- [ ] Shows Title or Business Objective fallback
- [ ] Principal Features section appears if provided
- [ ] Persons / Business Areas appear only when populated
- [ ] Business Value display indicates (PO Edited / User Provided / AI Estimated)
- [ ] Approval requires reason (reject empty reason → validation error)
- [ ] Rejection requires reason (empty confirm disabled)

### 5.4 Override Score
- [ ] PO can edit BV score, save updates `aiAnalysis.businessValueScore` and sets `businessValueOverriddenBy`
- [ ] Non-PO cannot see edit controls

### 5.5 Metadata Capture
- [ ] Approving sets approvedAt (ISO) and approvedBy (PO username)
- [ ] Rejecting sets rejectedAt and rejectedBy
- [ ] ADO item ID created (integer 5 digits) upon approval

---

## 6. Backend API Behavior

### 6.1 Create Initiative
- [ ] POST /api/initiatives persists all idea fields including platformClientsImpacted

### 6.2 Approval Patch
- [ ] PATCH with status=approved without approvalReason → 400 error
- [ ] PATCH with valid reason → returns updated object with approvedBy/approvedAt & adoWorkItemId

### 6.3 Rejection Patch
- [ ] PATCH with status=rejected without reason (if UI allows) should still require reason (UI prevents empty)
- [ ] Response includes rejectedBy and rejectedAt

### 6.4 Edit Rejected as User
- [ ] PATCH by submitter on rejected idea resets status to pending_approval and clears rejection fields

### 6.5 Permission Enforcement
- [ ] Regular user cannot approve/reject (403)
- [ ] Regular user cannot edit others' ideas (403)

### 6.6 Data Integrity
- [ ] No duplicate IDs
- [ ] JSON remains valid after operations

---

## 7. Data File Backfill Validation
- [ ] All previously approved initiatives have approvedBy = po_admin
- [ ] All previously rejected initiatives have rejectedBy = po_admin (after backfill)
- [ ] Rejected timestamps updated to normalization date intentionally (documented)

---

## 8. Accessibility & UX
- [ ] All interactive elements have accessible names (buttons, checkboxes)
- [ ] Form labels associated with inputs (use for/id)
- [ ] Color contrasts pass (manual spot-check: status badges, red/green text)
- [ ] Tab order logical through form
- [ ] Spinner has role/status (optional improvement)

---

## 9. Error & Edge Cases
- [ ] Network error on analyze → error message visible, form still editable
- [ ] Submit without optional monetary/business value works
- [ ] Large Principal Features input (e.g., 1000 chars) accepted and displayed
- [ ] Zero platform clients selected accepted
- [ ] All 14 platform clients selected accepted
- [ ] Attempt to PATCH unknown initiative ID → 404 error
- [ ] Manual tamper: send extra unexpected field → ignored/not breaking

---

## 10. Security / Session
- [ ] Calling API without token → 401
- [ ] Token from regular user cannot perform approval PATCH → 403
- [ ] Logout invalidates token (subsequent request 401)

---

## 11. Performance (Light Checks)
- [ ] Loading spinner disappears after fetch completion
- [ ] Table renders without layout shift for 20+ items (seed test by duplicating entries)

---

## 12. Regression Focus Areas (Recent Changes)
- [ ] Dynamic column headers in both My Ideas & Approval Dashboard (Rejected tab) correct
- [ ] platformClientsImpacted not interfering with existing submission
- [ ] approvedBy / rejectedBy always captured on new status changes
- [ ] Resubmitting rejected idea does NOT retain old rejection reason
- [ ] Score override does not wipe approval or rejection metadata

---

## 13. Suggested Automation Candidates
- [ ] Login / token persistence
- [ ] Create initiative API chain → approve → verify fields
- [ ] Reject flow with reason validation
- [ ] Edit rejected idea resets state
- [ ] platformClientsImpacted serialization (0, 1, many, all)

---

## 14. Post-Test Cleanup
- [ ] Remove excessive test initiatives if polluting dataset
- [ ] Commit updated `initiatives.json` only if desired
- [ ] Archive test evidence (screenshots, HAR files)

---

## 15. Issues Found
1. 
2. 
3. 

---

## 16. Sign-Off
- [ ] All critical paths validated
- [ ] No P1 / P2 defects open
- [ ] Product Owner approval received

---

## (Legacy) Authentication Testing Checklist

## Pre-Testing Setup

- [ ] Backend server running: `cd backend && npm run dev`
- [ ] Frontend server running: `cd frontend && npm run dev`
- [ ] Browser open at: `http://localhost:5173`
- [ ] Backend API accessible at: `http://localhost:3000`

## Test 1: Login as Product Owner

- [ ] See login form on page load
- [ ] Enter username: `po_admin`
- [ ] Enter password: `po123456`
- [ ] Click "Sign in"
- [ ] ✅ Should see: "Welcome, Product Owner!" message
- [ ] ✅ Should see: User info in header (Product Owner badge)
- [ ] ✅ Should be redirected to Submit Idea page

## Test 2: Submit Idea as PO

- [ ] Fill out idea form:
  - Problem Statement: "Manual timesheet approval takes too long"
  - Proposed Solution: "Automated timesheet approval system"
  - Target Users: "All employees and managers"
  - Desired Outcome: "Reduce approval time by 80%"
- [ ] Click "Generate AI Analysis"
- [ ] ✅ Should see: Loading spinner
- [ ] ✅ Should see: AI Review page with business value score
- [ ] ✅ Should see: Value range (e.g., "£500k - £1m")
- [ ] ✅ Should see: Cost Saving or Value Generation badge
- [ ] Click "Submit Initiative"
- [ ] ✅ Should see: "Your idea has been successfully submitted!" message
- [ ] ✅ Should be redirected to Approval Dashboard

## Test 3: Approve Initiative as PO

- [ ] Click "Approval Dashboard" in header
- [ ] ✅ Should see: List of initiatives with value ranges and type badges
- [ ] Click on an initiative (any status = pending_approval)
- [ ] ✅ Should see: Modal with full initiative details
- [ ] ✅ Should see: Approve and Reject buttons (PO only)
- [ ] Click "Approve & Create Initiative"
- [ ] ✅ Should see: "Initiative approved! ADO Work Item #XXXXX created."
- [ ] ✅ Modal should close
- [ ] ✅ Initiative status should change to "Approved"

## Test 4: Reject Initiative as PO

- [ ] Submit another test idea (or use existing pending one)
- [ ] Go to Approval Dashboard
- [ ] Click on a pending initiative
- [ ] Click "Reject" button
- [ ] ✅ Should see: Rejection reason textarea
- [ ] Enter reason: "Duplicate of initiative #123"
- [ ] Click "Confirm Rejection"
- [ ] ✅ Should see: Modal close
- [ ] ✅ Initiative status should change to "Rejected"

## Test 5: Logout as PO

- [ ] Click "Logout" button in header
- [ ] ✅ Should see: Login form again
- [ ] ✅ Should NOT see: Main app content

## Test 6: Login as Regular User

- [ ] Enter username: `john_user`
- [ ] Enter password: `user123456`
- [ ] Click "Sign in"
- [ ] ✅ Should see: "Welcome, John Smith!" message
- [ ] ✅ Should see: User info in header (User role, not PO)

## Test 7: Submit Idea as Regular User

- [ ] Fill out and submit an idea (same process as Test 2)
- [ ] ✅ Should work exactly the same as PO

## Test 8: Try to Approve as Regular User

- [ ] Go to Approval Dashboard
- [ ] Click on a pending initiative
- [ ] ✅ Should see: Modal with initiative details
- [ ] ✅ Should NOT see: Approve/Reject buttons
- [ ] ✅ Should see: "Only Product Owners can approve or reject initiatives." message
- [ ] Close modal
- [ ] ✅ Confirmed: Regular users cannot approve/reject

## Test 9: Token Persistence

- [ ] Stay logged in as john_user
- [ ] Refresh the page (F5)
- [ ] ✅ Should NOT see: Login form
- [ ] ✅ Should see: Still logged in as John Smith
- [ ] ✅ Initiatives still loaded

## Test 10: Invalid Login

- [ ] Logout
- [ ] Try to login with:
  - Username: `wrong_user`
  - Password: `wrong_pass`
- [ ] ✅ Should see: Error message "Invalid username or password"
- [ ] ✅ Should NOT be logged in

## Test 11: API Protection

Open browser developer tools (F12) and try:

```javascript
// Try to get initiatives without auth token
localStorage.removeItem('auth_token');
fetch('http://localhost:3000/api/initiatives')
  .then(r => r.json())
  .then(console.log);
```

- [ ] ✅ Should see: 401 Unauthorized error
- [ ] ✅ Should be redirected to login

## Test 12: Role-Based API Protection

```javascript
// Login as regular user first, then try:
fetch('http://localhost:3000/api/initiatives/some-id-here', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  },
  body: JSON.stringify({ status: 'approved' })
}).then(r => r.json()).then(console.log);
```

- [ ] ✅ Should see: 403 Forbidden error
- [ ] ✅ Message: "Insufficient permissions"

## Test 13: Visual Indicators

Check that UI properly shows role differences:

**As PO:**
- [ ] ✅ Header shows "Product Owner" in indigo badge
- [ ] ✅ Initiative detail modal has Approve/Reject buttons

**As Regular User:**
- [ ] ✅ Header shows "User" in gray text
- [ ] ✅ Initiative detail modal has info message instead of buttons

## Test 14: Value Ranges & Type Display

- [ ] Submit multiple ideas with different outcomes
- [ ] ✅ Should see different business value scores (1-10)
- [ ] ✅ Should see corresponding value ranges:
  - Score 9-10: "Critical" / "Legal/Compliance"
  - Score 7-8: "> £1m"
  - Score 5-6: "£500k - £1m"
  - Score 3-4: "£250k - £500k"
  - Score 1-2: "< £250k"
- [ ] ✅ Some marked "Cost Saving" (green badge)
- [ ] ✅ Some marked "Value Generation" (blue badge)

## Issues Found

Document any issues here:

1. 
2. 
3. 

## Notes

- All tests should be performed in a clean browser session (or incognito mode)
- Clear localStorage between major test scenarios if needed
- Backend must be running for all tests
- Check browser console for any errors

---

**All tests passed?** 🎉 Your authentication system is working perfectly!
