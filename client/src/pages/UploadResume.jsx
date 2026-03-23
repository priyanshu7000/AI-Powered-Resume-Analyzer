import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadResume, analyzeResume } from '../features/resumeSlice';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonLoader from '../components/Loader';
import { useToast } from '../hooks/useToast';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const UploadResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedResumeId, setUploadedResumeId] = useState(null);
  const [analyzedResume, setAnalyzedResume] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.resume);
  const { showSuccess, showError } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  /**
   * Get score color based on ATS score
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  /**
   * Get background color for score display
   */
  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-900/10 border-green-700';
    if (score >= 60) return 'bg-yellow-900/10 border-yellow-700';
    if (score >= 40) return 'bg-orange-900/10 border-orange-700';
    return 'bg-red-900/10 border-red-700';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      showError('Please select a PDF file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select a file');
      return;
    }

    const result = await dispatch(uploadResume(selectedFile));
    if (result.payload) {
      showSuccess('Resume uploaded successfully!');
      setUploadedResumeId(result.payload._id);
      setSelectedFile(null);
    } else {
      showError(result.error.message || 'Upload failed');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedResumeId) return;
    
    showSuccess('Analyzing your resume... This may take 30-60 seconds. Please wait.');
    
    try {
      const result = await dispatch(analyzeResume(uploadedResumeId));
      
      // Check if thunk was fulfilled
      if (result.type === 'resume/analyze/fulfilled' && result.payload) {
        setAnalyzedResume(result.payload);
        showSuccess('Resume analyzed successfully! Your ATS score is ready.');
      } else if (result.type === 'resume/analyze/rejected') {
        showError(result.payload || 'Analysis failed. Please try again.');
      } else {
        // Fallback: try to access payload directly
        if (result.payload && result.payload.atsScore !== undefined) {
          setAnalyzedResume(result.payload);
          showSuccess('Resume analyzed successfully! Your ATS score is ready.');
        } else {
          showError('Analysis failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      showError(error.message || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upload Resume
        </h1>

        <Card className="p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                isDark
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files[0] && files[0].type === 'application/pdf') {
                  setSelectedFile(files[0]);
                } else {
                  showError('Please drop a PDF file');
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={40} className="text-blue-600" />
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedFile ? selectedFile.name : 'Drag & drop your PDF or click to select'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Maximum file size: 5MB
                </p>
              </label>
            </div>

            {/* Upload Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!selectedFile || loading}
              loading={loading}
            >
              Upload Resume
            </Button>
          </form>

          {/* Success State */}
          {uploadedResumeId && !analyzedResume && (
            <div className={`mt-8 p-6 rounded-lg flex items-start gap-4 ${
              isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
            }`}>
              <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                  Resume Uploaded Successfully
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-green-200' : 'text-green-700'}`}>
                  Your resume has been uploaded. Click below to analyze it with AI.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={handleAnalyze}
                  loading={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </div>
            </div>
          )}

          {/* ATS Score Display - Shows immediately after analysis */}
          {analyzedResume && (
            <div className="mt-8">
              {/* Score Card */}
              <Card className={`p-6 mb-6 border-2 ${getScoreBgColor(analyzedResume.atsScore)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ATS Score
                    </p>
                    <p className={`text-6xl font-bold ${getScoreColor(analyzedResume.atsScore)}`}>
                      {analyzedResume.atsScore}%
                    </p>
                  </div>
                  <div className={`text-right`}>
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Recommendation
                    </p>
                    {analyzedResume.atsScore >= 75 && (
                      <p className={`text-lg font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        Excellent! ✓
                      </p>
                    )}
                    {analyzedResume.atsScore >= 50 && analyzedResume.atsScore < 75 && (
                      <p className={`text-lg font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Good ⚠
                      </p>
                    )}
                    {analyzedResume.atsScore < 50 && (
                      <p className={`text-lg font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        Needs Work ✗
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Key Metrics */}
              {analyzedResume.atsBreakdown && (
                <Card className="p-6 mb-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Score Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { label: 'Formatting', value: analyzedResume.atsBreakdown.formatting },
                      { label: 'Keywords', value: analyzedResume.atsBreakdown.keywordOptimization },
                      { label: 'Structure', value: analyzedResume.atsBreakdown.structure },
                      { label: 'Length', value: analyzedResume.atsBreakdown.length },
                      { label: 'Readability', value: analyzedResume.atsBreakdown.readability },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`p-3 rounded-lg text-center ${
                          isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <p className={`text-2xl font-bold ${getScoreColor(item.value)} mb-1`}>
                          {item.value}%
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => navigate(`/resume/${analyzedResume._id}`)}
                >
                  View Full Analysis
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setUploadedResumeId(null);
                    setAnalyzedResume(null);
                    setSelectedFile(null);
                  }}
                >
                  Upload Another
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
              📋 Tips for Best Results
            </h3>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ Use a clear, well-formatted resume</li>
              <li>✓ Include relevant keywords and skills</li>
              <li>✓ Save as PDF for best compatibility</li>
              <li>✓ Keep file size under 5MB</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadResume;
