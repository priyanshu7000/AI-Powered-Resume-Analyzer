import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getResumes } from '../features/resumeSlice';
import { matchJob } from '../features/jobSlice';
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

    const result = await dispatch(matchJob({
      resumeId: selectedResumeId,
      jobTitle,
      jobDescription,
    }));

    if (result.payload) {
      setMatchResult(result.payload);
      showSuccess('Job match analysis completed!');
    } else {
      showError(result.error.message || 'Matching failed');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Job Matcher
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
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
                  loading={jobLoading}
                >
                  Analyze Match
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div>
            {matchResult ? (
              <Card className="p-6 sticky top-4">
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Target size={24} />
                  Match Results
                </h2>

                <div className={`text-center mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    Overall Match Score
                  </p>
                  <p className={`text-4xl font-bold ${getScoreColor(matchResult.matchScore)}`}>
                    {matchResult.matchScore}%
                  </p>
                </div>

                <div className="space-y-4">
                  {matchResult.missingKeywords && matchResult.missingKeywords.length > 0 && (
                    <div>
                      <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingKeywords.slice(0, 5).map((keyword, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchResult.suggestions && matchResult.suggestions.length > 0 && (
                    <div>
                      <h3 className={`font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                        Suggestions
                      </h3>
                      <ul className="space-y-1">
                        {matchResult.suggestions.slice(0, 3).map((suggestion, i) => (
                          <li key={i} className={`text-xs flex gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fill in the form to see match results
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;
