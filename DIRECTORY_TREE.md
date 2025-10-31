# HR Approval App for Initiative (HAI) - Complete File Structure

```
c:\Users\FRAFEEK\Desktop\initapp\
│
├── 📁 backend/                          # Express.js Backend Server
│   ├── server.js                        # Main Express server (API routes)
│   ├── db.js                           # JSON database utilities
│   ├── aiService.js                    # Gemini AI integration service
│   ├── package.json                    # Backend dependencies
│   ├── .env.example                    # Environment template
│   └── .env                            # Environment config (create this!)
│
├── 📁 frontend/                         # Vue.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── AppHeader.vue           # Navigation header
│   │   │   ├── IdeaForm.vue            # Idea submission form (4 fields)
│   │   │   ├── AIReview.vue            # AI analysis review page
│   │   │   ├── ApprovalDashboard.vue   # Initiative dashboard/list
│   │   │   ├── InitiativeDetailModal.vue   # Detail modal for approve/reject
│   │   │   ├── BusinessValueScaleReference.vue  # BV scale visual guide
│   │   │   ├── LoadingSpinner.vue      # Reusable loading spinner
│   │   │   └── MessageBox.vue          # Alert/message component
│   │   ├── App.vue                     # Root Vue component
│   │   ├── main.js                     # Vue app entry point
│   │   └── api.js                      # Axios API client
│   ├── index.html                      # HTML template
│   ├── vite.config.js                  # Vite dev server config
│   └── package.json                    # Frontend dependencies
│
├── 📁 data/                             # JSON File Database
│   ├── initiatives.json                # Main database (auto-created)
│   ├── initiatives.sample.json         # Sample data for testing
│   └── .gitkeep                        # Keep directory in git
│
├── 📁 node_modules/                     # Dependencies (auto-generated)
│
├── 📄 README.md                         # Comprehensive documentation
├── 📄 QUICKSTART.md                     # Quick start guide
├── 📄 API_TESTING.md                    # API testing guide
├── 📄 ARCHITECTURE.md                   # System architecture
├── 📄 PROJECT_SUMMARY.md                # Project summary
├── 📄 DIRECTORY_TREE.md                 # This file
│
├── 📦 package.json                      # Root package.json (scripts)
├── 🚫 .gitignore                        # Git ignore rules
│
├── ⚙️ setup.bat                         # Windows setup script
└── ▶️ start.bat                         # Windows start script

```

## File Count by Category

| Category | Count | Description |
|----------|-------|-------------|
| Vue Components | 8 | Reusable UI components |
| Backend Services | 3 | Server, DB, AI service |
| Configuration | 5 | package.json, vite.config, .env |
| Documentation | 6 | README, guides, architecture |
| Automation | 2 | setup.bat, start.bat |
| Data | 2 | JSON database files |
| **TOTAL** | **26+** | Core project files |

## Technology by File

### JavaScript Files (.js)
```
backend/server.js         - Express.js REST API
backend/db.js            - JSON file database CRUD
backend/aiService.js     - Gemini AI integration
frontend/src/main.js     - Vue app initialization
frontend/src/api.js      - Axios HTTP client
frontend/vite.config.js  - Vite configuration
```

### Vue Components (.vue)
```
frontend/src/App.vue                           - Root component (page router)
frontend/src/components/AppHeader.vue          - Header with navigation
frontend/src/components/IdeaForm.vue           - 4-field submission form
frontend/src/components/AIReview.vue           - Review AI analysis
frontend/src/components/ApprovalDashboard.vue  - Initiative list/filter
frontend/src/components/InitiativeDetailModal.vue - Approve/reject modal
frontend/src/components/BusinessValueScaleReference.vue - BV scale visual
frontend/src/components/LoadingSpinner.vue     - Loading animation
frontend/src/components/MessageBox.vue         - Success/error messages
```

