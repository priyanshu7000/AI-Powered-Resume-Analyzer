import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import { FileText, Zap, Target } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero */}
      <div className={`py-20 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Resume Analyzer & Job Matcher
          </h1>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Optimize your resume with AI and match it with your dream jobs. Get instant feedback and boost your ATS score.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Smart Resume Analysis',
                description: 'AI-powered analysis of your resume with ATS optimization tips and missing skills identification.',
              },
              {
                icon: Zap,
                title: 'Instant Feedback',
                description: 'Get real-time suggestions to improve your resume score and increase job prospects.',
              },
              {
                icon: Target,
                title: 'Job Matching',
                description: 'Compare your resume with job descriptions and find how well you match any opportunity.',
              },
            ].map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={i}
                  className={`p-8 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                >
                  <IconComponent size={40} className="text-blue-600 mb-4" />
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-blue-600'}`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-white'}`}>
            Ready to Land Your Dream Job?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-blue-100'}`}>
            Start optimizing your resume today with AI-powered insights.
          </p>
          <Button
            variant={isDark ? 'primary' : 'primary'}
            size="lg"
            onClick={() => navigate('/register')}
            className={!isDark ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
