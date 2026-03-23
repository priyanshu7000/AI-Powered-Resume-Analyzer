import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getResumes } from '../features/resumeSlice';
import { matchJob, getJobMatches } from '../features/jobSlice';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import SkeletonLoader from '../components/Loader';
import { useToast } from '../hooks/useToast';
import { CheckCircle, Target } from 'lucide-react';

const JobMatcher = () => {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { resumes, loading: resumeLoading } = useSelector((state) => state.resume);
  const { loading: jobLoading } = useSelector((state) => state.job);
  const { showSuccess, showError } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(getResumes());
  }, [dispatch]);

  // Auto-select resume if coming from ResumeDetails page
  useEffect(() => {
    if (location.state?.resumeId) {
      setSelectedResumeId(location.state.resumeId);
    }
  }, [location.state]);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !jobTitle || !jobDescription) {
      showError('Please fill in all fields');
      return;
    }

    try {
      showSuccess('Analyzing job match... This may take a moment. Please wait.');
      
      const result = await dispatch(matchJob({
        resumeId: selectedResumeId,
        jobTitle,
        jobDescription,
      }));

      // Check thunk result type
      if (result.type === 'job/match/fulfilled') {
        const matchData = result.payload;
        
        // Verify match data has required fields
        if (matchData && matchData.matchScore !== undefined) {
          // Immediately update UI with the response
          setMatchResult(matchData);
          showSuccess('Job match analysis completed!');
          return;
        }
      }
      
      // Handle rejection
      if (result.type === 'job/match/rejected') {
        showError(result.payload || 'Matching failed');
      } else {
        // Unexpected response format
        showError('Match analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Matching error:', error);
      showError(error.message || 'Job matching failed');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-900/10 border-green-700';
    if (score >= 60) return 'bg-yellow-900/10 border-yellow-700';
    if (score >= 40) return 'bg-orange-900/10 border-orange-700';
    return 'bg-red-900/10 border-red-700';
  };

  const getRecommendation = (score) => {
    if (score >= 80) return { text: 'Excellent Match! ✓', color: 'text-green-600 dark:text-green-400' };
    if (score >= 60) return { text: 'Good Match ⚠', color: 'text-yellow-600 dark:text-yellow-400' };
    if (score >= 40) return { text: 'Moderate Match', color: 'text-orange-600 dark:text-orange-400' };
    return { text: 'Poor Match ✗', color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Job Matcher
        </h1>

        {/* Form Section */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleMatch} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Choose a resume...</option>
                {resumeLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <Input
              label="Job Title"
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Job Description
              </label>
              <textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="10"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={jobLoading || !selectedResumeId || !jobTitle || !jobDescription}
            >
              {jobLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                  Analyzing... (may take 30-60 seconds)
                </>
              ) : (
                'Analyze Match'
              )}
            </Button>
          </form>
        </Card>

        {/* Results Section - Prominent Display */}
        {matchResult && (
          <div className="space-y-6">
            {/* Score Card */}
            <Card className={`p-8 border-2 ${getScoreBgColor(matchResult.matchScore)}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Overall Match Score
                  </p>
                  <p className={`text-7xl font-bold ${getScoreColor(matchResult.matchScore)}`}>
                    {matchResult.matchScore}%
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recommendation
                  </p>
                  <p className={`text-2xl font-bold ${getRecommendation(matchResult.matchScore).color}`}>
                    {getRecommendation(matchResult.matchScore).text}
                  </p>
                </div>
              </div>
              
              {/* Score Interpretation */}
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {matchResult.matchScore >= 80 && (
                  <p>✓ You're a strong candidate for this role. Your resume aligns well with the job requirements.</p>
                )}
                {matchResult.matchScore >= 60 && matchResult.matchScore < 80 && (
                  <p>⚠ You have good qualifications. Consider adding the missing keywords listed below to improve your match.</p>
                )}
                {matchResult.matchScore >= 40 && matchResult.matchScore < 60 && (
                  <p>Consider adding relevant skills and keywords from this job description to your resume.</p>
                )}
                {matchResult.matchScore < 40 && (
                  <p>✗ This role may not align with your current qualifications. Consider developing additional skills.</p>
                )}
              </div>
            </Card>

            {/* Missing Keywords */}
            {matchResult.missingKeywords && matchResult.missingKeywords.length > 0 && (
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Missing Keywords ({matchResult.missingKeywords.length})
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add these important keywords to improve your match score:
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Suggestions */}
            {matchResult.suggestions && matchResult.suggestions.length > 0 && (
              <Card className="p-6">
                {(() => {
                  const validSuggestions = matchResult.suggestions.filter(s => 
                    s && typeof s === 'string' && s !== '[object Object]' && s.trim().length > 0
                  );
                  
                  return validSuggestions.length > 0 ? (
                    <>
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Improvement Suggestions ({validSuggestions.length})
                      </h3>
                      <ul className="space-y-3">
                        {validSuggestions.map((suggestion, i) => (
                          <li key={i} className={`flex gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null;
                })()}
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  // Reset to analyze another job
                  setMatchResult(null);
                  setJobTitle('');
                  setJobDescription('');
                }}
              >
                Analyze Another Job
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate(`/match/${matchResult._id}`)}
              >
                View Full Details
              </Button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!matchResult && (
          <Card className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {jobLoading 
                ? '🔄 Analyzing your resume against this job description. This may take 30-60 seconds, please wait...'
                : 'Fill in the form above to analyze how well your resume matches the job.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobMatcher;
