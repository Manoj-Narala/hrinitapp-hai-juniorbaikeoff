# HR Approval App for Initiative (HAI)

A full-stack application for managing HR initiatives with automated analysis and role-based authentication. Built with Vue.js frontend, Express.js backend, and JSON file-based database.

## 🔐 User Authentication

The application includes secure user authentication with two roles:

**Product Owner (PO)**
- Username: `po_admin`
- Password: `po123456`
- Can submit ideas AND approve/reject initiatives

**Regular User**
- Username: `john_user`
- Password: `user123456`
- Can submit ideas only

📖 **[Complete Authentication Guide](./AUTHENTICATION.md)**

## Features

- 💡 **Idea Submission**: Submit HR initiative ideas with problem statements, solutions, target users, and desired outcomes
- 🤖 **Automated Analysis**: Automatic analysis using rule-based logic to generate Statement of Work and Business Value scores
- 📊 **Approval Dashboard**: Review, approve, or reject initiatives with detailed metrics
- 💾 **Simple Storage**: JSON file-based database for easy setup and portability
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Express.js** - Web framework for Node.js
- **Node.js** - JavaScript runtime
- **Rule-based Analysis** - Automated business value calculation
- **JSON File Storage** - Simple file-based database

## Project Structure

```
initapp/
├── backend/              # Express.js backend
│   ├── server.js        # Main server file
│   ├── db.js            # Database utilities
│   ├── aiService.js     # Rule-based analysis service
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment variables template
├── frontend/            # Vue.js frontend
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── App.vue      # Main app component
│   │   ├── api.js       # API client
│   │   └── main.js      # Entry point
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   └── package.json     # Frontend dependencies
└── data/                # JSON database files
    └── initiatives.json # Initiatives storage
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone or navigate to the project directory

```bash
cd c:\Users\FRAFEEK\Desktop\initapp
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables (Optional)

Create a `.env` file in the `backend` directory if you need to customize settings:

```bash
cd ../backend
copy .env.example .env
```

The default configuration works out of the box:

```env
PORT=3000
NODE_ENV=development
```

## Running the Application

You'll need to run both the backend and frontend servers.

### Start the Backend Server

Open a terminal in the `backend` directory:

```bash
cd backend
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend will run on **http://localhost:3000**

### Start the Frontend Development Server

Open another terminal in the `frontend` directory:

```bash
cd frontend
npm run dev
```

The frontend will run on **http://localhost:5173**

## Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Submit an Idea**:
   - Click "Submit Idea" in the navigation
   - Fill in the form with your HR initiative details
   - Click "Generate Analysis & SoW"
   - Review the AI-generated analysis
   - Submit for approval

3. **Review Initiatives**:
   - Click "Approval Dashboard" in the navigation
   - Filter by status (Pending, Approved, Rejected, All)
   - Click on any initiative to view details
   - Approve or reject with feedback

## API Endpoints

### Backend API (http://localhost:3000/api)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/analyze` | Generate AI analysis for an idea |
| GET | `/initiatives` | Get all initiatives (optional ?status filter) |
| GET | `/initiatives/:id` | Get single initiative |
| POST | `/initiatives` | Create new initiative |
| PATCH | `/initiatives/:id` | Update initiative (approve/reject) |
| DELETE | `/initiatives/:id` | Delete initiative |

## Business Value Scale

The AI uses the following scale to evaluate initiatives:

- **10-9 (Critical)**: Legal or Compliance requirements
- **8-7 (Significant)**: Value > £1m or urgent tech debt
- **6-5 (High Value)**: Value > £500k
- **4-3 (Medium Value)**: Value > £250k
- **2-1 (Low Value)**: Value < £250k

## Development

### Backend Development

The backend uses `nodemon` for auto-reloading during development:

```bash
cd backend
npm run dev
```

### Frontend Development

Vite provides hot module replacement (HMR) for instant updates:

```bash
cd frontend
npm run dev
```

### Building for Production

To build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use, you can change them:

- **Backend**: Edit `PORT` in `.env`
- **Frontend**: Edit `server.port` in `vite.config.js`

### Database Issues

If the database file gets corrupted, simply delete `data/initiatives.json` and restart the backend. It will create a fresh database file.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
