import Resume from '../models/Resume.js';
import { extractTextFromPDF, validatePDFBuffer } from '../utils/pdfParser.js';
import { analyzeResumeWithAI } from '../utils/aiAnalysis.js';

export const uploadResume = async (userId, file) => {
  validatePDFBuffer(file.buffer);

  // Extract text from PDF
  const resumeText = await extractTextFromPDF(file.buffer);
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Failed to extract text from PDF');
  }

  // Create resume record
  const resume = await Resume.create({
    userId,
    fileName: file.originalname,
    resumeText: resumeText.substring(0, 50000), // Limit to 50k chars for DB
    analyzed: false,
  });

  return resume;
};

export const analyzeResume = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to analyze this resume');
  }

  // Call AI analysis
  const analysis = await analyzeResumeWithAI(resume.resumeText);

  // Update resume with analysis
  resume.extractedSkills = analysis.skills || [];
  resume.missingSkills = analysis.missingSkills || [];
  resume.atsScore = analysis.atsScore || 0;
  resume.suggestions = analysis.suggestions || [];
  resume.analyzed = true;

  await resume.save();

  return resume;
};

export const getUserResumes = async (userId) => {
  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
  return resumes;
};

export const getResumeById = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this resume');
  }

  return resume;
};

export const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this resume');
  }

  await Resume.findByIdAndDelete(resumeId);
  return { message: 'Resume deleted successfully' };
};
