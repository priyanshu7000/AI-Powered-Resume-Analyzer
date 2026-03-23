# 🚀 Deployment Guide

## Prerequisites

- GitHub repository with your code
- Accounts on deployment platforms
- Environment variables ready
- Production database setup

---

## Backend Deployment (Render.com)

### Step 1: Prepare Repository

1. Ensure `server/package.json` has correct scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Ensure `.env` variables are not committed (check `.gitignore`)

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Select your repository
3. Choose the repository branch
4. Configure:
   - **Name**: `resume-analyzer-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Select closest region
   - **Plan**: Free or Paid

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your production MongoDB URL
   - `JWT_ACCESS_SECRET`: Generate new secure string
   - `JWT_REFRESH_SECRET`: Generate new secure string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CLIENT_URL`: Your frontend URL (e.g., https://yourapp.vercel.app)
   - `PORT`: `10000` (Render default)

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Get your backend URL (e.g., `https://resume-analyzer-api.onrender.com`)

### Step 4: Test Backend

```bash
curl https://resume-analyzer-api.onrender.com/health
```

Should receive: `{ "status": "OK" }`

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. Ensure `client/package.json` has correct build script:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. Verify `vite.config.js` has correct build output

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Deploy Frontend

1. Click "Add New..." → "Project"
2. Select your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://resume-analyzer-api.onrender.com/api`)

5. Click "Deploy"
6. Wait for deployment
7. Get your frontend URL (e.g., `https://yourapp.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Redeploy backend

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new organization

### Step 2: Create Production Cluster

1. Click "Create Deployment"
2. Choose **M0 (Free)** for testing or **M2** for production
3. Select cloud provider (AWS, Google Cloud, Azure)
4. Choose region closest to your users
5. Click "Create"

### Step 3: Configure Security

1. Go to "Network Access"
2. Add IP Address: `0.0.0.0/0` (allow all in production, restrict in real prod)
3. Or whitelist specific IPs (Render, Vercel)

### Step 4: Create Database User

1. Go to "Database Access"
2. Click "Create User"
3. Choose "Password" authentication
4. Create strong password
5. Grant role: `readWriteAnyDatabase`

### Step 5: Get Connection String

1. Click "Connect"
2. Choose "Drivers"
3. Select **Node.js** and version
4. Copy connection string
5. Replace `<password>` with your database user password
6. Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Step 6: Add to Environment Variables

Add to Render backend environment:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/resume-analyzer?retryWrites=true&w=majority
```

---

## Domain Setup (Optional)

### Add Custom Domain to Vercel Frontend

1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your domain (e.g., `myapp.com`)
4. Follow DNS configuration instructions
5. Update backend `CLIENT_URL` to your domain

### Add Custom Domain to Render Backend

1. Go to Render Service Settings
2. Click "Custom Domains"
3. Add your domain (e.g., `api.myapp.com`)
4. Follow DNS configuration instructions

---

## SSL/HTTPS Setup

Both Vercel and Render provide free SSL certificates automatically.

---

## Environment Variables Summary

### Backend Production
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_ACCESS_SECRET=very-long-random-string-here
JWT_REFRESH_SECRET=another-very-long-random-string
OPENAI_API_KEY=sk-xxxxxx
CLIENT_URL=https://yourdomain.com or vercel-url
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Production
```env
VITE_API_URL=https://api.yourdomain.com/api or render-url/api
```

---

## Monitoring & Logging

### Render Backend Logs
1. Go to Render dashboard
2. Select your web service
3. Click "Logs" tab
4. View real-time logs

### Vercel Frontend Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Analytics" or "Deployments"
4. View deployment logs

### MongoDB Metrics
1. Go to MongoDB Atlas dashboard
2. Click "Metrics" to view database performance
3. Set up alerts for high CPU/memory

---

## Scaling & Performance

### Backend
- Monitor response times in Render logs
- Scale to paid plan for better performance
- Implement caching strategies
- Use database indexing

### Frontend
- Monitor build size with Vercel Analytics
- Optimize images and assets
- Use code splitting
- Enable CDN caching

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm outdated
npm update
npm install -D package@latest

# Test before deploying
npm test
npm run build
```

### Database Backups
1. Enable automated backups in MongoDB Atlas
2. Create manual backups before major updates
3. Test restore procedures

### Health Checks
```bash
# Monitor backend
curl https://your-backend-url/health

# Monitor API
curl https://your-backend-url/api-docs
```

---

## Troubleshooting Deployments

### Backend Deployment Issues

**Error: Cannot find module**
```bash
# Ensure all dependencies are in package.json
npm install missing-package --save
```

**Error: CORS blocked**
- Check `CLIENT_URL` environment variable
- Verify frontend URL matches exactly
- Check CORS middleware in server.js

**Error: MongoDB connection failed**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

### Frontend Deployment Issues

**Error: API calls failing**
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check browser console for errors

**Error: Build fails**
- Check Node.js version compatibility
- Clear `.next` or `dist` folder
- Reinstall dependencies

---

## Rollback Procedures

### Render Backend
1. Go to "Deployments" tab
2. Select previous working deployment
3. Click "Redeploy"

### Vercel Frontend
1. Go to "Deployments" tab
2. Select previous working deployment
3. Click "Redeploy"

---

## Cost Estimation

- **Vercel**: Free tier includes generous limits
- **Render**: Free tier for web services (with 750 hours/month limit)
- **MongoDB Atlas**: M0 free tier (512MB storage)
- **OpenAI API**: Pay-as-you-go based on usage

---

## Summary Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Production database configured
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL certificates installed
- [ ] Health checks passing
- [ ] API documentation accessible
- [ ] Monitoring enabled
- [ ] Backups configured

---

For more detailed information, refer to:
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [OpenAI Documentation](https://platform.openai.com/docs)

Good luck with your deployment! 🚀