### Configuration Files
```
backend/package.json      - Express, cors, dotenv, uuid, node-fetch
backend/.env.example      - Environment template
backend/.env             - API keys (YOU CREATE THIS!)
frontend/package.json    - Vue, Vite, Axios
frontend/vite.config.js  - Dev server + proxy config
package.json            - Root scripts (install:all, dev:*, etc.)
.gitignore             - Ignore node_modules, .env, etc.
```

### Data Files (.json)
```
data/initiatives.json        - Main database (auto-created)
data/initiatives.sample.json - Sample initiative for testing
```

### Documentation Files (.md)
```
README.md           - Full documentation (installation, usage, API)
QUICKSTART.md       - Quick start guide (3 steps)
API_TESTING.md      - API endpoint examples
ARCHITECTURE.md     - System architecture diagrams
PROJECT_SUMMARY.md  - Feature summary and overview
DIRECTORY_TREE.md   - This file
```

### Scripts (.bat)
```
setup.bat  - Automated setup (npm install both, create .env)
start.bat  - Start both servers in separate windows
```

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |
| Gemini AI | 443 | https://generativelanguage.googleapis.com |

## Key Dependencies

### Backend
```json
{
  "express": "^4.18.2",      // Web framework
  "cors": "^2.8.5",          // CORS support
  "dotenv": "^16.3.1",       // Environment variables
  "uuid": "^9.0.1",          // Unique IDs
  "node-fetch": "^2.7.0"     // HTTP client for AI API
}
```

### Frontend
```json
{
  "vue": "^3.3.4",                    // UI framework
  "axios": "^1.6.0",                  // HTTP client
  "@vitejs/plugin-vue": "^4.4.0",     // Vite Vue plugin
  "vite": "^5.0.0"                    // Build tool
}
```

## Line Count Estimate

| File Type | Files | Est. Lines |
|-----------|-------|-----------|
| Vue Components | 8 | ~1,500 |
| JavaScript | 6 | ~800 |
| JSON Config | 6 | ~150 |
| Documentation | 6 | ~1,200 |
| Scripts | 2 | ~100 |
| **TOTAL** | **28** | **~3,750** |

## Setup Sequence

```
1. Run setup.bat
   ├── Installs backend dependencies
   ├── Installs frontend dependencies
   └── Creates .env file

2. Edit backend/.env
   └── Add GEMINI_API_KEY

3. Run start.bat
   ├── Starts backend on :3000
   └── Starts frontend on :5173

4. Open browser
   └── Navigate to http://localhost:5173
```

## Development Workflow

```
┌─────────────────────────────────────┐
│  1. Edit Vue components             │
│     → Hot reload (instant)          │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. Edit backend API                │
│     → Nodemon restarts server       │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  3. Test in browser                 │
│     → Changes reflected immediately │
└─────────────────────────────────────┘
```

## Folder Sizes (Approximate)

```
backend/           ~50 KB (code only)
frontend/src/      ~150 KB (code only)
data/              ~1 KB (JSON files)
node_modules/      ~200 MB (dependencies)
documentation/     ~100 KB (markdown files)
```

## Git Repository Structure

```
main/
├── backend/         (tracked)
├── frontend/        (tracked)
├── data/            (tracked - empty folder)
├── *.md             (tracked - documentation)
├── *.bat            (tracked - scripts)
├── package.json     (tracked)
└── .gitignore       (tracked)

Ignored:
├── backend/.env              (API keys - NEVER commit!)
├── backend/node_modules/     (dependencies)
├── frontend/node_modules/    (dependencies)
├── data/initiatives.json     (user data)
└── *.log                     (logs)
```

---

**Navigation Tips:**
- Start with `QUICKSTART.md` to get running
- Read `README.md` for full documentation
- Check `API_TESTING.md` to test endpoints
- Review `ARCHITECTURE.md` to understand the system
- Use `PROJECT_SUMMARY.md` for feature overview
