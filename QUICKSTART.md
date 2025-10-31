# Quick Start Guide

## Prerequisites
- Node.js v16+ installed
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🔐 Login Credentials

**Product Owner** (can approve/reject initiatives)
- Username: `po_admin`
- Password: `po123456`

**Regular User** (can only submit ideas)
- Username: `john_user`
- Password: `user123456`

## Option 1: Automated Setup (Recommended)

### 1. Run Setup Script
Double-click `setup.bat` or run in PowerShell:
```powershell
.\setup.bat
```

### 2. Add API Key
Edit `backend\.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start Application
Double-click `start.bat` or run:
```powershell
.\start.bat
```

### 4. Open Browser
Navigate to: http://localhost:5173

**Login** with one of the accounts above and start using the app!

---

## Option 2: Manual Setup

### Backend Setup
```powershell
cd backend
npm install
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

### Frontend Setup (in a new terminal)
```powershell
cd frontend
npm install
npm run dev
```

### Open Browser
Navigate to: http://localhost:5173

---

## First Steps

1. **Submit an Idea**
   - Click "Submit Idea"
   - Fill in the form
   - Click "Generate Analysis & SoW"
   - Review AI analysis
   - Submit for approval

2. **Review Initiatives**
   - Click "Approval Dashboard"
   - View all submissions
   - Click any item to view details
   - Approve or reject

---

## Troubleshooting

### "Port already in use"
- Backend: Change `PORT` in `backend\.env`
- Frontend: Change port in `frontend\vite.config.js`

### "AI service not configured"
- Make sure `GEMINI_API_KEY` is set in `backend\.env`
- Restart the backend server

### Database issues
- Delete `data\initiatives.json`
- Restart backend (it will recreate)

---

## Project Structure

```
initapp/
├── backend/          # Express API server
├── frontend/         # Vue.js application
├── data/            # JSON database
├── setup.bat        # Setup script
├── start.bat        # Start script
└── README.md        # Full documentation
```

---

## Need Help?

See the full README.md for detailed documentation and API reference.
