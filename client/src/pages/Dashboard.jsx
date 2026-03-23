import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes } from '../features/resumeSlice';
import { getJobMatches } from '../features/jobSlice';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonLoader from '../components/Loader';
import { formatDate, getScoreColor, getScoreBgColor } from '../utils/helpers';
import { FileText, Briefcase, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading: resumeLoading } = useSelector((state) => state.resume);
  const { matches, loading: jobLoading } = useSelector((state) => state.job);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(getResumes());
    dispatch(getJobMatches());
  }, [dispatch]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Resumes</p>
                <p className="text-2xl font-bold">{resumes.length}</p>
              </div>
              <FileText size={40} className="text-blue-600 opacity-70" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Job Matches</p>
                <p className="text-2xl font-bold">{matches.length}</p>
              </div>
              <Briefcase size={40} className="text-green-600 opacity-70" />
            </div>
          </Card>
        </div>

        {/* Recent Resumes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Resumes
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/upload')}
            >
              Upload New
            </Button>
          </div>

          {resumeLoading ? (
            <SkeletonLoader count={3} height="h-20" />
          ) : resumes.length > 0 ? (
            <div className="space-y-3">
              {resumes.slice(0, 5).map((resume) => (
                <Card key={resume._id} className="p-4 cursor-pointer hover:shadow-lg transition">
                  <div
                    className="flex items-center justify-between"
                    onClick={() => navigate(`/resume/${resume._id}`)}
                  >
                    <div className="flex-1">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {resume.fileName}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(resume.createdAt)}
                      </p>
                    </div>
                    {resume.analyzed && (
                      <div className={`text-right ${getScoreColor(resume.atsScore)}`}>
                        <p className="font-bold">{resume.atsScore}%</p>
                        <p className="text-xs">ATS Score</p>
                      </div>
                    )}
                    <ArrowRight size={20} className="ml-4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No resumes yet. Start by uploading one!
              </p>
            </Card>
          )}
        </div>

        {/* Recent Job Matches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Job Matches
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/matcher')}
            >
              Match Job
            </Button>
          </div>

          {jobLoading ? (
            <SkeletonLoader count={3} height="h-20" />
          ) : matches.length > 0 ? (
            <div className="space-y-3">
              {matches.slice(0, 5).map((match) => (
                <Card key={match._id} className="p-4 cursor-pointer hover:shadow-lg transition">
                  <div
                    className="flex items-center justify-between"
                    onClick={() => navigate(`/match/${match._id}`)}
                  >
                    <div className="flex-1">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {match.jobTitle}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(match.createdAt)}
                      </p>
                    </div>
                    <div className={`text-right ${getScoreColor(match.matchScore)}`}>
                      <p className="font-bold">{match.matchScore}%</p>
                      <p className="text-xs">Match Score</p>
                    </div>
                    <ArrowRight size={20} className="ml-4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No matches yet. Try matching a job!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
