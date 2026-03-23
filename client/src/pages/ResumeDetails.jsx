import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatDate, getScoreColor, getScoreBgColor } from '../utils/helpers';
import { ArrowLeft, FileText, Download, Sparkles, TrendingUp } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ResumeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      toast.error('Failed to load resume details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const response = await api.post(`/resume/analyze/${id}`);
      if (response.data.success) {
        setResume(response.data.resume);
        toast.success('Resume analyzed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await api.delete(`/resume/${id}`);
        if (response.data.success) {
          toast.success('Resume deleted successfully');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
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
                  Resume Not Analyzed Yet
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
                  Click the button to analyze your resume and get an ATS score
                </p>
              </div>
              <Button
                variant="primary"
                disabled={analyzing}
                onClick={handleAnalyze}
                className="flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
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

        {/* Suggestions */}
        {resume.suggestions && resume.suggestions.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Suggestions for Improvement
            </h2>
            <ul className="space-y-3">
              {resume.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {suggestion}
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
                onClick={() => navigate('/matcher')}
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
