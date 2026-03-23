import 'dotenv/config';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import connectDB from './config/database.js';
import User from './models/User.js';
import Resume from './models/Resume.js';
import JobMatch from './models/JobMatch.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Resume.deleteMany({});
    await JobMatch.deleteMany({});
    console.log('✅ Cleared existing collections\n');

    // Create sample users with hashed passwords
    console.log('👥 Creating sample users...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('password123', salt);
    
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
      },
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create sample resumes
    console.log('📄 Creating sample resumes...');
    const resumeText1 = `
      JOHN DOE
      Email: john@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

      PROFESSIONAL SUMMARY
      Experienced Full-Stack Developer with 5+ years in JavaScript/React and Node.js. 
      Passionate about clean code and scalable architectures.

      TECHNICAL SKILLS
      Languages: JavaScript, Python, Java, SQL
      Frontend: React, Redux, Tailwind CSS, HTML/CSS
      Backend: Node.js, Express, MongoDB, PostgreSQL
      Tools: Git, Docker, AWS, Webpack, Jest
      Other: REST APIs, GraphQL, Agile, Scrum

      PROFESSIONAL EXPERIENCE
      Senior Full-Stack Developer | TechCorp Inc. | 2021 - Present
      - Led development of customer dashboard using React and Node.js
      - Improved API response time by 40% through optimization
      - Mentored 3 junior developers on best practices
      - Implemented automated testing increasing coverage to 85%

      Full-Stack Developer | WebSolutions LLC | 2019 - 2021
      - Developed and maintained 5+ production web applications
      - Designed RESTful APIs serving 1M+ daily requests
      - Implemented real-time features using WebSockets
      - Reduced database query time by 50% through indexing

      Junior Developer | StartupXYZ | 2018 - 2019
      - Built responsive web interfaces using React
      - Contributed to backend services using Express
      - Participated in code reviews and testing

      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology | 2018

      CERTIFICATIONS
      - AWS Solutions Architect Associate
      - MongoDB Developer
      - Certified Scrum Developer

      PROJECTS
      E-Commerce Platform | React, Node.js, MongoDB
      - Built full-featured e-commerce platform
      - Implemented payment integration with Stripe
      - Deployed on AWS using Docker

      Analytics Dashboard | React, D3.js, Express
      - Created interactive data visualization dashboard
      - Real-time data updates using WebSockets
      - 100K+ daily active users
    `;

    const resumeText2 = `
      JANE SMITH
      Email: jane@example.com | Phone: (555) 987-6543

      SUMMARY
      Data Scientist and Machine Learning Engineer with 4+ years experience.
      Expertise in Python, TensorFlow, and data analysis.

      SKILLS
      Programming: Python, R, SQL, Java
      ML/AI: TensorFlow, PyTorch, Scikit-learn, Pandas
      Data: Big Data, Spark, Hadoop, ETL
      Databases: MongoDB, PostgreSQL, MySQL
      Tools: Jupyter, Git, Docker, AWS, GCP

      EXPERIENCE
      Senior Data Scientist | DataCorp | 2022 - Present
      - Developed ML models improving prediction accuracy by 35%
      - Led team of 2 data scientists
      - Implemented MLOps pipeline with automated testing

      Data Scientist | Analytics Inc. | 2020 - 2022
      - Built predictive models for customer churn
      - Processed 10TB+ datasets using Spark
      - Created automated reports for stakeholders

      Junior Data Analyst | TechStartup | 2019 - 2020
      - Analyzed business metrics using SQL and Python
      - Created visualizations using Tableau

      EDUCATION
      Master's in Data Science | Tech University | 2020
      Bachelor's in Mathematics | Tech University | 2018

      PROJECTS
      Recommendation Engine | Python, TensorFlow, PostgreSQL
      - Collaborative filtering recommendation system
      - Improved user engagement by 25%

      Fraud Detection System | Python, Scikit-learn
      - Anomaly detection using Isolation Forest
      - 99% precision in fraud detection
    `;

    const resumes = await Resume.insertMany([
      {
        userId: users[0]._id,
        fileName: 'john_doe_resume.pdf',
        resumeText: resumeText1,
        extractedSkills: [
          'JavaScript',
          'React',
          'Node.js',
          'Express',
          'MongoDB',
          'PostgreSQL',
          'Docker',
          'AWS',
        ],
        missingSkills: ['Kubernetes', 'GraphQL', 'Microservices'],
        atsScore: 82,
        suggestions: [
          'Add more quantifiable metrics to achievements',
          'Include industry-specific keywords',
          'Mention more relevant certifications',
        ],
        analyzed: true,
      },
      {
        userId: users[1]._id,
        fileName: 'jane_smith_resume.pdf',
        resumeText: resumeText2,
        extractedSkills: [
          'Python',
          'Machine Learning',
          'TensorFlow',
          'Data Analysis',
          'SQL',
          'Spark',
          'R',
        ],
        missingSkills: ['Deep Learning', 'NLP', 'Computer Vision'],
        atsScore: 78,
        suggestions: [
          'Add more recent projects',
          'Include cloud platform experience',
        ],
        analyzed: true,
      },
      {
        userId: users[2]._id,
        fileName: 'mike_johnson_resume.pdf',
        resumeText: 'Sample resume text for Mike Johnson...',
        analyzed: false,
      },
    ]);
    console.log(`✅ Created ${resumes.length} resumes\n`);

    // Create sample job matches
    console.log('💼 Creating sample job matches...');
    const jobMatches = await JobMatch.insertMany([
      {
        userId: users[0]._id,
        resumeId: resumes[0]._id,
        jobTitle: 'Senior React Developer',
        jobDescription: `
          We are looking for an experienced React Developer with 5+ years of experience.
          
          Requirements:
          - Expert-level React and JavaScript knowledge
          - Experience with Redux or MobX
          - Node.js backend experience
          - MongoDB or PostgreSQL
          - Docker and AWS
          - RESTful API design
          - Unit and integration testing
          - Agile/Scrum experience
          
          Responsibilities:
          - Develop scalable web applications
          - Mentor junior developers
          - Participate in code reviews
          - Optimize application performance
        `,
        matchScore: 87,
        missingKeywords: ['TypeScript', 'GraphQL'],
        suggestions: [
          'Your React and Node.js expertise strongly matches this role',
          'Highlight your optimization achievements',
          'Mention experience with 1M+ daily users',
        ],
      },
      {
        userId: users[1]._id,
        resumeId: resumes[1]._id,
        jobTitle: 'Machine Learning Engineer',
        jobDescription: `
          Join our ML team as a Machine Learning Engineer.
          
          You should have:
          - 4+ years ML experience
          - Python, TensorFlow, PyTorch
          - Statistical knowledge
          - Big Data technologies (Spark, Hadoop)
          - AWS or GCP
          - Deployed ML models to production
          
          Responsibilities:
          - Develop and train ML models
          - Optimize model performance
          - Deploy models to production
          - Document and maintain ML pipelines
        `,
        matchScore: 85,
        missingKeywords: ['Production ML', 'Feature Engineering'],
        suggestions: [
          'Your ML framework expertise is excellent',
          'Emphasize your Hadoop experience',
          'Highlight the efficiency improvements achieved',
        ],
      },
      {
        userId: users[0]._id,
        resumeId: resumes[0]._id,
        jobTitle: 'Full-Stack Engineer',
        jobDescription: `
          Seeking Full-Stack Engineer with both frontend and backend expertise.
          
          Required:
          - React or Vue.js
          - Node.js or Python
          - SQL and NoSQL databases
          - REST API development
          - Git and version control
          - 3+ years experience
          
          Nice to have:
          - TypeScript
          - Docker experience
          - AWS or similar cloud platform
        `,
        matchScore: 91,
        missingKeywords: ['TypeScript', 'Vue.js'],
        suggestions: [
          'Excellent match for this role',
          'All core requirements are met',
          'Consider learning TypeScript for future opportunities',
        ],
      },
    ]);
    console.log(`✅ Created ${jobMatches.length} job matches\n`);

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Resumes: ${resumes.length}`);
    console.log(`   - Job Matches: ${jobMatches.length}\n`);

    console.log('🔐 Test Credentials:');
    console.log('   Email: john@example.com | Password: password123');
    console.log('   Email: jane@example.com | Password: password123');
    console.log('   Email: mike@example.com | Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
