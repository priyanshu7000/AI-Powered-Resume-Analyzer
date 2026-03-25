# 📚 COMPREHENSIVE PROJECT DOCUMENTATION
## AI Resume Analyzer & Job Matcher - Complete Study Guide

**Version:** 1.0.0  
**Last Updated:** March 24, 2026  
**Project Type:** Full-Stack SaaS Application  
**Status:** Production-Ready with AI-Powered Analysis

---

## 📖 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend Architecture](#backend-architecture)
8. [Authentication & Security](#authentication--security)
9. [File Upload & PDF Parsing](#file-upload--pdf-parsing)
10. [AI Analysis System](#ai-analysis-system)
11. [Job Matching System](#job-matching-system)
12. [Setup & Installation](#setup--installation)
13. [Development Workflow](#development-workflow)
14. [Testing & Validation](#testing--validation)
15. [Deployment Guide](#deployment-guide)
16. [Best Practices](#best-practices)
17. [Troubleshooting](#troubleshooting)
18. [Future Roadmap](#future-roadmap)

---

# 1. PROJECT OVERVIEW

## 1.1 Purpose & Goals

**AI Resume Analyzer & Job Matcher** is a sophisticated SaaS platform that leverages artificial intelligence to:

- **Analyze Resumes**: Provide comprehensive ATS (Applicant Tracking System) scoring and feedback
- **Identify Skill Gaps**: Detect in-demand skills missing from user resumes
- **Match Jobs**: Compare resumes with job descriptions and provide match scores
- **Suggest Improvements**: Generate actionable recommendations to improve ATS compatibility

### Core Value Proposition
```
BEFORE: User has no idea if their resume is good
  ↓
AFTER: User gets AI-powered feedback with:
  • Realistic ATS score (20-100)
  • Individual component scores
  • Specific missing skills
  • Actionable improvement suggestions
  • Job matching insights
```

## 1.2 Key Features

### For Job Seekers
✅ **Resume Analysis**
- AI-powered ATS scoring (0-100)
- 5-component breakdown (Formatting, Keywords, Structure, Length, Readability)
- Skill extraction and categorization
- Professional suggestions (High/Medium/Low Impact)

✅ **Resume Management**
- Multiple resume uploads
- Resume versioning and history
- Track improvement over time

✅ **Job Matching**
- Compare resume to job descriptions
- Match percentage calculation
- Missing keywords identification
- Improvement suggestions

✅ **Dashboard**
- View all resumes
- See analysis history
- Track progress

✅ **User Experience**
- Intuitive interface
- Light/Dark mode
- Mobile responsive
- Real-time feedback

### For Developers
✅ **API Documentation**
- Swagger/OpenAPI documentation at `/api-docs`
- Comprehensive REST API
- Clear request/response examples

✅ **Security**
- JWT-based authentication
- Secure password hashing (bcryptjs)
- CORS protection
- Rate limiting
- Helmet security headers

✅ **Scalability**
- Modular architecture
- Separation of concerns
- Easy to extend

## 1.3 User Journey

```
New User
  ↓
Register/Login
  ↓
Upload Resume (PDF)
  ↓
System extracts text
  ↓
Analyze Resume
  ↓
Get AI ATS Score + Feedback
  ↓
View Missing Skills
  ↓
Optionally: Match with Job
  ↓
Get Job Match Score
  ↓
View Recommendations
  ↓
Download Improved Resume or Apply to Jobs
```

---

# 2. TECHNOLOGY STACK

## 2.1 Backend Stack

### Runtime & Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v18+ | JavaScript runtime |
| Express.js | 4.18.2 | Web framework |
| Nodemon | 3.0.2 | Dev auto-reload |

### Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| MongoDB | 7.0+ | NoSQL database |
| Mongoose | 7.6.3 | ODM for MongoDB |

### Authentication
| Technology | Version | Purpose |
|-----------|---------|---------|
| JWT | 9.0.0 | Token-based auth |
| bcryptjs | 2.4.3 | Password hashing |

### AI & APIs
| Technology | Version | Purpose |
|-----------|---------|---------|
| Groq SDK | 1.1.1 | Primary AI API (unlimited free) |
| Google Generative AI | 0.3.0 | Fallback AI API (Gemini) |
| PDF-Parse | 1.1.1 | PDF text extraction |

### Security & Middleware
| Technology | Version | Purpose |
|-----------|---------|---------|
| Helmet | 7.1.0 | Security headers |
| CORS | 2.8.5 | Cross-origin requests |
| Express Rate Limit | 7.0.0 | Rate limiting |
| Joi | 17.11.0 | Input validation |

### Utilities
| Technology | Version | Purpose |
|-----------|---------|---------|
| Dotenv | 16.3.1 | Environment variables |
| Axios | 1.6.2 | HTTP client |
| Multer | 1.4.5 | File upload handling |
| Swagger | 6.2.8 | API documentation |

## 2.2 Frontend Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI library |
| React DOM | 18.2.0 | React rendering |
| Vite | 5.0.8 | Build tool (fast bundler) |

### State Management
| Technology | Version | Purpose |
|-----------|---------|---------|
| Redux | 4.2.1 | State management |
| Redux Toolkit | 1.9.7 | Redux utilities |
| React-Redux | 8.1.3 | React-Redux bindings |

### Routing & Navigation
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Router DOM | 6.20.1 | Client-side routing |

### Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | 3.4.1 | Utility-first CSS |
| PostCSS | 8.4.32 | CSS processing |
| Autoprefixer | 10.4.16 | CSS vendor prefixes |

### UI Components & Utilities
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Hot Toast | 2.4.1 | Notifications |
| Lucide React | 0.294.0 | Icon library |
| Recharts | 2.10.4 | Charts/graphs |
| Axios | 1.6.2 | HTTP client |

### Development Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| Vite Plugin React | 4.2.1 | React Fast Refresh |
| ESLint | 8.55.0 | Code linting |
| ESLint Plugin React | 7.33.2 | React linting rules |

## 2.3 Development & DevOps Tools

### Version Control
- **Git** - Source code management
- **GitHub** - Repository hosting

### Environment
- **.env** files for configuration
- Environment variables for secrets

### Database Tools
- **MongoDB Atlas** (cloud) or local MongoDB
- **Mongoose** for schema validation

### APIs
- **Groq API** - AI analysis (primary)
- **Google Generative AI** - Backup AI
- **Swagger** - API documentation & testing

---

# 3. SYSTEM ARCHITECTURE

## 3.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (React)                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Pages: Home, Login, Register, Dashboard, UploadResume   │ │
│  │        ResumeDetails, JobMatcher                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Components: Button, Card, Modal, Toast, Loader, Navbar, │ │
│  │            Input, ErrorBoundary                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Redux Slices: authSlice, resumeSlice, jobSlice,        │ │
│  │              uiSlice                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Services: api.js (Axios + interceptors)                │ │
│  │ Hooks: useAuth, useToast, useLoader, useConfirmation   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND LAYER (Express.js)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Routes:                                                 │ │
│  │  /api/auth - Authentication (register, login, logout)  │ │
│  │  /api/resume - Resume operations (upload, analyze)    │ │
│  │  /api/ai - Job matching                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Middleware:                                            │ │
│  │  auth.js - JWT verification                           │ │
│  │  validation.js - Input validation                     │ │
│  │  fileUpload.js - Multer file handling                │ │
│  │  errorHandler.js - Error responses                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Controllers:                                           │ │
│  │  authController - Register, Login, Logout            │ │
│  │  resumeController - Upload, Analyze, Get             │ │
│  │  jobMatchController - Match resume to job            │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Services (Business Logic):                           │ │
│  │  authService - User auth logic                       │ │
│  │  resumeService - Resume processing & analysis        │ │
│  │  jobMatchService - Job matching logic                │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Utilities:                                             │ │
│  │  jwt.js - Token creation & verification              │ │
│  │  pdfParser.js - PDF text extraction                  │ │
│  │  aiAnalysis.js - AI-powered resume analysis          │ │
│  │  customError.js - Error handling                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
        ↓                              ↓                ↓
    ┌────────────┐          ┌──────────────────┐    ┌──────────┐
    │  MongoDB   │          │  Groq API        │    │ Gemini   │
    │  Database  │          │ (Primary AI)     │    │ (Backup) │
    └────────────┘          └──────────────────┘    └──────────┘
```

## 3.2 Data Flow Architecture

### Resume Upload & Analysis Flow
```
1. User selects PDF file
2. Frontend sends POST /api/resume/upload
   ├─ File validation (Multer middleware)
   ├─ PDF text extraction
   └─ Store in MongoDB

3. Frontend sends POST /api/resume/analyze/:resumeId
   ├─ Fetch resume from DB
   ├─ Call AI Analysis (Groq primary, Gemini fallback)
   │   ├─ Analyze ATS score
   │   ├─ Extract skills
   │   ├─ Identify missing skills
   │   ├─ Generate suggestions
   │   └─ Provide breakdown
   ├─ Validate AI response
   ├─ Store analysis in MongoDB
   └─ Return to frontend

4. Frontend displays:
   ├─ ATS Score (0-100)
   ├─ Score breakdown (5 components)
   ├─ Skills extracted
   ├─ Missing skills
   └─ Suggestions (High/Medium/Low impact)
```

### Job Matching Flow
```
1. User selects resume & job description
2. Frontend sends POST /api/ai/match
   └─ Body contains resumeId, jobDescription, jobTitle

3. Backend processes:
   ├─ Fetch resume text
   ├─ Call AI (Groq primary, Gemini fallback)
   │   ├─ Extract job requirements
   │   ├─ Check matches in resume
   │   ├─ Calculate match percentage
   │   ├─ Identify missing keywords
   │   └─ Generate suggestions
   ├─ Validate response
   └─ Return to frontend

4. Frontend displays:
   ├─ Match score (%)
   ├─ Present keywords ✓
   ├─ Missing keywords ✗
   └─ Improvement suggestions
```

## 3.3 Request-Response Cycle

```
User Action → [Frontend]
             ↓
          Redux dispatch
             ↓
         Axios API call
         (+ JWT token in header)
             ↓
        [Express Server]
             ↓
          CORS check
             ↓
        Rate limiter
             ↓
      Route matching
             ↓
    Middleware chain
    (validators, auth)
             ↓
        Controller
             ↓
        Service layer
        (business logic)
             ↓
      MongoDB query
             or
      External API call
             ↓
      Response formatting
             ↓
        Send to frontend
             ↓
        [Frontend]
             ↓
      Axios interceptor
             ↓
      Redux update
             ↓
      Component re-render
             ↓
      User sees result
```

---

# 4. DATABASE SCHEMA

## 4.1 MongoDB Collections

### User Schema

```javascript
{
  _id: ObjectId,
  name: String,           // User's full name (required, 2-50 chars)
  email: String,          // Email (required, unique, lowercase)
  password: String,       // Hashed password (bcryptjs)
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date,        // Last update timestamp
}
```

**Indexes:**
- `email` - Unique index for quick login
- `createdAt` - For user analytics

---

### Resume Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User (required)
  fileName: String,       // Original file name (e.g., "resume.pdf")
  resumeText: String,     // Full extracted text from PDF (max 50KB)
  
  // Analysis Results
  analyzed: Boolean,      // Whether analysis has been performed
  atsScore: Number,       // Final ATS score (0-100)
  
  atsBreakdown: {
    formatting: Number,           // (0-100)
    keywordOptimization: Number,  // (0-100)
    structure: Number,            // (0-100)
    length: Number,               // (0-100)
    readability: Number           // (0-100)
  },
  
  // Skills
  extractedSkills: [String],      // All identified skills
  missingSkills: [String],        // In-demand skills not found
  
  skillCategories: {
    technical: [String],          // Programming languages, frameworks, etc.
    softSkills: [String],         // Leadership, communication, etc.
    tools: [String],              // Git, Docker, Jira, etc.
    languages: [String]           // Spoken languages
  },
  
  skillProficiency: [
    {
      skill: String,                          // Skill name
      category: String,                       // technical|softSkills|tools|languages
      proficiencyLevel: String,               // Beginner|Intermediate|Advanced|Expert
      yearsOfExperience: Number               // Optional years
    }
  ],
  
  // Suggestions
  suggestions: [String],          // General improvement suggestions
  
  categorizedSuggestions: {
    highImpact: [
      {
        title: String,
        description: String,
        category: String  // formatting|content|skills|structure
      }
    ],
    mediumImpact: [...],
    lowImpact: [...]
  },
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` - Find resumes by user
- `atsScore` - Sort resumes by score
- `createdAt` - Recent resumes

---

### Job Match Schema (Optional - for history)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  resumeId: ObjectId,
  jobDescription: String,
  jobTitle: String,
  
  // Matching Results
  matchScore: Number,       // 0-100 match percentage
  missingKeywords: [String],
  presentKeywords: [String],
  suggestions: [String],
  
  // Metadata
  createdAt: Date
}
```

## 4.2 Schema Relationships

```
User (1) ──→ (Many) Resume
User (1) ──→ (Many) JobMatch
Resume (1) ──→ (Many) JobMatch
```

## 4.3 Example Data

### Sample User Document
```json
{
  "_id": ObjectId("6507a1b2c3d4e5f6a7b8c9d0"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$xK5zQ3p9...", // hashed
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z"
}
```

### Sample Resume Document
```json
{
  "_id": ObjectId("6507a1b2c3d4e5f6a7b8c9d1"),
  "userId": ObjectId("6507a1b2c3d4e5f6a7b8c9d0"),
  "fileName": "john-doe-resume.pdf",
  "resumeText": "John Doe\nEmail: john@example.com\nPhone: ...",
  "analyzed": true,
  "atsScore": 68,
  "atsBreakdown": {
    "formatting": 70,
    "keywordOptimization": 65,
    "structure": 70,
    "length": 70,
    "readability": 65
  },
  "extractedSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "missingSkills": ["TypeScript", "Docker", "Kubernetes"],
  "skillCategories": {
    "technical": ["JavaScript", "React", "Node.js", "MongoDB"],
    "softSkills": ["Leadership", "Communication"],
    "tools": ["Git", "VS Code"],
    "languages": ["English"]
  },
  "skillProficiency": [
    {
      "skill": "JavaScript",
      "category": "technical",
      "proficiencyLevel": "Advanced",
      "yearsOfExperience": 5
    }
  ],
  "categorizedSuggestions": {
    "highImpact": [
      {
        "title": "Add Professional Summary",
        "description": "Include 2-3 sentence summary at top",
        "category": "structure"
      }
    ],
    "mediumImpact": [],
    "lowImpact": []
  },
  "createdAt": "2024-02-10T15:20:00Z",
  "updatedAt": "2024-02-10T15:25:00Z"
}
```

---

# 5. API REFERENCE

## 5.1 Authentication Endpoints

### POST /api/auth/register
**Register a new user**

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation:**
- `name`: 2-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Min 6 characters, required

---

### POST /api/auth/login
**Authenticate user and get tokens**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set:**
- `refreshToken`: httpOnly, secure, sameSite=strict (7 days)

---

### POST /api/auth/refresh
**Refresh access token**

**Headers:**
```
Cookie: refreshToken=xxx
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST /api/auth/logout
**Logout and invalidate tokens**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 5.2 Resume Endpoints

### POST /api/resume/upload
**Upload a resume PDF**

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <binary PDF data>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resume": {
    "id": "resume_id",
    "fileName": "resume.pdf",
    "analyzed": false,
    "createdAt": "2024-03-24T10:30:00Z"
  }
}
```

**Validation:**
- File must be PDF
- Max file size: 10MB
- User must be authenticated

---

### POST /api/resume/analyze/:resumeId
**Analyze uploaded resume**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "resume": {
    "id": "resume_id",
    "fileName": "resume.pdf",
    "atsScore": 68,
    "atsBreakdown": {
      "formatting": 70,
      "keywordOptimization": 65,
      "structure": 70,
      "length": 70,
      "readability": 65
    },
    "extractedSkills": ["JavaScript", "React", "Node.js"],
    "missingSkills": ["TypeScript", "Docker"],
    "skillCategories": {
      "technical": ["JavaScript", "React", "Node.js"],
      "softSkills": [],
      "tools": ["Git"],
      "languages": ["English"]
    },
    "skillProficiency": [
      {
        "skill": "JavaScript",
        "category": "technical",
        "proficiencyLevel": "Advanced",
        "yearsOfExperience": 5
      }
    ],
    "categorizedSuggestions": {
      "highImpact": [],
      "mediumImpact": [],
      "lowImpact": []
    },
    "analyzed": true,
    "createdAt": "2024-03-24T10:30:00Z",
    "updatedAt": "2024-03-24T10:35:00Z"
  }
}
```

---

### GET /api/resume
**Get all user's resumes**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
```
sort: -createdAt (optional, default)
page: 1 (optional)
limit: 10 (optional)
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "resumes": [
    { "id": "resume_id_1", "fileName": "resume-v1.pdf", "atsScore": 68 },
    { "id": "resume_id_2", "fileName": "resume-v2.pdf", "atsScore": 72 },
    { "id": "resume_id_3", "fileName": "resume-v3.pdf", "atsScore": 75 }
  ]
}
```

---

### GET /api/resume/:resumeId
**Get specific resume details**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "resume": {
    // Full resume document with analysis
  }
}
```

---

### DELETE /api/resume/:resumeId
**Delete a resume**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## 5.3 Job Matching Endpoints

### POST /api/ai/match
**Match resume with job description**

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```json
{
  "resumeId": "resume_id",
  "jobDescription": "We're looking for a Senior Developer with 5+ years...",
  "jobTitle": "Senior Full-Stack Developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "match": {
    "matchScore": 68,
    "missingKeywords": ["Docker", "Kubernetes", "AWS", "DevOps"],
    "presentKeywords": ["JavaScript", "React", "Node.js"],
    "suggestions": [
      "Add Docker and Kubernetes experience",
      "Highlight AWS/cloud infrastructure knowledge",
      "Include CI/CD pipeline experience"
    ]
  }
}
```

---

## 5.4 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resume not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# 6. FRONTEND ARCHITECTURE

## 6.1 Folder Structure

```
client/
├── src/
│   ├── App.jsx              # Root component
│   ├── index.jsx            # Entry point
│   ├── index.css            # Global styles
│   │
│   ├── app/
│   │   └── store.js         # Redux store configuration
│   │
│   ├── components/          # Reusable components
│   │   ├── Button.jsx       # Button component
│   │   ├── Card.jsx         # Card wrapper
│   │   ├── Input.jsx        # Form input
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Loader.jsx       # Loading component
│   │   ├── Spinner.jsx      # Spinner animation
│   │   ├── Toast.jsx        # Toast notification
│   │   ├── Modal.jsx        # Modal dialog
│   │   ├── ErrorBoundary.jsx  # Error handling
│   │   ├── ToastContainer.jsx # Toast container
│   │   └── index.js         # Export all components
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── UploadResume.jsx # Resume upload
│   │   ├── ResumeDetails.jsx  # Resume analysis view
│   │   └── JobMatcher.jsx   # Job matching page
│   │
│   ├── features/            # Redux slices
│   │   ├── authSlice.js     # Auth state
│   │   ├── resumeSlice.js   # Resume state
│   │   ├── jobSlice.js      # Job matching state
│   │   └── uiSlice.js       # UI state
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Auth hook
│   │   ├── useToast.js      # Toast hook
│   │   ├── useLoader.js     # Loader hook
│   │   ├── useConfirmation.js # Confirmation dialog
│   │   ├── useSessionSecurity.js # Session security
│   │   └── index.js         # Export hooks
│   │
│   ├── services/            # API services
│   │   └── api.js           # Axios instance + interceptors
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.js       # Helper functions
│   │   └── requestQueue.js  # Request queue for throttling
│   │
│   ├── constants/           # Constants
│   │   └── errorMessages.js # Error message constants
│   │
│   ├── theme/               # Theming
│   │   └── themeConfig.js   # Dark/Light mode config
│   │
│   └── public/              # Static assets
│       └── favicon.ico
│
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
└── package.json             # Dependencies
```

## 6.2 Redux State Structure

```javascript
{
  auth: {
    user: {
      id: "user_id",
      name: "John",
      email: "john@example.com"
    },
    token: "access_token",
    loading: false,
    error: null
  },
  resume: {
    resumes: [
      {
        id: "resume_id",
        fileName: "resume.pdf",
        atsScore: 68,
        analyzed: true
      }
    ],
    currentResume: {
      id: "resume_id",
      atsScore: 68,
      atsBreakdown: {...},
      extractedSkills: [...],
      missingSkills: [...]
    },
    uploading: false,
    analyzing: false,
    error: null
  },
  job: {
    matcher: {
      resumeId: "resume_id",
      jobDescription: "...",
      matchScore: 68,
      missingKeywords: [...],
      presentKeywords: [...]
    },
    loading: false,
    error: null
  },
  ui: {
    theme: "light", // or "dark"
    sidebarOpen: true,
    notifications: [],
    loading: false
  }
}
```

## 6.3 Component Hierarchy

```
App
├── Navbar
├── ErrorBoundary
└── Routes
    ├── Home
    │   └── Login
    ├── Register
    ├── Dashboard
    │   ├── ResumeCard
    │   ├── AnalyticsPanel
    │   └── RecentMatches
    ├── UploadResume
    │   ├── FileInput
    │   └── UploadProgress
    ├── ResumeDetails
    │   ├── ATSScoreCard
    │   ├── SkillsPanel
    │   ├── SuggestionsPanel
    │   └── MatchHistory
    └── JobMatcher
        ├── ResumeSelector
        ├── JobDescriptionInput
        └── MatchResults

Modals & Overlays
├── ToastContainer
├── LoaderContainer
└── ConfirmationModalContainer
```

## 6.4 Key Frontend Features

### Authentication Flow
```
Login Form
  ↓
Redux dispatch: loginUser(email, password)
  ↓
API: POST /api/auth/login
  ↓
Store token in state
  ↓
Redirect to Dashboard
```

### Resume Upload Flow
```
FileInput
  ↓
User selects PDF
  ↓
Redux dispatch: uploadResume(file)
  ↓
API: POST /api/resume/upload (multipart)
  ↓
Show Toast: "Resume uploaded!"
  ↓
Redirect to ResumeDetails
  ↓
Trigger Analysis
```

### Resume Analysis Flow
```
ResumeDetails page loaded
  ↓
Redux dispatch: analyzeResume(resumeId)
  ↓
Show Loader
  ↓
API: POST /api/resume/analyze/:resumeId
  ↓
Wait 2-30 seconds (AI processing)
  ↓
Receive analysis data
  ↓
Redux update with results
  ↓
Render:
├─ ATS Score (prominent display)
├─ 5-component breakdown (progress bars)
├─ Skills found
├─ Missing skills
└─ Suggestions (categorized)
```

## 6.5 Styling Strategy

### Tailwind CSS Classes Used
- **Layout:** `flex`, `grid`, `container`, `w-full`
- **Spacing:** `p-4`, `m-6`, `gap-4`
- **Colors:** `bg-blue-500`, `text-gray-700`
- **Responsive:** `md:`, `lg:`, `sm:`
- **Theme:** Custom CSS variables for dark mode

### Dark Mode Implementation
```javascript
// themeConfig.js
export const themes = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200'
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-white',
    border: 'border-gray-700'
  }
};
```

---

# 7. BACKEND ARCHITECTURE

## 7.1 Folder Structure

```
server/
├── server.js            # Entry point
├── package.json         # Dependencies
├── .env                 # Environment variables
│
├── config/
│   ├── database.js      # MongoDB connection
│   └── openai.js        # AI API configuration
│
├── models/              # Database schemas
│   ├── User.js          # User schema
│   ├── Resume.js        # Resume schema
│   └── JobMatch.js      # Job match schema (optional)
│
├── controllers/         # Request handlers
│   ├── authController.js      # Auth logic
│   ├── resumeController.js    # Resume operations
│   └── jobMatchController.js  # Job matching
│
├── services/            # Business logic
│   ├── authService.js         # Auth service
│   ├── resumeService.js       # Resume processing
│   └── jobMatchService.js     # Job matching logic
│
├── routes/              # API routes
│   ├── authRoutes.js    # /api/auth routes
│   ├── resumeRoutes.js  # /api/resume routes
│   └── jobMatchRoutes.js # /api/ai routes
│
├── middleware/          # Express middleware
│   ├── auth.js          # JWT verification
│   ├── validation.js    # Input validation
│   ├── fileUpload.js    # Multer configuration
│   ├── errorHandler.js  # Error handling
│   └── requestLogger.js # Request logging
│
├── utils/               # Utility functions
│   ├── jwt.js           # JWT creation & verification
│   ├── pdfParser.js     # PDF text extraction
│   ├── aiAnalysis.js    # AI analysis (CORE - Groq + Gemini)
│   ├── customError.js   # Custom error class
│   ├── validators.js    # Validation schemas
│   └── helpers.js       # Helper functions
│
├── docs/                # API documentation
│   └── swaggerConfig.js # Swagger/OpenAPI config
│
├── test/                # Tests
│   ├── auth.test.js
│   ├── resume.test.js
│   └── data/            # Test data
│
└── logs/                # Application logs (created at runtime)
    ├── error.log
    └── combined.log
```

## 7.2 Request Processing Pipeline

```
1. Request arrives
   ↓
2. Helmet middleware (security headers)
   ↓
3. CORS middleware (cross-origin check)
   ↓
4. Rate limiter (100 requests per 15 mins)
   ↓
5. Body parser (JSON parsing)
   ↓
6. Route matching
   ↓
7. Authentication middleware (if needed)
   - Extract token from header
   - Verify JWT signature & expiry
   - Attach user to request
   ↓
8. Validation middleware (if needed)
   - Validate request body
   - Validate file uploads
   ↓
9. Controller
   ↓
10. Service (business logic)
    ├─ Database queries
    ├─ API calls
    └─ Data transformation
    ↓
11. Response formatting
    ↓
12. Send to client
```

## 7.3 Core Backend Services

### authService.js
**Handles user authentication**

```javascript
Functions:
- registerUser(name, email, password)
  ├─ Validate input
  ├─ Check if email exists
  ├─ Hash password with bcryptjs
  ├─ Create user in DB
  └─ Return user object

- loginUser(email, password)
  ├─ Find user by email
  ├─ Compare password hash
  ├─ Generate JWT tokens (access + refresh)
  └─ Return tokens + user

- logoutUser()
  └─ Clear refresh token

- refreshToken(refreshToken)
  ├─ Verify refresh token
  └─ Generate new access token
```

### resumeService.js
**Handles resume operations**

```javascript
Functions:
- uploadResume(userId, file)
  ├─ Validate PDF file
  ├─ Extract text from PDF
  ├─ Store in MongoDB
  └─ Return resume object

- analyzeResume(resumeId, userId)
  ├─ Fetch resume from DB
  ├─ Call AI analysis (Groq → Gemini)
  ├─ Validate AI response
  ├─ Store analysis in DB
  └─ Return analysis results

- getUserResumes(userId)
  └─ Fetch all user's resumes (sorted by date)

- getResumeById(resumeId, userId)
  └─ Fetch specific resume with analysis

- deleteResume(resumeId, userId)
  └─ Remove resume from DB
```

### jobMatchService.js
**Handles job matching**

```javascript
Functions:
- matchResume(resumeText, jobDescription, jobTitle)
  ├─ Call AI matching (Groq → Gemini)
  ├─ Validate response
  ├─ Calculate match score
  ├─ Identify missing keywords
  └─ Generate suggestions
```

## 7.4 Utility Files

### jwt.js - Token Management
```javascript
Functions:
- generateTokens(userId)
  ├─ Create access token (15 min expiry)
  ├─ Create refresh token (7 days expiry)
  └─ Return both tokens

- verifyToken(token)
  ├─ Verify JWT signature
  ├─ Check expiry
  └─ Extract payload

- decodeToken(token)
  └─ Decode without verification
```

### pdfParser.js - PDF Processing
```javascript
Functions:
- extractTextFromPDF(buffer)
  ├─ Parse PDF binary
  ├─ Extract all text
  └─ Return cleaned text

- validatePDFBuffer(buffer)
  ├─ Check file magic bytes
  └─ Validate PDF structure
```

### aiAnalysis.js - AI Analysis (Core)
**This is the HEART of the system**

```javascript
Functions:
- analyzeResumeWithAI(resumeText)
  ├─ Try Groq API (primary)
  ├─ If fails, try Gemini API (fallback)
  ├─ Parse AI response
  ├─ Validate & normalize
  └─ Return analysis:
     ├─ atsScore (0-100)
     ├─ atsBreakdown (5 components)
     ├─ extractedSkills
     ├─ missingSkills
     ├─ skillCategories
     ├─ skillProficiency
     └─ categorizedSuggestions

- matchJobDescription(resumeText, jobDesc, jobTitle)
  ├─ Try Groq API (primary)
  ├─ If fails, try Gemini API (fallback)
  ├─ Parse AI response
  ├─ Validate response
  └─ Return match:
     ├─ matchScore (0-100)
     ├─ presentKeywords
     ├─ missingKeywords
     └─ suggestions

Internal Functions:
- analyzeWithGroq(resumeText)
  └─ Call Groq API with detailed prompt

- analyzeWithGemini(resumeText)
  └─ Call Gemini API with detailed prompt

- extractAndParseJSON(content)
  ├─ Handle markdown-wrapped JSON
  ├─ Parse JSON
  └─ Handle errors

- validateAnalysis(analysis)
  ├─ Ensure all fields present
  ├─ Validate data types
  ├─ Normalize values
  └─ Return validated object
```

### Groq vs Gemini Prompts

Both use **realistic ATS scoring** guidance:

**Key Difference:**
- Groq: `temperature: 0.5` (consistent)
- Gemini: `temperature: 0.5` (consistent)
- Both: Same scoring criteria

**Prompt Structure:**
```
1. You are an expert ATS resolver
2. CALCULATE **ACCURATE ATS SCORES**
3. Be REALISTIC with scores (not inflated)
4. Score ranges explained
5. Return ONLY valid JSON
6. Specific scoring guidelines
```

---

# 8. AUTHENTICATION & SECURITY

## 8.1 Authentication Flow

### Registration
```
User submits form
  ↓
Validate: name (2-50 chars), email (format), password (6+ chars)
  ↓
Check if email exists in DB
  ↓
If exists: Return error "Email already registered"
  ↓
Hash password with bcryptjs (10 salt rounds)
  ↓
Create user in MongoDB
  ↓
Auto-login: Generate tokens
  ↓
Return user + accessToken
  ↓
Frontend stores token + redirects to Dashboard
```

### Login
```
User submits credentials
  ↓
Find user by email
  ↓
If not found: Return "Invalid credentials"
  ↓
Compare entered password with stored hash
  ↓
If mismatch: Return "Invalid credentials"
  ↓
Generate JWT tokens:
├─ accessToken (15 minutes) - in response body
├─ refreshToken (7 days) - in httpOnly cookie
  ↓
Return user + accessToken
  ↓
Frontend stores token
  ↓
Redirect to Dashboard
```

### Logout
```
User clicks logout
  ↓
Frontend removes token from storage
  ↓
Frontend clears Redux state
  ↓
Optional: POST /api/auth/logout (invalidate server-side)
  ↓
Redirect to Home/Login
```

### Token Refresh
```
Frontend makes API request
  ↓
Check if accessToken expired
  ↓
If expired, use refreshToken (in cookies)
  ↓
POST /api/auth/refresh
  ↓
Verify refreshToken signature
  ↓
If valid: Generate new accessToken
  ↓
Return new accessToken
  ↓
Retry original request
  ↓
If refreshToken also expired: Redirect to login
```

## 8.2 JWT Token Structure

### Access Token
```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id",
  "iat": 1711214400,      // Issued at
  "exp": 1711215300       // Expires in 15 minutes
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "JWT_SECRET_KEY"
)
```

### Refresh Token
```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id",
  "type": "refresh",
  "iat": 1711214400,
  "exp": 1711819200       // Expires in 7 days
}

Signature: HMACSHA256(..., "REFRESH_TOKEN_SECRET")
```

## 8.3 Security Measures

### Password Security
- **Hashing:** bcryptjs with 10 salt rounds
- **Comparison:** Secure constant-time comparison (bcryptjs)
- **Storage:** Never store plain text passwords
- **Requirements:** Min 6 characters (recommend stronger)

### Token Security
- **Access Token:** Short-lived (15 minutes)
- **Refresh Token:** Long-lived (7 days), httpOnly cookie
- **Secret Keys:** Stored in .env, never exposed
- **Signature:** HMAC SHA256 prevents tampering

### Network Security
- **HTTPS:** Required in production
- **CORS:** Restricted to specific origins
- **HSTS:** Helmet enforces HTTPS
- **CSP:** Content Security Policy headers

### File Upload Security
- **Validation:** Check MIME type + file extension
- **Size Limit:** Max 10MB
- **Scanning:** Would benefit from virus scanning
- **Storage:** Secure server-side storage

### Request Security
- **Rate Limiting:** 100 requests per 15 minutes
- **Input Validation:** Joi schemas for all inputs
- **SQL Injection:** Not applicable (MongoDB)
- **XSS:** Helmet removes dangerous headers

### Session Security
- **httpOnly Cookies:** Prevent JavaScript access
- **Secure Flag:** Only send over HTTPS
- **SameSite:** Prevent CSRF attacks
- **CORS:** Restrict cross-origin requests

## 8.4 Environment Variables for Security

```bash
# Auth
JWT_SECRET_KEY=your-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=refresh-secret-key-min-32-chars
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# API Keys
GROQ_API_KEY=your-groq-api-key
GEMINI_API_KEY=your-gemini-api-key

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

# 9. FILE UPLOAD & PDF PARSING

## 9.1 File Upload Process

### Multer Configuration
```javascript
// middleware/fileUpload.js
const upload = multer({
  dest: './uploads',              // Temporary storage
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024     // 10MB limit
  }
});
```

### Upload Flow
```
1. Frontend sends multipart/form-data
2. Multer middleware intercepts
3. Validates MIME type (application/pdf)
4. Checks file size (max 10MB)
5. Saves to temporary directory with unique name
6. Passes `req.file` to controller
7. Controller extracts text
8. Deletes temporary file
9. Stores path/text in MongoDB
```

## 9.2 PDF Parsing

### PDF Parser Implementation

```javascript
// utils/pdfParser.js
import PDFParser from 'pdf-parse';
import fs from 'fs';

export const extractTextFromPDF = async (buffer) => {
  try {
    // Parse PDF binary buffer
    const data = await PDFParser(buffer);
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 0; i < data.numpages; i++) {
      fullText += data.text;
    }
    
    // Clean text
    fullText = fullText
      .replace(/\r\n/g, '\n')  // Normalize line breaks
      .replace(/\f/g, '\n')    // Remove form feeds
      .replace(/\n{3,}/g, '\n\n'); // Remove excessive blank lines
    
    return fullText;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

export const validatePDFBuffer = (buffer) => {
  // Check PDF magic bytes
  const pdfMagic = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
  
  if (!buffer.slice(0, 4).equals(pdfMagic)) {
    throw new Error('Invalid PDF file');
  }
};
```

### Extracted Text Example
```
Input: resume.pdf (binary)
  ↓ (PDF extraction)
Output: 
"John Doe
Email: john@example.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced Full-Stack Developer with 5+ years...

EXPERIENCE
Senior Developer | Tech Company | 2020-Present
- Developed React applications...
- Improved performance by 40%...
"
```

## 9.3 Text Cleaning & Preparation

```javascript
const cleanResumeText = (text) => {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters (keep alphanumeric, spaces, basic punctuation)
    .replace(/[^a-zA-Z0-9\s\.\,\-\(\)]/g, '')
    // Trim
    .trim();
};
```

---

# 10. AI ANALYSIS SYSTEM

## 10.1 Core AI Analysis Architecture

### System Overview
```
Resume Upload
  ↓
Extract Text (PDF Parser)
  ↓
Prepare Text (clean, limit to 50KB)
  ↓
Call AI Analysis
  ├─ Primary: Groq API
  │   └─ Model: mixtral-8x7b-32768
  │   └─ Speed: 2-3 seconds
  │   └─ Free tier: Unlimited
  │
  └─ Fallback: Gemini API
      └─ Model: gemini-2.5-flash
      └─ Speed: 1-2 seconds
      └─ Free tier: Limited quota
  ↓
Parse AI Response (extract JSON)
  ↓
Validate & Normalize
  ↓
Store in MongoDB
  ↓
Display to User
```

## 10.2 AI Analysis Prompts

### Resume Analysis Prompt (Groq)
```
You are an expert ATS (Applicant Tracking System) resume analyzer. 
Analyze this resume exactly like real ATS systems do 
(LinkedIn Recruiter, Greenhouse, Workday, etc.).

CALCULATE **ACCURATE ATS SCORES** based on:
1. FORMATTING (0-100): Is resume parseable? 
   Clear structure, standard fonts, proper spacing, 
   no graphics/images that break parsing
   
2. KEYWORD OPTIMIZATION (0-100): 
   Industry-relevant keywords, technical skills, 
   tools, job titles mentioned
   
3. STRUCTURE (0-100): 
   Has Contact Info → Summary → Experience → 
   Education → Skills sections in logical order
   
4. LENGTH (0-100): 
   Optimal resume length (0.5-2 pages is ideal, 
   score accordingly)
   
5. READABILITY (0-100): 
   Easy to scan, bullet points, clear hierarchy, 
   white space usage

Be REALISTIC with scores:
- A resume with NO contact info, scattered format, 
  missing sections = 20-35
- Basic resume with some skills, acceptable format = 45-60
- Well-structured, complete sections, 
  good formatting = 65-80
- Excellent formatting + strong keywords + 
  complete info = 85-95
- RARELY give 95+ unless truly exceptional

[Resume text inserted here]

Return ONLY valid JSON with:
{
  "skills": ["array of skills found"],
  "missingSkills": ["in-demand skills NOT in resume"],
  "atsScore": number 0-100,
  "suggestions": ["improvement suggestions"],
  "categorizedSuggestions": {
    "highImpact": [...],
    "mediumImpact": [...],
    "lowImpact": [...]
  },
  "atsBreakdown": {
    "formatting": number,
    "keywordOptimization": number,
    "structure": number,
    "length": number,
    "readability": number
  },
  "skillCategories": {...},
  "skillProficiency": [...]
}
```

### Job Matching Prompt (Groq)
```
You are an expert resume-to-job matcher. 
Analyze how well this resume matches job requirements.

CALCULATE **ACCURATE MATCHING SCORE** (0-100):
- Extract all KEY REQUIREMENTS from job description
  (skills, experience level, certs, tools, years)
- Check what % of key requirements are in resume
- Consider relevance and exact matches vs. similar skills
- Be realistic: Random matches don't count, 
  only genuine matches

Scoring Guide:
- 0-20: No relevant experience/skills match
- 20-40: Very few relevant skills/experience
- 40-60: Some skills but missing requirements
- 60-75: Most covered but gaps remain
- 75-90: Strong match with minor gaps
- 90-100: Excellent, nearly all present

[Resume text]
[Job description]

Return ONLY JSON:
{
  "matchScore": number 0-100,
  "missingKeywords": ["top 15 NOT in resume"],
  "presentKeywords": ["important skills present"],
  "suggestions": ["ways to improve"]
}
```

## 10.3 AI Analysis Response Handling

### Groq API Call
```javascript
const message = await groq.messages.create({
  model: 'mixtral-8x7b-32768',
  max_tokens: 2048,
  messages: [
    {
      role: 'user',
      content: prompt  // Our detailed prompt above
    }
  ],
  temperature: 0.5,  // Consistency over creativity
});

// Response contains:
// message.content[0].type === 'text'
// message.content[0].text === JSON response
```

### JSON Extraction & Validation
```javascript
// Extract JSON from possible markdown wrapping
let jsonString = response.text.trim();
const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
if (jsonMatch) {
  jsonString = jsonMatch[1].trim();
}

// Parse JSON
const analysis = JSON.parse(jsonString);

// Validate structure
validateAnalysis(analysis);
```

## 10.4 ATS Score Calculation Logic

**Note:** Score is calculated by AI, not hardcoded. Here's how AI should think:

### Formatting Score Calculation
```
Points for:
✓ Contact info present (+15)
✓ Clear sections (+15)
✓ Consistent formatting (+15)
✓ No graphics/images (+10)
✓ Professional fonts (+10)
✓ Proper spacing (+10)
✓ No unusual colors (+10)
✓ Parseable with PDF parser (+5)

Base: 50, Max: 100
```

### Keyword Optimization Score
```
Points for:
✓ Each identified technical skill (+3-5)
✓ Each soft skill (+2-3)
✓ Each tool mentioned (+2)
✓ Action verbs used (+10)
✓ Industry jargon (+15)
✓ Company name mentioned (+5)

Base: 30, Max: 100
(Depends on how many skills/keywords found)
```

### Structure Score
```
Points for EACH section:
✓ Contact Info (20)
✓ Professional Summary/Objective (15)
✓ Experience section (20)
✓ Education section (15)
✓ Skills section (15)
✓ Certifications (10)
✓ Projects section (10)

Each present = full points
Missing section = 0 points for that category

Base: 0-100
```

### Length Score
```
0-0.5 pages: 30
0.5-1 page: 70
1-1.5 pages: 90
1.5-2 pages: 100
2-3 pages: 70
3+ pages: 40
```

### Readability Score
```
Points for:
✓ Primarily bullet points (+20)
✓ Clear hierarchy/indentation (+20)
✓ Adequate white space (+15)
✓ Short sentences (+15)
✓ Concise descriptions (+15)
✓ No walls of text (+10)
✓ Easy to scan (+5)

Base: 0, Max: 100
```

## 10.5 ATS Score Examples

### Poor Resume (Score: 28)
```
NO contact info, scattered format, missing sections
└─ Formatting: 25 (poor structure)
└─ Keywords: 20 (few skills mentioned)
└─ Structure: 15 (missing major sections)
└─ Length: 30 (too short)
└─ Readability: 35 (hard to scan)
Average = 28
```

### Average Resume (Score: 65)
```
Has basics, some structure, decent content
└─ Formatting: 63 (okay but could improve)
└─ Keywords: 60 (some skills, but incomplete)
└─ Structure: 70 (most sections present)
└─ Length: 67 (within range)
└─ Readability: 62 (decent but could improve)
Average = 64-65
```

### Excellent Resume (Score: 85)
```
Complete, well-formatted, strong keywords
└─ Formatting: 87 (very clean)
└─ Keywords: 85 (many relevant skills)
└─ Structure: 88 (all sections present, logical)
└─ Length: 90 (perfect length)
└─ Readability: 82 (easy to scan)
Average = 86-88
```

---

# 11. JOB MATCHING SYSTEM

## 11.1 Matching Algorithm

### Approach: AI-Powered (not regex-based)

```
Job Description
├─ Extract requirements
├─ Identify key skills
├─ Determine nice-to-haves
└─ Assess experience level

Resume
├─ Extract skills
├─ Extract experience
├─ Identify specialties
└─ Identify gaps

Matching Logic (AI):
├─ Match skills (exact, partial, similar)
├─ Match experience (years)
├─ Match tools/tech stack
├─ Match soft skills
├─ Match education/certs
└─ Match seniority level

Score Calculation:
├─ Required skills: 40% weight
├─ Nice-to-have skills: 20% weight
├─ Experience level: 20% weight
├─ Tools/Tech: 15% weight
├─ Soft skills: 5% weight
└─ Final Score = weighted average
```

## 11.2 Match Score Examples

### Low Match (Score: 42)
```
Resume: "5 years front-end development"
Job: "Senior Backend Engineer - AWS, Kubernetes, Docker"

Present: JavaScript, React, HTML/CSS
Missing: Python/Java/Go, AWS, Kubernetes, Docker, 
         Microservices, DevOps, Backend systems design
Match: 42% (framework skills don't match backend stack)
```

### Medium Match (Score: 65)
```
Resume: "Full-Stack Developer, JS, React, Node.js, MongoDB"
Job: "Full-Stack Developer - MERN stack + Docker"

Present: JavaScript, React, Node.js, MongoDB, Full-stack
Missing: Docker, CI/CD, Production deployment
Match: 65% (good overlap but missing DevOps skills)
```

### High Match (Score: 86)
```
Resume: "Senior Full-Stack: JS, React, Node.js, MongoDB, 
         Docker, AWS, CI/CD, 7 years experience"
Job: "Senior Full-Stack Developer - MERN + Docker + AWS"

Present: JavaScript, React, Node.js, MongoDB, Docker, 
         AWS, CI/CD, Senior level
Missing: Advanced Kubernetes (not required)
Match: 86% (excellent overlap, almost all required)
```

## 11.3 Matching Output

```json
{
  "matchScore": 72,
  "presentKeywords": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "API Design",
    "RESTful APIs"
  ],
  "missingKeywords": [
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD Pipeline",
    "Microservices Architecture",
    "Load Balancing",
    "Caching Strategies"
  ],
  "suggestions": [
    "Add Docker containerization experience to boost match by 8%",
    "Include AWS/cloud deployment knowledge (very in-demand)",
    "Highlight CI/CD pipeline experience if you have it",
    "Consider learning Kubernetes for senior roles",
    "Microservices architecture experience would help"
  ]
}
```

---

# 12. SETUP & INSTALLATION

## 12.1 Prerequisites

- **Node.js** v18+ with npm
- **MongoDB** (local or Atlas cloud)
- **Git** for version control
- **API Keys:**
  - Groq API key (free signup at console.groq.com)
  - Gemini API key (optional, free at makersuite.google.com)

## 12.2 Backend Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer/server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Configure .env
```bash
# Authentication
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=refresh-secret-key-min-32-chars
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer

# AI APIs
GROQ_API_KEY=gsk_xxxxx  # From console.groq.com
GEMINI_API_KEY=AIzaSyxxxxxxx  # From makersuite.google.com

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### 5. Start Backend
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📚 Swagger docs available at http://localhost:5000/api-docs
🏥 Health check at http://localhost:5000/health
Database connected
```

## 12.3 Frontend Setup

### 1. Navigate to Frontend
```bash
cd ../client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File (if needed)
```bash
# .env (optional, defaults to localhost:5000)
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
 VITE v5.0.8  ready in 345ms
  
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 12.4 Database Setup

### Using MongoDB Atlas (Cloud)

1. **Create Account:** mongodb.com/cloud/atlas
2. **Create Cluster:** Free tier available
3. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```
4. **Add IP Whitelist:** Allow 0.0.0.0/0 for development
5. **Paste in .env:** `MONGODB_URI=...`

### Using Local MongoDB

1. **Install MongoDB:** mongodb.com/try/download/community
2. **Start MongoDB:**
   ```bash
   mongod  # Or use MongoDB Compass GUI
   ```
3. **Connection String:**
   ```
   mongodb://localhost:27017/resume-analyzer
   ```
4. **Update .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   ```

## 12.5 API Key Setup

### Getting Groq API Key
1. Visit: https://console.groq.com
2. Sign up free
3. Navigate to API Keys
4. Create new API key
5. Copy and paste to `GROQ_API_KEY` in .env
6. No usage limits on free tier! ✓

### Getting Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign up with Google account
3. Create API key
4. Copy and paste to `GEMINI_API_KEY` in .env
5. Free tier: 60 requests per minute

## 12.6 Verification

### Test Backend
```bash
# Health check
curl http://localhost:5000/health

# Response:
# {
#   "status": "OK",
#   "message": "Server is running",
#   "timestamp": "2024-03-24T10:30:00Z"
# }

# Access Swagger docs
# http://localhost:5000/api-docs
```

### Test Frontend
```
Open browser: http://localhost:5173
Should see homepage with login/register
```

### Test Registration
1. Click "Register"
2. Fill: Name, Email, Password
3. Should see "Account created"
4. Redirected to Dashboard (empty)

### Test Resume Analysis (need real PDF)
1. Get a PDF resume
2. Click "Upload Resume"
3. Select PDF file
4. Wait for analysis (2-30 seconds)
5. Should see ATS score & details

---

# 13. DEVELOPMENT WORKFLOW

## 13.1 Git Workflow

### Branch Convention
```
main              - Production ready
├─ features/...   - New features
├─ bugfix/...     - Bug fixes
└─ hotfix/...     - Critical production fixes
```

### Making Changes
```bash
# Create feature branch
git checkout -b features/new-feature

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin features/new-feature

# Create Pull Request on GitHub
# Request review, merge after approval
```

### Commit Message Format
```
feat: add new feature
fix: fix bug in component
docs: update documentation
style: format code (no logic changes)
refactor: reorganize code structure
test: add or update tests
chore: update dependencies
```

## 13.2 Code Style

### JavaScript/Node.js
- **Indentation:** 2 spaces
- **Quotes:** Single quotes ('string')
- **Semicolons:** Yes
- **Arrow Functions:** Prefer arrow functions
- **Async/Await:** Prefer over .then()

### React Components
- **Functional:** Use functional components only
- **Hooks:** Use modern hooks (useState, useEffect, etc.)
- **Props:** Destructure in function signature
- **JSX:** Proper indentation and formatting

### CSS/Tailwind
- **Utility Classes:** Prefer Tailwind over custom CSS
- **Dark Mode:** Use Tailwind dark: prefix
- **Responsive:** Mobile-first approach
- **Colors:** Use theme colors from config

## 13.3 API Development

### Adding New Endpoint

**1. Define Route**
```javascript
// server/routes/newRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as controller from '../controllers/newController.js';

const router = express.Router();

router.post('/endpoint', authMiddleware, controller.handler);

export default router;
```

**2. Create Controller**
```javascript
// server/controllers/newController.js
import { asyncHandler } from '../middleware/errorHandler.js';

export const handler = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const userId = req.userId;
  
  // Business logic
  const result = await service.process(userId, data);
  
  res.status(200).json({
    success: true,
    message: 'Success',
    data: result
  });
});
```

**3. Create Service**
```javascript
// server/services/newService.js
export const process = async (userId, data) => {
  // Database queries
  // API calls
  // Data transformation
  return result;
};
```

**4. Mount Route**
```javascript
// server/server.js
import newRoutes from './routes/newRoutes.js';

app.use('/api/new', newRoutes);
```

**5. Document in Swagger**
```javascript
/**
 * @swagger
 * /api/new/endpoint:
 *   post:
 *     summary: Description
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
```

## 13.4 Frontend Development

### Adding New Page

**1. Create Page Component**
```javascript
// client/src/pages/NewPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from '../components';
import { newAction } from '../features/newSlice';

export default function NewPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.new);
  
  useEffect(() => {
    dispatch(newAction());
  }, [dispatch]);
  
  return (
    <div className="container mx-auto">
      <Card>
        {loading ? <Spinner /> : <div>{data}</div>}
      </Card>
    </div>
  );
}
```

**2. Create Redux Slice**
```javascript
// client/src/features/newSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const newAction = createAsyncThunk(
  'new/action',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/endpoint');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const newSlice = createSlice({
  name: 'new',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder.addCase(newAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(newAction.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(newAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default newSlice.reducer;
```

**3. Add Route**
```javascript
// client/src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NewPage from './pages/NewPage';

const router = createBrowserRouter([
  // ... existing routes ...
  { path: '/new', element: <NewPage /> }
]);
```

---

# 14. TESTING & VALIDATION

## 14.1 Manual Testing

### Test Cases: Resume Analysis

#### Test 1: Poor Quality Resume
- **Input:** Resume with no contact info, scattered format
- **Expected:** ATS score: 20-40
- **Validate:** Score realistic, suggestions actionable

#### Test 2: Average Resume
- **Input:** Basic resume with standard sections
- **Expected:** ATS score: 50-70
- **Validate:** Feedback specific to resume issues

#### Test 3:  Excellent Resume
- **Input:** Complete, well-formatted, strong keywords
- **Expected:** ATS score: 80-95
- **Validate:** Highest score of the three

#### Test 4: Job Matching
- **Input:** Resume + job description (mismatched)
- **Expected:** Match score: 30-50%
- **Validate:** Missing keywords identified correctly

#### Test 5: Job Matching (Good Fit)
- **Input:** Resume + job description (good fit)
- **Expected:** Match score: 70-80%
- **Validate:** Present and missing keywords logical

### Test Cases: Authentication

- Register with valid credentials → Success
- Register with existing email → Error
- Login with wrong password → Error
- Login with correct credentials → Success & redirect
- Access protected route without token → 401 error
- Access protected route with token → Success
- Token refresh → New token generated
- Logout → Token cleared, route unauthorized

### Test Cases: File Upload

- Upload non-PDF file → Error "Only PDF allowed"
- Upload >10MB file → Error "File too large"
- Upload valid PDF → Success, file stored
- Analyze before upload → Error "No resume"
- Analyze after upload → Success, analysis complete

## 14.2 Automated Testing (TODO)

```bash
# Backend tests
npm run test

# Frontend tests  
npm run test:ui
```

**Test Coverage Areas:**
- API endpoints (all 404, 401, 200 responses)
- Authentication (register, login, refresh)
- Resume operations (upload, analyze, delete)
- Job matching
- Error handling
- Validation schemas

## 14.3 Performance Testing

### Backend Performance
- **Resume Analysis:** Should complete in 2-30 seconds
- **API Response:** <500ms for DB queries
- **Memory Usage:** Monitor for leaks in Docker

### Frontend Performance
- **Page Load:** <3 seconds (Vite optimized)
- **Component Render:** <1 second (React optimized)
- **State Updates:** <100ms (Redux optimized)

### Load Testing
```bash
# Install Apache Bench
ab -n 1000 -c 10 http://localhost:5000/health
```

---

# 15. DEPLOYMENT GUIDE

## 15.1 Production Checklist

### Before Deploying
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured correctly
- [ ] Database indexed properly
- [ ] API keys valid for production
- [ ] Security headers enabled
- [ ] HTTPS configured
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Error monitoring set up

### Environment Variables (Production)
```bash
# Set NODE_ENV to production
NODE_ENV=production

# Use strong JWT secrets (at least 32 chars)
JWT_SECRET_KEY=long-random-string-with-uppercase-numbers-123456
REFRESH_TOKEN_SECRET=another-long-random-string-456789

# Use production MongoDB (MongoDB Atlas)
MONGODB_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/resume-analyzer

# Use production API keys
GROQ_API_KEY=your-prod-groq-key
GEMINI_API_KEY=your-prod-gemini-key

# Configure for production
PORT=5000
CLIENT_URL=https://yourdomain.com
LOG_LEVEL=info

# Stronger rate limiting
RATE_LIMIT_MAX_REQUESTS=50
```

## 15.2 Deployment Platforms

### Option 1: Heroku

**Backend**
```bash
# Install Heroku CLI
# heroku login

# Create Heroku app
heroku create resume-analyzer-api

# Set environment variables
heroku config:set JWT_SECRET_KEY=xxx
heroku config:set MONGODB_URI=xxx
heroku config:set GROQ_API_KEY=xxx

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Frontend (Vercel)**
```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Set API URL
vercel env add VITE_API_BASE_URL
# https://resume-analyzer-api.herokuapp.com/api
```

### Option 2: Docker

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Docker Compose**
```yaml
version: '3.8'

services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/resume-analyzer
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      GROQ_API_KEY: ${GROQ_API_KEY}
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  frontend:
    build: ./client
    ports:
      - "3000:3000"

volumes:
  mongo-data:
```

**Deploy**
```bash
docker-compose up -d
```

### Option 3: AWS/Google Cloud/Azure

Use respective container services:
- AWS: ECS, App Engine
- Google Cloud: Cloud Run
- Azure: App Service

## 15.3 CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd server
          npm ci
          cd ../client
          npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: |
          cd client
          npm run build
      
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          # Deploy script here
```

---

# 16. BEST PRACTICES

## 16.1 Code Quality

### Naming Conventions
- **Files:** kebab-case (my-component.jsx)
- **Folders:** kebab-case (my-folder)
- **Functions:** camelCase (getUserData)
- **Classes:** PascalCase (UserService)
- **Constants:** SNAKE_CASE (MAX_FILE_SIZE)
- **Variables:** camelCase (userData)

### Code Organization
- Keep functions small (<50 lines)
- One responsibility per function
- DRY (Don't Repeat Yourself)
- Use meaningful variable names
- Comment complex logic
- Extract helper functions

### Error Handling
```javascript
// Good
try {
  const data = await fetchData();
  return data;
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new CustomError('Failed to fetch data', 500);
}

// Bad
try {
  const data = await fetchData();
} catch (e) {
  console.log('error');  // Generic, no context
}
```

## 16.2 Security Best Practices

### Secrets Management
- Never commit .env files
- Use .env.example as template
- Rotate secrets regularly
- Use strong random secrets
- Different secrets for dev/prod

### Input Validation
- Validate all user inputs
- Use Joi schemas
- Check file types/sizes
- Sanitize user data
- Escape output

### API Security
- Use HTTPS always
- Implement rate limiting
- Validate API requests
- Use CORS properly
- Add security headers

## 16.3 Database Best Practices

### Indexing
```javascript
// Create indexes for frequently queried fields
db.users.createIndex({ email: 1 });  // Unique
db.resumes.createIndex({ userId: 1, createdAt: -1 });
db.jobmatches.createIndex({ userId: 1 });
```

### Data Validation
- MongoDB schema validation
- Mongoose middleware for pre-save checks
- Joi for API request validation

### Connection Management
- Use connection pooling
- Set appropriate timeouts
- Handle disconnections gracefully
- Monitor connection health

## 16.4 Performance Best Practices

### Frontend
- **Code Splitting:** Use lazy loading for pages
- **Caching:** Cache API responses
- **Bundling:** Vite handles minification
- **Images:** Optimize and compress
- **Rendering:** Prevent unnecessary re-renders

### Backend
- **Caching:** Redis for frequently accessed data
- **Pagination:** Limit query results
- **Indexes:** Database indexes on frequently queried fields
- **Async:** Use async/await properly
- **Pooling:** Connection pooling for DB

### Database
- **Indexes:** Proper indexing strategies
- **Queries:** Use projections to select needed fields
- **Aggregation:** Use MongoDB aggregation pipeline
- **Monitoring:** Monitor slow queries

## 16.5 Monitoring & Logging

### Logging Levels
```javascript
logger.debug('Detailed diagnostic info');
logger.info('General information');
logger.warn('Warning messages');
logger.error('Error messages');
logger.fatal('Fatal errors');
```

### What to Log
- All API requests (method, path, status, time)
- Database queries (slow queries especially)
- Errors (stack traces, context)
- User actions (login, upload, analysis)
- External API calls (Groq, Gemini)

### Monitoring Tools
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **DataDog:** APM monitoring
- **New Relic:** Performance monitoring

---

# 17. TROUBLESHOOTING

## 17.1 Common Issues & Solutions

### Database Connection Errors

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solutions:**
1. Verify MongoDB is running
2. Check connection string in .env
3. Verify IP whitelist (if using Atlas)
4. Check username/password
5. Try local MongoDB if using Atlas

```bash
# Test MongoDB connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/test"
```

### API Key Issues

**Error:** `Error: Groq API key invalid`

**Solutions:**
1. Verify API key in .env
2. Check key isn't expired
3. Verify key has API access enabled
4. Try regenerating key on console.groq.com
5. Use Gemini fallback

```bash
# Verify API key format
echo $GROQ_API_KEY  # Should show: gsk_xxxxx
```

### JWT Token Errors

**Error:** `JsonWebTokenError: invalid signature`

**Solutions:**
1. Verify JWT_SECRET_KEY in .env
2. Check token isn't tampered with
3. Verify token format (starts with "eyJ")
4. Check token expiry time
5. Ensure same secret used to create and verify

### PDF Parsing Issues

**Error:** `PDF parsing failed: Invalid PDF file`

**Solutions:**
1. Ensure file is actually PDF (check magic bytes)
2. RecognizeFile isn't corrupted
3. Check file size (<10MB)
4. Try with different PDF
5. Check pdf-parse library version

```javascript
// Verify PDF magic bytes
const isPDF = buffer.slice(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46])); // %PDF
```

### CORS Issues

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Verify CLIENT_URL in .env matches frontend origin
2. Check CORS middleware configuration
3. Ensure backend running on correct port
4. Check for typos in origin URL
5. Try disabling CORS temporarily for testing

```javascript
// server.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

### File Upload Issues

**Error:** `413 Payload Too Large`

**Solutions:**
1. Check file size limit (default 10MB)
2. Increase limit in multer config
3. Verify file actually <10MB
4. Check nginx/reverse proxy limits (if applicable)

```javascript
// Increase limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
```

### Memory Issues

**Error:** `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed`

**Solutions:**
1. Check for memory leaks
2. Increase Node.js heap size
3. Implement pagination for large queries
4. Cache frequently accessed data
5. Monitor memory usage

```bash
# Increase heap size
node --max-old-space-size=4096 server.js
```

## 17.2 Debugging Techniques

### Frontend Debugging
- **Chrome DevTools:** F12, inspect elements, network tab
- **Redux DevTools:** Redux state inspection
- **Console:** console.log, console.error, console.table
- **React DevTools:** Component props, hooks inspection
- **Network Tab:** API request/response inspection

### Backend Debugging
```bash
# Node debug mode
node --inspect server.js

# Chrome: chrome://inspect

# VS Code: .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/server.js"
    }
  ]
}
```

### Database Debugging
```bash
# MongoDB Compass GUI (visual debugging)
# Or command line:

# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/db"

# Find documents
db.resumes.findOne({ userId: "xxxxx" })

# Check indexes
db.resumes.getIndexes()

# Explain query
db.resumes.find({userId: "xxxxx"}).explain("executionStats")
```

### API Testing
```bash
# Postman: Visual API testing
# Or curl:

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"xxx"}'

