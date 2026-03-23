# 🚀 Setup Instructions

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (for database)
- OpenAI API key
- Git

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resume-analyzer
```

### 2. Backend Setup

#### 2.1 Navigate to server directory
```bash
cd server
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create environment file
```bash
cp .env.example .env
```

#### 2.4 Configure environment variables
Edit `.env` and add:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer?retryWrites=true&w=majority

# JWT
JWT_ACCESS_SECRET=generate-a-random-string-here-min-32-chars
JWT_REFRESH_SECRET=generate-another-random-string-here-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-your-actual-api-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.5 Generate secure secrets
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.6 Start the backend server
```bash
npm run dev
```

Backend will be running at: `http://localhost:5000`

#### 2.7 (Optional) Seed Database with Test Data

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 3 sample users
- 3 sample resumes with AI analysis
- 3 job matches

Test credentials:
- `john@example.com` | `password123`
- `jane@example.com` | `password123`
- `mike@example.com` | `password123`

For more seeding options, see [SEEDING.md](./SEEDING.md)

### 3. Frontend Setup

#### 3.1 Navigate to client directory
```bash
cd ../client
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Create environment file
```bash
cp .env.example .env.local
```

#### 3.4 Configure environment variables
Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.5 Start the frontend server
```bash
npm run dev
```

Frontend will be running at: `http://localhost:3000`

## 4. Verify Setup

### Check Backend
- Visit: `http://localhost:5000/health`
- Should return: `{ status: 'OK' }`

### Check API Documentation
- Visit: `http://localhost:5000/api-docs`
- Should show Swagger UI with all API endpoints

### Check Frontend
- Visit: `http://localhost:3000`
- Should see the landing page

## 5. Test the Application

### Create an Account
1. Click "Get Started Free"
2. Fill in registration form
3. Submit

### Upload a Resume
1. Log in with your account
2. Go to "Upload Resume"
3. Upload a PDF file
4. Click "Analyze Resume"

### Match a Job
1. Go to "Job Matcher"
2. Select a resume
3. Enter job title
4. Paste job description
5. Click "Analyze Match"

## Database Setup (MongoDB Atlas)

### Create a Free Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Add IP address to whitelist (or use 0.0.0.0 for development)
5. Create database user credentials
6. Get connection string

### SampleConnection String Format
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## OpenAI API Setup

### Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and add to `.env` file

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct password

### OpenAI API Error
- Verify API key is valid
- Check API key has sufficient credits
- Ensure API key hasCorrect permissions

### CORS Error
- Verify `CLIENT_URL` in backend `.env`
- Frontend URL should be `http://localhost:3000`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Running in Production

### Backend Production Build
```bash
cd server
npm run build  # if available
npm start
```

### Frontend Production Build
```bash
cd client
npm run build
npm run preview
```

## Dashboard Navigation

After login, you'll see:
- **Dashboard**: Overview of resumes and matches
- **Upload Resume**: Upload and analyze PDFs
- **Job Matcher**: Compare resume with job descriptions
- **Theme Toggle**: Switch between light/dark mode

## Next Steps

1. ✅ Complete setup
2. ✅ Create an account
3. ✅ Upload a sample resume
4. ✅ Analyze the resume
5. ✅ Try job matching
6. ✅ Explore dashboard features

## Security Notes

- Change all default secrets in production
- Use strong passwords
- Enable API rate limiting
- Monitor MongoDB for suspicious activity
- Keep dependencies updated
- Use HTTPS in production
- Implement CSRF protection
- Regular security audits

## Performance Tips

- Use MongoDB indexes
- Implement caching strategies
- Optimize frontend bundle size
- Use CDN for static assets
- Monitor API response times

## Support

For issues or questions:
1. Check the README.md
2. Review API documentation at `/api-docs`
3. Check console for error messages
4. Verify all environment variables are set

---

Happy analyzing! 🎉
