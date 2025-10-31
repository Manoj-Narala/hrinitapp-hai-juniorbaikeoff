# API Testing Guide

This document provides examples for testing the HR Approval App for Initiative (HAI) API.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Health Check

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

---

### 2. Generate AI Analysis

**Request:**
```http
POST /api/analyze
Content-Type: application/json

{
  "problemStatement": "Our manual onboarding process is slow and error-prone",
  "proposedSolution": "Build an automated onboarding portal for new hires",
  "targetUsers": "New Hires, HR Admins, Hiring Managers",
  "desiredOutcome": "Reduce onboarding time by 50% and improve satisfaction"
}
```

**Response:**
```json
{
  "statementOfWork": "This initiative aims to...",
  "businessValueScore": 7,
  "businessValueJustification": "This initiative scores 7 because..."
}
```

---

### 3. Get All Initiatives

**Request:**
```http
GET /api/initiatives
```

**With Status Filter:**
```http
GET /api/initiatives?status=pending_approval
```

**Response:**
```json
[
  {
    "id": "uuid-here",
    "status": "pending_approval",
    "submittedBy": "user_abc123",
    "submittedAt": "2025-01-20T10:00:00.000Z",
    "idea": { ... },
    "aiAnalysis": { ... }
  }
]
```

---

### 4. Get Single Initiative

**Request:**
```http
GET /api/initiatives/{id}
```

**Response:**
```json
{
  "id": "uuid-here",
  "status": "pending_approval",
  "submittedBy": "user_abc123",
  "submittedAt": "2025-01-20T10:00:00.000Z",
  "idea": {
    "problemStatement": "...",
    "proposedSolution": "...",
    "targetUsers": "...",
    "desiredOutcome": "..."
  },
  "aiAnalysis": {
    "statementOfWork": "...",
    "businessValueScore": 7,
    "businessValueJustification": "..."
  }
}
```

---

### 5. Create New Initiative

**Request:**
```http
POST /api/initiatives
Content-Type: application/json

{
  "idea": {
    "problemStatement": "Problem description",
    "proposedSolution": "Solution description",
    "targetUsers": "Target audience",
    "desiredOutcome": "Expected outcome"
  },
  "aiAnalysis": {
    "statementOfWork": "SoW text",
    "businessValueScore": 7,
    "businessValueJustification": "Justification"
  },
  "submittedBy": "user_abc123"
}
```

**Response:**
```json
{
  "id": "new-uuid",
  "status": "pending_approval",
  "submittedAt": "2025-01-20T10:00:00.000Z",
  ...
}
```

---

### 6. Approve Initiative

**Request:**
```http
PATCH /api/initiatives/{id}
Content-Type: application/json

{
  "status": "approved"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "approved",
  "approvedAt": "2025-01-20T10:00:00.000Z",
  "adoWorkItemId": 12345,
  ...
}
```

---

### 7. Reject Initiative

**Request:**
```http
PATCH /api/initiatives/{id}
Content-Type: application/json

{
  "status": "rejected",
  "rejectionReason": "Does not align with current priorities"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "rejected",
  "rejectedAt": "2025-01-20T10:00:00.000Z",
  "rejectionReason": "Does not align with current priorities",
  ...
}
```

---

### 8. Delete Initiative

**Request:**
```http
DELETE /api/initiatives/{id}
```

**Response:**
```json
{
  "message": "Initiative deleted successfully",
  "initiative": { ... }
}
```

---

## Testing with PowerShell

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

### Get All Initiatives
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/initiatives" -Method Get
```

### Create Initiative
```powershell
$body = @{
    idea = @{
        problemStatement = "Test problem"
        proposedSolution = "Test solution"
        targetUsers = "Test users"
        desiredOutcome = "Test outcome"
    }
    aiAnalysis = @{
        statementOfWork = "Test SoW"
        businessValueScore = 5
        businessValueJustification = "Test justification"
    }
    submittedBy = "test_user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/initiatives" -Method Post -Body $body -ContentType "application/json"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "required": ["problemStatement", "proposedSolution", "targetUsers", "desiredOutcome"]
}
```

### 404 Not Found
```json
{
  "error": "Initiative not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate AI analysis",
  "message": "API request failed with status: 429"
}
```

---

## Status Values

- `pending_approval` - Awaiting review
- `approved` - Approved and ADO work item created
- `rejected` - Rejected with reason
