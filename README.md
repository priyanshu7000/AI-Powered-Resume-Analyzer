# 🚀 AI Resume Analyzer & Job Matcher

A production-ready SaaS application that helps job seekers optimize their resumes using AI and match them with job opportunities.

## ✨ Features

- **AI-Powered Resume Analysis**: Get instant feedback on your resume with ATS optimization tips
- **Missing Skills Detection**: Identify in-demand skills not present in your resume
- **Job Matcher**: Compare your resume with job descriptions and get a match score
- **Dashboard**: Track your resumes and job matches
- **Light/Dark Mode**: Beautiful theme support for better UX
- **Secure Authentication**: JWT-based secure user authentication
- **API Documentation**: Complete Swagger documentation for all APIs

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication (Access + Refresh tokens)
- **OpenAI API** - AI analysis
- **Swagger** - API documentation
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

### Frontend
- **React.js** (v18) - UI framework
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool

## 📦 Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
OPENAI_API_KEY=sk-your-openai-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

5. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:
```
http://localhost:5000/api-docs
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

#### Resume
- `POST /api/resume/upload` - Upload resume PDF
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:resumeId` - Get specific resume
- `POST /api/resume/analyze/:resumeId` - Analyze resume with AI
- `DELETE /api/resume/:resumeId` - Delete resume

#### Job Matching
- `POST /api/ai/match` - Match resume with job
- `GET /api/ai/matches` - Get all matches
- `GET /api/ai/matches/:jobMatchId` - Get specific match
- `DELETE /api/ai/matches/:jobMatchId` - Delete match

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error boundaries and messages
- **Toast Notifications**: Real-time feedback for user actions
- **Data Visualization**: Score displays with color-coded indicators

## 🔐 Security Features

- **CORS Configuration**: Restricted to frontend origin
- **Helmet.js**: Security headers protection
- **Rate Limiting**: Protection against brute force attacks
- **JWT Tokens**: Secure authentication with refresh tokens
- **httpOnly Cookies**: Secure token storage
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcryptjs for secure password storage
- **Error Handling**: Prevented information leakage

## 📁 Project Structure

```
.
├── server/
│   ├── config/           # Database and service configs
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, validation, error handling
│   ├── utils/            # Helper functions
│   ├── docs/             # Swagger configuration
│   ├── server.js         # Main server file
│   └── package.json
│
└── client/
    ├── src/
    │   ├── app/          # Redux store
    │   ├── features/     # Redux slices
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   ├── hooks/        # Custom hooks
    │   ├── utils/        # Helper utilities
    │   ├── theme/        # Theme configuration
    │   ├── App.jsx       # Main app component
    │   └── index.jsx     # Entry point
    ├── public/
    ├── index.html
    └── package.json
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render or Railway
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically on push

#### Environment Variables (Production)
- `MONGODB_URI` - Production MongoDB connection
- `JWT_ACCESS_SECRET` - Production access token secret
- `JWT_REFRESH_SECRET` - Production refresh token secret
- `OPENAI_API_KEY` - OpenAI API key
- `CLIENT_URL` - Frontend production URL
- `NODE_ENV=production`

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

#### Environment Variables
- `VITE_API_URL` - Production API URL

## 🧪 Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## 📝 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Resume
```javascript
{
  userId: ObjectId,
  fileName: String,
  resumeText: String,
  extractedSkills: [String],
  missingSkills: [String],
  atsScore: Number (0-100),
  suggestions: [String],
  analyzed: Boolean,
  createdAt: Date
}
```

### JobMatch
```javascript
{
  userId: ObjectId,
  resumeId: ObjectId,
  jobTitle: String,
  jobDescription: String,
  matchScore: Number (0-100),
  missingKeywords: [String],
  suggestions: [String],
  createdAt: Date
}
```

## 🔑 Environment Variables

### Server `.env`
See `server/.env.example`

### Client `.env.local`
See `client/.env.example`

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a pull request

## 📄 License

MIT License

## 📧 Support

For support, email support@resumeanalyzer.com

---

Built with ❤️ for job seekers everywhere
