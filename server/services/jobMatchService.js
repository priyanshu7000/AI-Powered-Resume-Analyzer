import JobMatch from '../models/JobMatch.js';
import Resume from '../models/Resume.js';
import { matchJobDescription } from '../utils/aiAnalysis.js';

export const createJobMatch = async (userId, resumeId, jobTitle, jobDescription) => {
  // Verify resume exists and belongs to user
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to use this resume');
  }

  // Perform AI matching
  const matchData = await matchJobDescription(resume.resumeText, jobDescription, jobTitle);

  // Create job match record
  const jobMatch = await JobMatch.create({
    userId,
    resumeId,
    jobTitle,
    jobDescription,
    matchScore: matchData.matchScore || 0,
    missingKeywords: matchData.missingKeywords || [],
    suggestions: matchData.suggestions || [],
  });

  return jobMatch;
};

export const getUserJobMatches = async (userId) => {
  const matches = await JobMatch.find({ userId })
    .populate('resumeId', 'fileName atsScore')
    .sort({ createdAt: -1 });
  return matches;
};

export const getJobMatchById = async (jobMatchId, userId) => {
  const match = await JobMatch.findById(jobMatchId).populate(
    'resumeId',
    'fileName atsScore extractedSkills'
  );

  if (!match) {
    throw new Error('Job match not found');
  }

  if (match.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this match');
  }

  return match;
};

export const deleteJobMatch = async (jobMatchId, userId) => {
  const match = await JobMatch.findById(jobMatchId);

  if (!match) {
    throw new Error('Job match not found');
  }

  if (match.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this match');
  }

  await JobMatch.findByIdAndDelete(jobMatchId);
  return { message: 'Job match deleted successfully' };
};
