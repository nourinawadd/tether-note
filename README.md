# Tether Note - Send Notes to Your Future Self

## Overview
Tether Note is a MERN stack application that allows users to send notes to their future selves. Users can log in, compose notes with scheduled delivery dates, and view upcoming notes that will be delivered soon.

## Features
- User authentication (login/signup)
- Create notes with future delivery dates
- View upcoming notes (scheduled for delivery soon)
- Secure storage of personal notes
- Clean, intuitive user interface

## Technology Stack
- **MongoDB**: Database for storing users and notes
- **Express.js**: Backend framework
- **React.js**: Frontend library (implied by MERN, though current structure shows HTML/CSS/JS)
- **Node.js**: JavaScript runtime environment
- **TypeScript**: Used for backend development

## Project Structure

### Backend
```
backend/
├── controllers/        # Business logic
│   ├── authController.ts  # Authentication handlers
│   └── noteController.ts  # Note-related handlers
├── middlewares/        # Middleware functions
│   └── authMiddleware.ts  # Authentication middleware
├── models/             # Database models
│   ├── Note.ts           # Note model/schema
│   └── User.ts           # User model/schema
├── routes/             # API routes
│   ├── authRoutes.ts     # Authentication routes
│   └── noteRoutes.ts     # Note-related routes
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── .env                # Environment variables
├── package.json        # Backend dependencies
└── tsconfig.json       # TypeScript configuration
```

### Frontend
```
frontend/
├── dashboard.html      # Dashboard page
├── index.html          # Main landing page
├── main.js             # Frontend JavaScript
├── style.css           # Stylesheet
└── write.html          # Note composition page
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account or local MongoDB installation
- Git

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/nourinawadd/tether-note.git
   cd tether-note
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your environment variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Set up the frontend:
   ```bash
   cd ../frontend
   ```

6. Open `index.html` in your browser to use the application.

## Usage
1. Register for an account or log in if you already have one
2. Click "Write a Note" to compose a new message to your future self
3. Set a delivery date for when you want to receive the note
4. View your "Coming Soon" notes on the dashboard
5. Notes will automatically appear when their delivery date arrives

## Future Enhancements
- Add email notifications for delivered notes
- Implement note categories/tags
- Add rich text formatting options
- Develop mobile applications
- Enable note sharing with others

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Made By Nourin Awad
