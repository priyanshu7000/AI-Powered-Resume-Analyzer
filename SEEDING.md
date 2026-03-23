# 🌱 Database Seeding Guide

This guide explains how to seed your MongoDB database with sample data for development and testing.

## Overview

The seeding script creates:
- **3 sample users** with different profiles
- **3 sample resumes** with AI analysis results
- **3 sample job matches** showing matching functionality

Perfect for testing and demo purposes.

## Prerequisites

- MongoDB connection configured in `.env`
- Node.js installed
- Dependencies installed (`npm install`)

## Usage

### Quick Seed (Development)

```bash
cd server
npm run seed
```

This will:
1. Connect to MongoDB
2. Clear existing data
3. Create sample data
4. Display test credentials

### Reset & Reseed

```bash
npm run seed:reset
```

Same as `npm run seed` - it clears and recreates everything.

## Test Credentials

After seeding, use these credentials to login:

```
User 1:
  Email: john@example.com
  Password: password123

User 2:
  Email: jane@example.com
  Password: password123

User 3:
  Email: mike@example.com
  Password: password123
```

## Sample Data Created

### Users

| Name | Email | Role | Password |
|------|-------|------|----------|
| John Doe | john@example.com | Full-Stack Developer | password123 |
| Jane Smith | jane@example.com | Data Scientist | password123 |
| Mike Johnson | mike@example.com | (No resume analyzed) | password123 |

### Resumes

**John Doe's Resume**
- **Skills**: JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS
- **Missing Skills**: Kubernetes, GraphQL, Microservices
- **ATS Score**: 82/100
- **Suggestions**: Add more metrics, include keywords, add certifications

**Jane Smith's Resume**
- **Skills**: Python, Machine Learning, TensorFlow, Data Analysis, SQL, Spark, R
- **Missing Skills**: Deep Learning, NLP, Computer Vision
- **ATS Score**: 78/100
- **Suggestions**: Add recent projects, include cloud platform experience

**Mike Johnson's Resume**
- **Status**: Not analyzed yet
- **Perfect for testing**: Upload and analyze feature

### Job Matches

**John's Matches**
1. **Senior React Developer** - 87% match
2. **Full-Stack Engineer** - 91% match (excellent match!)

**Jane's Matches**
1. **Machine Learning Engineer** - 85% match

## What Gets Seeded

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Resumes Collection
```javascript
{
  userId: ObjectId,
  fileName: String,
  resumeText: String,
  extractedSkills: [String],
  missingSkills: [String],
  atsScore: Number,
  suggestions: [String],
  analyzed: Boolean,
  createdAt: Date
}
```

### Job Matches Collection
```javascript
{
  userId: ObjectId,
  resumeId: ObjectId,
  jobTitle: String,
  jobDescription: String,
  matchScore: Number,
  missingKeywords: [String],
  suggestions: [String],
  createdAt: Date
}
```

## Customizing Seed Data

To customize seed data, edit `server/seed.js`:

### Add More Users
```javascript
const users = await User.insertMany([
  // ... existing users
  {
    name: 'Your Name',
    email: 'your@email.com',
    password: 'password123',
  },
]);
```

### Add More Resumes
```javascript
const resumes = await Resume.insertMany([
  // ... existing resumes
  {
    userId: users[3]._id,
    fileName: 'your_resume.pdf',
    resumeText: 'Your resume text here...',
    extractedSkills: ['Skill1', 'Skill2'],
    atsScore: 85,
    analyzed: true,
  },
]);
```

### Add More Job Matches
```javascript
const jobMatches = await JobMatch.insertMany([
  // ... existing matches
  {
    userId: users[0]._id,
    resumeId: resumes[0]._id,
    jobTitle: 'Your Job Title',
    jobDescription: 'Job description here...',
    matchScore: 80,
    missingKeywords: ['Keyword1'],
    suggestions: ['Suggestion1'],
  },
]);
```

## Tips & Tricks

### Reset Database Only
If you just want to clear the database without seeding:

```javascript
// In seed.js, comment out the seeding code
// Keep only:
await User.deleteMany({});
await Resume.deleteMany({});
await JobMatch.deleteMany({});
```

### Verify Seed Data
After seeding, check MongoDB Atlas or use MongoDB CLI:

```bash
# Connect to your database
mongosh "mongodb+srv://user:password@cluster.mongodb.net/resume-analyzer"

# View collections
show collections

# Count documents
db.users.countDocuments()
db.resumes.countDocuments()
db.jobmatches.countDocuments()

# View sample document
db.users.findOne()
```

### Disable Password Hashing During Seed
The seed script automatically hashes passwords. If you want specific passwords (for testing specific edge cases), modify the `User.create()` call to hash first:

```javascript
const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash('password123', salt);

// Use hashedPassword in insertMany
```

## Troubleshooting

### Error: Cannot connect to MongoDB
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure database user credentials are correct

### Error: Collection already exists
- The seed script automatically clears collections
- If error persists, manually delete collections in MongoDB Atlas

### Passwords not working
- Passwords are automatically hashed on seed
- Use exact credentials from seeding output
- Passwords are: `password123`

### Want specific test data?
- Edit `server/seed.js` before running seed
- Customize user info, skills, scores, suggestions
- Run `npm run seed` again

## Advanced: Seeding with Environment Files

Create different seed files for different environments:

```bash
# Development seed
npm run seed

# Staging seed (if you create seed-staging.js)
node seed-staging.js

# Production (⚠️ Use with extreme caution!)
node seed-production.js
```

## When to Reseed?

✅ **Do reseed when:**
- You want to test from a clean state
- You've made database schema changes
- You want to test with fresh data
- Starting a new development session

❌ **Don't reseed when:**
- You're testing data persistence
- You have important test data
- You're in production (creates test data in production!)

## Security Notes

⚠️ **Important**: Never use this seeding script in production!

The seed script:
- Uses default passwords (password123)
- Clears all existing data
- Creates test user accounts
- Should only run in development/testing

For production data:
- Use proper data migration tools
- Implement proper access controls
- Use strong, unique passwords
- Never commit real credentials

## Examples

### Run seed on Docker
```bash
docker exec container-name npm run seed
```

### Automate seeding on startup
```bash
# In docker-compose.yml
services:
  backend:
    command: sh -c "npm run seed && npm start"
```

### Schedule periodic seeding (development)
```bash
# Using cron (Linux/Mac)
0 6 * * * cd /path/to/server && npm run seed
```

---

For more information:
- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Setup instructions
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
