import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobMatch, deleteJobMatch } from '../features/jobSlice';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { useConfirmation } from '../hooks/useConfirmation';
import { formatDate, getScoreColor, getScoreBgColor } from '../utils/helpers';
import {
  ArrowLeft,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Trash2,
  Share2,
} from 'lucide-react';

/**
 * Job Match Details Page
 * Displays comprehensive job match analysis with missing keywords and suggestions
 * 
 * @component
 */
const JobMatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const confirmation = useConfirmation();
  const { currentMatch: match, loading, error } = useSelector((state) => state.job);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (id) {
      dispatch(getJobMatch(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    confirmation.delete({
      title: 'Delete Job Match?',
      message: 'This job match analysis will be permanently deleted. This action cannot be undone.',
      confirmText: 'Delete Match',
      onConfirm: async () => {
        try {
          const result = await dispatch(deleteJobMatch(id));
          if (result.type === 'job/delete/fulfilled') {
            toast.showSuccess('Job match deleted successfully');
            navigate('/dashboard');
          } else {
            toast.showError('Failed to delete job match');
          }
        } catch (error) {
          toast.showError('Error deleting job match');
        }
      },
    });
  };

  const handleShare = () => {
    const text = `I found a job match at ${match.matchScore}% for ${match.jobTitle}. Check out the detailed analysis!`;
    if (navigator.share) {
      navigator.share({
        title: 'Job Match Analysis',
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.showSuccess('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading job match details...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft size={16} />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          <Card className="p-8 text-center">
            <p className={isDark ? 'text-red-400' : 'text-red-600'}>
              {error || 'Job match not found'}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              icon={<Share2 size={16} />}
            >
              Share
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Score Card */}
            <Card className={`p-8 ${getScoreBgColor(match.matchScore)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Match Score
                  </p>
                  <p className={`text-5xl font-bold ${getScoreColor(match.matchScore)}`}>
                    {match.matchScore}%
                  </p>
                </div>
                <Briefcase size={64} className={`opacity-20 ${getScoreColor(match.matchScore)}`} />
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Created {formatDate(match.createdAt)}
              </p>
            </Card>

            {/* Job Information */}
            <Card className="p-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {match.jobTitle}
              </h2>
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {match.jobDescription}
                </p>
              </div>
            </Card>

            {/* Missing Keywords */}
            {match.missingKeywords && match.missingKeywords.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={24} className="text-amber-500" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Missing Keywords ({match.missingKeywords.length})
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  These keywords from the job description are not found in your resume. Consider adding them to improve your match score.
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.missingKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark
                          ? 'bg-amber-900/30 text-amber-300 border border-amber-700'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Suggestions */}
            {match.suggestions && match.suggestions.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={24} className="text-yellow-500" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Improvement Suggestions
                  </h3>
                </div>
                <ul className="space-y-4">
                  {match.suggestions
                    .filter(s => {
                      // Filter out malformed suggestions like "[object Object]"
                      return s && typeof s === 'string' && s !== '[object Object]' && s.trim().length > 0;
                    })
                    .map((suggestion, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle
                          size={20}
                          className="text-green-500 flex-shrink-0 mt-0.5"
                        />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {suggestion}
                        </span>
                      </li>
                    ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Match Score
                  </p>
                  <p className={`text-2xl font-bold ${getScoreColor(match.matchScore)}`}>
                    {match.matchScore}%
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Missing Keywords
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {match.missingKeywords?.length || 0}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Suggestions
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {match.suggestions?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            {/* Match Interpretation */}
            <Card className="p-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Match Interpretation
              </h3>
              <div className={`p-3 rounded-lg ${
                match.matchScore >= 80
                  ? isDark ? 'bg-green-900/30' : 'bg-green-100'
                  : match.matchScore >= 60
                  ? isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                  : match.matchScore >= 40
                  ? isDark ? 'bg-orange-900/30' : 'bg-orange-100'
                  : isDark ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
                <p className={`text-sm leading-relaxed ${
                  match.matchScore >= 80
                    ? isDark ? 'text-green-300' : 'text-green-800'
                    : match.matchScore >= 60
                    ? isDark ? 'text-yellow-300' : 'text-yellow-800'
                    : match.matchScore >= 40
                    ? isDark ? 'text-orange-300' : 'text-orange-800'
                    : isDark ? 'text-red-300' : 'text-red-800'
                }`}>
                  {match.matchScore >= 80
                    ? 'Excellent match! Your resume strongly aligns with this job. Consider applying.'
                    : match.matchScore >= 60
                    ? 'Good match! Your resume covers most requirements. A few additions could strengthen your candidacy.'
                    : match.matchScore >= 40
                    ? 'Moderate match. Add more relevant skills and experience to improve your chances.'
                    : 'Low match. Consider gaining skills in the missing keywords before applying.'}
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full mb-3"
                onClick={() => navigate('/matcher', { state: { auto: true } })}
              >
                Try Another Job
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchDetails;
