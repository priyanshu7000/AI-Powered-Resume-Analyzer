import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { useConfirmation } from '../hooks/useConfirmation';
import { formatDate, getScoreColor, getScoreBgColor } from '../utils/helpers';
import { ArrowLeft, FileText, Download, Sparkles, TrendingUp } from 'lucide-react';
import api from '../services/api';

/**
 * Convert ATS score to RGB color for circular progress
 */
const getScoreColorRGB = (score) => {
  if (score >= 80) return 'rgb(34, 197, 94)'; // green
  if (score >= 60) return 'rgb(234, 179, 8)'; // yellow
  if (score >= 40) return 'rgb(249, 115, 22)'; // orange
  return 'rgb(239, 68, 68)'; // red
};

/**
 * Get proficiency percentage for progress bar
 */
const getProficiencyPercentage = (level) => {
  const levels = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  return levels[level] || 50;
};

/**
 * Get proficiency color for progress bar
 */
const getProficiencyColor = (level) => {
  switch (level) {
    case 'Expert':
      return 'bg-green-500';
    case 'Advanced':
      return 'bg-blue-500';
    case 'Intermediate':
      return 'bg-yellow-500';
    case 'Beginner':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

const ResumeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmation = useConfirmation();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchResumeDetails();
  }, [id]);

  const fetchResumeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/resume/${id}`);
      if (response.data.success) {
        setResume(response.data.resume);
      }
    } catch (error) {
      toast.showError('Failed to load resume details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!id || analyzing) return;
    
    try {
      setAnalyzing(true);
      toast.showSuccess('Starting analysis... This may take a minute. Please wait.');
      
      // Call analyze endpoint directly
      const response = await api.post(`/resume/analyze/${id}`);
      
      console.log('Analysis Response:', response.data); // Debug log
      
      // Verify response structure
      if (response.data && response.data.success && response.data.resume) {
        const analyzedData = response.data.resume;
        
        // Ensure analyzed flag and atsScore are present
        if (analyzedData.analyzed && analyzedData.atsScore !== undefined) {
          // Immediately update state with response data
          setResume(analyzedData);
          toast.showSuccess('Resume analyzed successfully!');
          return; // Exit early if successful
        }
      }
      
      // If initial response doesn't have complete data, refetch
      const freshResponse = await api.get(`/resume/${id}`);
      if (freshResponse.data && freshResponse.data.resume) {
        const freshData = freshResponse.data.resume;
        if (freshData.analyzed && freshData.atsScore !== undefined) {
          setResume(freshData);
          toast.showSuccess('Resume analyzed successfully!');
        } else {
          toast.showError('Analysis in progress. Please wait a moment and refresh.');
        }
      } else {
        toast.showError('Unable to retrieve analysis results.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to analyze resume';
      toast.showError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    confirmation.delete({
      title: 'Delete Resume?',
      message: 'This resume will be permanently deleted. This action cannot be undone.',
      confirmText: 'Delete Resume',
      onConfirm: async () => {
        try {
          const response = await api.delete(`/resume/${id}`);
          if (response.data.success) {
            toast.showSuccess('Resume deleted successfully');
            navigate('/dashboard');
          }
        } catch (error) {
          toast.showError('Failed to delete resume');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className={`h-10 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded mb-4`}></div>
            <div className={`h-64 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Resume not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg hover:${isDark ? 'bg-gray-800' : 'bg-gray-200'} transition`}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {resume.fileName}
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Uploaded on {formatDate(resume.createdAt)}
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>

        {/* ATS Score & Analyze Section */}
        {resume.analyzed ? (
          <Card className={`p-6 mb-6 border-2 ${getScoreBgColor(resume.atsScore)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`${getScoreColor(resume.atsScore)}`} size={24} />
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ATS Score
                  </p>
                </div>
                <p className={`text-6xl font-bold ${getScoreColor(resume.atsScore)}`}>
                  {resume.atsScore}%
                </p>
              </div>
              <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center ${getScoreBgColor(resume.atsScore)} opacity-20`}>
                <p className={`text-5xl font-bold ${getScoreColor(resume.atsScore)}`}>
                  {resume.atsScore}%
                </p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ATS Compatible
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs">
              {resume.atsScore >= 75 && (
                <p className={isDark ? 'text-green-400' : 'text-green-600'}>
                  ✓ Your resume is well-optimized for ATS systems
                </p>
              )}
              {resume.atsScore >= 50 && resume.atsScore < 75 && (
                <p className={isDark ? 'text-yellow-400' : 'text-yellow-600'}>
                  ⚠ Your resume could be improved for better ATS compatibility
                </p>
              )}
              {resume.atsScore < 50 && (
                <p className={isDark ? 'text-red-400' : 'text-red-600'}>
                  ✗ Your resume needs significant improvements for ATS compatibility
                </p>
              )}
            </div>
          </Card>
        ) : (
          <Card className={`p-6 mb-6 border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {analyzing ? 'Analyzing Your Resume' : 'Resume Not Analyzed Yet'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
                  {analyzing 
                    ? 'AI is analyzing your resume. This may take 30-60 seconds. Please wait and do not leave this page.'
                    : 'Click the button to analyze your resume and get an ATS score'
                  }
                </p>
              </div>
              <Button
                variant="primary"
                disabled={analyzing}
                onClick={handleAnalyze}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* ATS Score Breakdown */}
        {resume.analyzed && resume.atsBreakdown && Object.keys(resume.atsBreakdown).length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ATS Score Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Formatting', value: resume.atsBreakdown.formatting || 0 },
                { label: 'Keywords', value: resume.atsBreakdown.keywordOptimization || 0 },
                { label: 'Structure', value: resume.atsBreakdown.structure || 0 },
                { label: 'Length', value: resume.atsBreakdown.length || 0 },
                { label: 'Readability', value: resume.atsBreakdown.readability || 0 },
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="relative w-full h-32 flex items-center justify-center mb-3">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={isDark ? '#374151' : '#e5e7eb'}
                        strokeWidth="3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getScoreColorRGB(metric.value)}
                        strokeWidth="3"
                        strokeDasharray={`${metric.value * 2.51} 251`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className={`absolute text-2xl font-bold ${getScoreColor(metric.value)}`}>
                      {Math.round(metric.value || 0)}%
                    </span>
                  </div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{metric.label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Skill Categories */}
        {resume.analyzed && resume.skillCategories && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Skills by Category
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Technical Skills', skills: resume.skillCategories?.technical || [], color: 'bg-blue-500' },
                { title: 'Soft Skills', skills: resume.skillCategories?.softSkills || [], color: 'bg-purple-500' },
                { title: 'Tools & Platforms', skills: resume.skillCategories?.tools || [], color: 'bg-green-500' },
                { title: 'Languages', skills: resume.skillCategories?.languages || [], color: 'bg-yellow-500' },
              ].map((category) => (
                <div key={category.title}>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.title} ({category.skills?.length || 0})
                  </h3>
                  {category.skills && category.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 ${category.color} text-white text-sm rounded-full`}
                        >
                          {String(skill)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      No {category.title.toLowerCase()} found
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Skill Proficiency */}
        {resume.analyzed && resume.skillProficiency && Array.isArray(resume.skillProficiency) && resume.skillProficiency.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Skill Proficiency Levels
            </h2>
            <div className="space-y-3">
              {resume.skillProficiency.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {skill.skill || 'Unknown Skill'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {skill.category || 'general'} • {skill.proficiencyLevel || 'Intermediate'}
                      {skill.yearsOfExperience && ` • ${skill.yearsOfExperience}+ years`}
                    </p>
                  </div>
                  <div className="w-32">
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                      <div
                        className={`h-full ${getProficiencyColor(skill.proficiencyLevel)}`}
                        style={{
                          width: `${getProficiencyPercentage(skill.proficiencyLevel)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Resume Text */}
        <Card className="p-6 mb-6">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Resume Content
          </h2>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {resume.resumeText}
            </p>
          </div>
        </Card>

        {/* Extracted Skills */}
        {resume.extractedSkills && resume.extractedSkills.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Extracted Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.extractedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Missing Skills */}
        {resume.missingSkills && resume.missingSkills.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Missing Skills to Improve
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Categorized Suggestions for Improvement */}
        {resume.analyzed && resume.categorizedSuggestions && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Improvement Suggestions
            </h2>
            <div className="space-y-6">
              {/* High Impact */}
              {resume.categorizedSuggestions.highImpact && Array.isArray(resume.categorizedSuggestions.highImpact) && resume.categorizedSuggestions.highImpact.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      High Impact (Do First!)
                    </h3>
                  </div>
                  <div className="space-y-3 pl-5">
                    {resume.categorizedSuggestions.highImpact.map((sug, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-red-900/20' : 'bg-red-50'} border-l-4 border-red-500`}>
                        <p className={`font-medium mb-1 ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                          {sug.title || 'Untitled'}
                        </p>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>
                          {sug.description || 'No description provided'}
                        </p>
                        <span className={`inline-block text-xs mt-2 px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          {sug.category || 'general'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Impact */}
              {resume.categorizedSuggestions.mediumImpact && Array.isArray(resume.categorizedSuggestions.mediumImpact) && resume.categorizedSuggestions.mediumImpact.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Medium Impact (Important)
                    </h3>
                  </div>
                  <div className="space-y-3 pl-5">
                    {resume.categorizedSuggestions.mediumImpact.map((sug, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'} border-l-4 border-yellow-500`}>
                        <p className={`font-medium mb-1 ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                          {sug.title || 'Untitled'}
                        </p>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>
                          {sug.description || 'No description provided'}
                        </p>
                        <span className={`inline-block text-xs mt-2 px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          {sug.category || 'general'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Impact */}
              {resume.categorizedSuggestions.lowImpact && Array.isArray(resume.categorizedSuggestions.lowImpact) && resume.categorizedSuggestions.lowImpact.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Low Impact (Nice to Have)
                    </h3>
                  </div>
                  <div className="space-y-3 pl-5">
                    {resume.categorizedSuggestions.lowImpact.map((sug, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                        <p className={`font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                          {sug.title || 'Untitled'}
                        </p>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>
                          {sug.description || 'No description provided'}
                        </p>
                        <span className={`inline-block text-xs mt-2 px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          {sug.category || 'general'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Legacy Suggestions (if no categorized suggestions) */}
        {resume.suggestions && Array.isArray(resume.suggestions) && resume.suggestions.length > 0 && (!resume.categorizedSuggestions || !resume.categorizedSuggestions.highImpact || resume.categorizedSuggestions.highImpact.length === 0) && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Suggestions for Improvement
            </h2>
            <ul className="space-y-3">
              {resume.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {String(suggestion)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {resume.analyzed && (
            <>
              <Button
                variant="primary"
                onClick={() => navigate('/matcher', { state: { resumeId: id } })}
              >
                Match with Jobs
              </Button>
              <Button
                variant="secondary"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Re-analyze
                  </>
                )}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
