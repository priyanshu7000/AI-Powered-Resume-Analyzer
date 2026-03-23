# ⚡ Quick Start Guide

Get the AI Resume Analyzer & Job Matcher running in 5 minutes!

## Prerequisites

- Node.js v16+ installed
- npm or yarn
- A GitHub account (optional, for deployment)
- OpenAI API key (for AI features)
- MongoDB Atlas account (free tier available)

## 1️⃣ Clone & Setup (2 minutes)

```bash
# Navigate to project directory
cd "resume analyser"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

## 2️⃣ Configure Environment (1 minute)

### Backend `.env`
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resume-analyzer
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:3000
```

### Frontend `.env.local`
```bash
cd ../client
cp .env.example .env.local
```

`.env.local` is already configured correctly for local development.

## 3️⃣ Start Both Servers (1 minute)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Backend runs at: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Terminal 3 - Seed Database (Optional)
```bash
cd server
npm run seed
```
This creates sample users and resumes for testing.
Test Credentials:
- Email: john@example.com | Password: password123
- Email: jane@example.com | Password: password123

## 4️⃣ Verify Setup (1 minute)

✅ **Backend Health Check:**
```bash
curl http://localhost:5000/health
```
Should return: `{ "status": "OK" }`

✅ **API Documentation:**
Visit: `http://localhost:5000/api-docs`

✅ **Frontend:**
Visit: `http://localhost:3000`
Should see landing page with "Get Started Free" button

## 5️⃣ Test the App

1. **Create Account**
   - Click "Get Started Free"
   - Fill in details and register
   - Login with your credentials

2. **Upload Resume**
   - Go to "Upload Resume"
   - Select a PDF file
   - Click "Analyze Resume"

3. **Match with Jobs**
   - Go to "Job Matcher"
   - Select your resume
   - Paste a job description
   - Click "Analyze Match"

4. **View Dashboard**
   - See all your resumes and matches
   - Track ATS scores and match percentages

## 🎨 Features to Explore

- 🌙 **Dark Mode Toggle** - Click the moon icon in navbar
- 📊 **ATS Score** - See your resume's ATS compatibility
- 💼 **Match Score** - See how well you match jobs
- 🔄 **Refresh Tokens** - Auto-renewal of authentication
- 📱 **Responsive** - Works on mobile, tablet, desktop

## 📚 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP.md` | Detailed setup instructions |
| `SEEDING.md` | Database seeding guide |
| `API_REFERENCE.md` | API endpoint documentation |
| `ARCHITECTURE.md` | System design explanation |
| `DEPLOYMENT.md` | Production deployment guide |

## 🔑 Getting Required Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to `.env` as `OPENAI_API_KEY`

### MongoDB Connection
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create user and get connection string
4. Copy to `.env` as `MONGODB_URI`

## 🐛 Common Issues

**Port 5000/3000 already in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection error?**
- Check `.env` has correct MONGODB_URI
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials

**API calls failing?**
- Check OPENAI_API_KEY is set
- Verify backend and frontend are running
- Check browser console for errors

**Build errors?**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📝 Next Steps

1. ✅ Complete quick start above
2. 📖 Read `SETUP.md` for detailed configuration
3. 🚀 Check `DEPLOYMENT.md` to deploy to production
4. 📚 Review `API_REFERENCE.md` for API details
5. 🏗️ Study `ARCHITECTURE.md` to understand system design

## 🎯 Production Deployment

When ready to deploy:

1. **Backend**: Deploy to [Render](https://render.com) (free tier available)
2. **Frontend**: Deploy to [Vercel](https://vercel.com) (free tier available)
3. **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free M0 tier)

See `DEPLOYMENT.md` for step-by-step instructions.

## 💡 Tips

- Use Swagger UI at `/api-docs` to test APIs
- Check Redux dev tools to debug state
- Use browser DevTools for frontend debugging
- Monitor MongoDB Atlas for database performance
- Watch backend logs for API errors

## 📞 Need Help?

- Check documentation files
- Review error messages in console
- Check MongoDB and OpenAI status
- Verify all environment variables are set

## 🎉 You're Ready!

Your AI Resume Analyzer is now running. Start optimizing resumes! 

---

**Next**: Read [SETUP.md](./SETUP.md) for detailed configuration and [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment.