# Or REST Client (VS Code extension)
```

## 17.3 Performance Issues

### Slow API Responses

**Checklist:**
- [ ] Check database indexes
- [ ] Monitor Groq/Gemini API response time
- [ ] Check network latency
- [ ] Profile Node.js with clinic.js
- [ ] Check for N+1 queries
- [ ] Implement caching

### High Memory Usage
- [ ] Check for memory leaks with clinic.js
- [ ] Monitor process with `top` or Task Manager
- [ ] Implement pagination
- [ ] Clear old data

### Slow Frontend
- [ ] Check bundle size (npm run build)
- [ ] Use Chrome DevTools Lighthouse
- [ ] Implement code splitting
- [ ] Cache API responses
- [ ] Optimize images

---

# 18. FUTURE ROADMAP

## Phase 1: Quick Wins (1-2 weeks)
- [ ] Result caching (Redis)
- [ ] Resume versioning
- [ ] Score history tracking
- [ ] Enhanced analytics dashboard

## Phase 2: Core Features (1 month)
- [ ] Keyword suggestions from job
- [ ] Resume template suggestions
- [ ] Interview prep module
- [ ] LinkedIn integration (read-only)

## Phase 3: Advanced Features (2-3 months)
- [ ] ATS format simulator
- [ ] Batch resume comparison
- [ ] Cover letter analysis
- [ ] Skill assessment quizzes

## Phase 4: Platform Expansion (3+ months)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Multi-language support
- [ ] B2B recruiter dashboard

## Phase 5: Integrations (Ongoing)
- [ ] Indeed API integration
- [ ] LinkedIn Jobs API
- [ ] Glassdoor integration
- [ ] Calendly for interview scheduling

---

# INDEX OF KEY CONCEPTS

### Core Concepts
- **ATS Score** - Measure of resume compatibility with 0-100
- **Resume Analysis** - AI-powered evaluation of resume quality
- **Job Matching** - Comparison of resume with job requirements
- **Skill Extraction** - Identifying skills mentioned in resume
- **Missing Skills** - In-demand skills not present in resume

### Architecture Concepts
- **MVC Pattern** - Models, Views (React), Controllers
- **Redux State Management** - Centralized app state
- **JWT Authentication** - Token-based security
- **Middleware** - Request processing pipeline
- **Service Layer** - Business logic separation

### Technology Concepts
- **MongoDB** - NoSQL document database
- **Express.js** - Node.js web framework
- **React** - Frontend UI library
- **Vite** - Fast build tool
- **Groq/Gemini** - AI APIs for analysis

### Security Concepts
- **Password Hashing** - bcryptjs with salt rounds
- **JWT Signing** - HMAC SHA256 signatures
- **CORS** - Cross-Origin Resource Sharing control
- **Rate Limiting** - Request throttling
- **Input Validation** - Joi schema validation

### Database Concepts
- **Schemas** - Table/collection structures
- **Indexing** - Speed optimization
- **Queries** - Data retrieval operations
- **Relationships** - User → Resume → JobMatch
- **Aggregation** - Complex data combining

---

## 📞 SUPPORT & RESOURCES

### Documentation Files
- [README.md](README.md) - Project overview
- [API_REFERENCE.md](API_REFERENCE.md) - Detailed endpoint docs
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) - Security details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

### External Resources
- **MongoDB Docs:** https://docs.mongodb.com
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **Groq Docs:** https://docs.groq.com
- **Tailwind CSS:** https://tailwindcss.com

### Getting Help
1. Check troubleshooting section above
2. Review error messages carefully
3. Check browser dev console (F12)
4. Review server logs
5. Create GitHub issue with details

---

**Document Status: ✅ COMPLETE**  
**Last Updated: March 24, 2026**  
**For Questions or Updates: Create an issue on GitHub**

This comprehensive documentation covers everything from project overview through deployment. Use it as your complete study guide!

