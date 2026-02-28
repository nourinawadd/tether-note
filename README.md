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
- Docker (containerised for deployment)

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
│   ├── services
│   ├── app.js
│   └── Dockerfile
└── frontend
    ├── public
    │   └── assets
    │       ├── images
    │       │   └── envelopes
    │       ├── fonts
    │       └── audio
    └── src
        ├── api
        ├── components
        │   ├── auth
        │   ├── dashboard
        │   └── ui
        ├── constants
        ├── hooks
        ├── pages
        ├── styles
        ├── utils
        └── App.jsx
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
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASSWORD=your_gmail_app_password
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

## ✦ Deployment (Frontend on Vercel + Backend on Render via Docker)

### Backend — Docker + Render

#### Step 1: Build and test the Docker image locally
Make sure Docker Desktop is running, then from inside the `backend/` folder:

```bash
docker build -t tether-note-backend:latest .
```

Test it locally:
```bash
docker run --name tether-backend -d -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI=your_mongo_uri \
  -e JWT_SECRET=your_secret \
  -e JWT_EXPIRES_IN=7d \
  -e EMAIL_USER=your_email \
  -e EMAIL_PASSWORD=your_password \
  -e FRONTEND_URL=http://localhost:5173 \
  tether-note-backend
```

Visit `http://localhost:5000/health` to confirm it's running.

#### Step 2: Push to Docker Hub
```bash
# Log in
docker login -u your_dockerhub_username

# Tag the image
docker tag tether-note-backend:latest your_dockerhub_username/tether-note-backend:latest

# Push
docker push your_dockerhub_username/tether-note-backend:latest
```

#### Step 3: Deploy on Render
1. Go to [render.com](https://render.com) and log in (no credit card needed for free tier).
2. Click **New → Web Service**.
3. Choose **"Deploy an existing image from a registry"**.
4. Enter your image URL: `docker.io/your_dockerhub_username/tether-note-backend:latest`
5. Give it a name, pick a region, select the **Free** instance type.
6. Under **Environment Variables**, add:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
   - `JWT_EXPIRES_IN=7d`
   - `EMAIL_USER=...`
   - `EMAIL_PASSWORD=...`
   - `FRONTEND_URL=https://<your-vercel-domain>`
   - `FRONTEND_URLS=https://<your-vercel-domain>`
7. Click **Deploy**. Render will give you a public URL like `https://tether-note-backend.onrender.com`.

#### Updating the backend
Rebuild and push a new image — Render will automatically redeploy:
```bash
docker build -t tether-note-backend:latest .
docker tag tether-note-backend:latest your_dockerhub_username/tether-note-backend:latest
docker push your_dockerhub_username/tether-note-backend:latest
```

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after idle may be slow while the instance wakes up.

---

### Frontend — Vercel
1. Import this repo in Vercel and set **Root Directory** to `frontend`.
2. Build settings can stay default for Vite (`npm run build`, output `dist`).
3. In Vercel Project Environment Variables, set:
   - `VITE_API_URL=https://<your-render-backend-url>`
4. Redeploy after env changes.

### CORS reminder
Backend CORS allows origins listed in `FRONTEND_URLS` (comma-separated) or `FRONTEND_URL`. If you use a custom Vercel domain, add it to `FRONTEND_URLS`.

## ✦ API Highlights
- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `GET /user` (auth required)
- `PUT /user` (auth required)
- `GET /notes` (auth required)
- `POST /notes` (auth required)
- `GET /notes/:id` (auth required)
- `DELETE /notes/:id` (auth required)
- `GET /health`

## ✦ Credits
- Product & development: **Nourin Awad**
- Built with: React, Vite, Node.js, Express, MongoDB, Mongoose, Docker
- Audio helper package: [`use-sound`](https://www.npmjs.com/package/use-sound)

## ✦ License
This project is currently shared as a portfolio project. Add a formal license if you plan to open-source it publicly.