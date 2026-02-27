# Tether Note

A full-stack web app for writing notes to your future self and unlocking them at a chosen date.

## ✦ Overview
Tether Note lets users create time-locked notes, receive reminders before unlock time, and revisit messages when they become available. The app is designed as a portfolio project that demonstrates product thinking, full-stack architecture, and polished UI execution.

## ✦ Tech Stack

### Frontend
- React 19 + Vite
- React Router
- CSS modules/files for custom UI styling
- `use-sound` for ambient/audio interactions

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT-based authentication
- Nodemailer + cron-based reminder service

## ✦ Core Features
- Secure sign up/sign in flow
- Create future notes with unlock dates
- Read available notes in a dashboard experience
- View locked/unlocked states for each note
- Email reminder pipeline before unlock time
- Profile management endpoints

## ✦ Project Structure
```text
.
├── backend
│   ├── controllers
│   ├── database
│   ├── middleware
│   ├── models
│   ├── routes
│   └── services
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── hooks
    │   └── api
    └── public
```

## ✦ Local Development

### 1) Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables
Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASS=your_email_password
FROM_EMAIL=your_from_email
```

### 3) Run the app
In one terminal:
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd frontend
npm run dev
```

## ✦ Deployment Notes (Render)
- Deploy backend as a **Web Service**.
- Set backend environment variables in Render dashboard.
- Deploy frontend as a **Static Site**.
- Point frontend API base URL to your deployed backend URL.
- Set `FRONTEND_URL` (or `FRONTEND_URLS`) on backend to the deployed frontend origin for CORS.

## ✦ API Highlights
- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `GET /user` (auth required)
- `GET /notes` (auth required)
- `POST /notes` (auth required)
- `GET /health`

## ✦ Credits
- Product & development: **Nourin Awad**
- Built with: React, Vite, Node.js, Express, MongoDB, Mongoose
- Audio helper package: [`use-sound`](https://www.npmjs.com/package/use-sound)

## ✦ License
This project is currently shared as a portfolio project. Add a formal license if you plan to open-source it publicly.
