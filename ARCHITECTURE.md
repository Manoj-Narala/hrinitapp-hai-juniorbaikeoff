# HR Approval App for Initiative (HAI) - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    http://localhost:5173                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/AJAX
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Vue.js Frontend (Vite)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components:                                              │  │
│  │  • AppHeader           • LoadingSpinner                  │  │
│  │  • IdeaForm            • MessageBox                      │  │
│  │  • AIReview            • BusinessValueScaleReference     │  │
│  │  • ApprovalDashboard   • InitiativeDetailModal           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Client (Axios)                                       │  │
│  │  • Proxy to backend: /api → http://localhost:3000/api    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Express.js Backend (Node.js)                     │
│                    http://localhost:3000                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes:                                              │  │
│  │  GET    /api/health                                       │  │
│  │  POST   /api/analyze                                      │  │
│  │  GET    /api/initiatives                                  │  │
│  │  GET    /api/initiatives/:id                              │  │
│  │  POST   /api/initiatives                                  │  │
│  │  PATCH  /api/initiatives/:id                              │  │
│  │  DELETE /api/initiatives/:id                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services:                                                │  │
│  │  • aiService.js  - Gemini AI integration                 │  │
│  │  • db.js         - Database operations                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────┬──────────────────────┘
                │                         │
                │                         │ HTTPS
                ▼                         ▼
┌───────────────────────────┐  ┌──────────────────────────────────┐
│  JSON File Database       │  │  Google Gemini AI API            │
│  data/initiatives.json    │  │  generativelanguage.googleapis   │
│                           │  │  .com/v1beta/models/             │
│  {                        │  │  gemini-2.0-flash-exp            │
│    "initiatives": [...]   │  │                                  │
│  }                        │  │  • Generate SoW                  │
│                           │  │  • Calculate Business Value      │
│  Operations:              │  │  • Provide Justification         │
│  • read()                 │  │                                  │
│  • write()                │  └──────────────────────────────────┘
│  • getAllInitiatives()    │
│  • getInitiativeById()    │
│  • addInitiative()        │
│  • updateInitiative()     │
│  • deleteInitiative()     │
└───────────────────────────┘
```

## Data Flow

### 1. Submit New Idea Flow

```
User fills form
      │
      ▼
IdeaForm component validates
      │
      ▼
POST /api/analyze
      │
      ▼
aiService.generateAnalysis()
      │
      ▼
Gemini AI API
      │
      ▼
AI analysis returned to frontend
      │
      ▼
AIReview component displays results
      │
      ▼
User confirms submission
      │
      ▼
POST /api/initiatives
      │
      ▼
db.addInitiative()
      │
      ▼
Write to initiatives.json
      │
      ▼
Success response to frontend
      │
      ▼
Navigate to dashboard
```

### 2. Approve/Reject Flow

```
User clicks initiative in dashboard
      │
      ▼
InitiativeDetailModal opens
      │
      ▼
User clicks Approve/Reject
      │
      ▼
PATCH /api/initiatives/:id
      │
      ▼
db.updateInitiative()
      │
      ├─ If approved: Generate ADO Work Item ID (simulated)
      │
      └─ If rejected: Store rejection reason
      │
      ▼
Update initiatives.json
      │
      ▼
Success response to frontend
      │
      ▼
Reload dashboard with updated status
```

## Technology Stack Details

### Frontend Stack
```
Vue.js 3.3.4
  └─ Composition API
  └─ Reactive State Management
  
Vite 5.0.0
  └─ Fast HMR
  └─ Optimized builds
  └─ Dev proxy to backend
  
Axios 1.6.0
  └─ HTTP client
  └─ Promise-based
  
Tailwind CSS (CDN)
  └─ Utility-first styling
  └─ Responsive design
```

### Backend Stack
```
Node.js (v16+)
  └─ JavaScript runtime
  
Express.js 4.18.2
  └─ Web framework
  └─ Middleware support
  └─ RESTful API
  
node-fetch 2.7.0
  └─ HTTP client for Gemini API
  
dotenv 16.3.1
  └─ Environment variables
  
uuid 9.0.1
  └─ Generate unique IDs
  
cors 2.8.5
  └─ Cross-origin support
```

## File Structure

```
initapp/
├── backend/
│   ├── server.js           # Main Express server
│   ├── db.js              # Database utilities
│   ├── aiService.js       # Gemini AI integration
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment template
│   └── .env               # Environment config (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.vue
│   │   │   ├── IdeaForm.vue
│   │   │   ├── AIReview.vue
│   │   │   ├── ApprovalDashboard.vue
│   │   │   ├── InitiativeDetailModal.vue
│   │   │   ├── BusinessValueScaleReference.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── MessageBox.vue
│   │   ├── App.vue        # Root component
│   │   ├── main.js        # Entry point
│   │   └── api.js         # API client
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite config
│   └── package.json       # Frontend dependencies
│
├── data/
│   ├── initiatives.json         # Main database
│   └── initiatives.sample.json  # Sample data
│
├── README.md              # Full documentation
├── QUICKSTART.md          # Quick start guide
├── API_TESTING.md         # API testing guide
├── ARCHITECTURE.md        # This file
├── package.json           # Root package.json
├── setup.bat             # Setup script (Windows)
├── start.bat             # Start script (Windows)
└── .gitignore            # Git ignore rules
```

## Security Considerations

1. **API Key Protection**
   - Gemini API key stored in `.env` (gitignored)
   - Never exposed to frontend

2. **Input Validation**
   - Required fields validated on both frontend and backend
   - SQL injection not applicable (JSON file DB)

3. **CORS**
   - Configured for local development
   - Should be restricted in production

## Scalability Considerations

### Current Implementation (JSON File)
- ✅ Simple and portable
- ✅ No database setup required
- ✅ Easy to backup and version control
- ⚠️ Not suitable for high concurrency
- ⚠️ Limited to single server

### Future Enhancements
- Replace JSON file with MongoDB/PostgreSQL
- Add authentication (JWT)
- Implement WebSocket for real-time updates
- Add file upload for attachments
- Integrate with real Azure DevOps API
- Deploy to cloud (Azure/AWS/Vercel)

## Business Value Scale Logic

The AI uses structured prompting to evaluate initiatives:

| Score | Category | Criteria |
|-------|----------|----------|
| 10-9 | Critical | Legal/Compliance requirements |
| 8-7 | Significant | Value > £1m or urgent tech debt |
| 6-5 | High | Value > £500k |
| 4-3 | Medium | Value > £250k |
| 2-1 | Low | Value < £250k |
