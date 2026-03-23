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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.resume);
  const { showSuccess, showError } = useToast();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

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
    const result = await dispatch(analyzeResume(uploadedResumeId));
    if (result.payload) {
      showSuccess('Resume analyzed successfully!');
      navigate('/dashboard');
    } else {
      showError(result.error.message || 'Analysis failed');
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
          {uploadedResumeId && (
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
                  Analyze Resume
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
