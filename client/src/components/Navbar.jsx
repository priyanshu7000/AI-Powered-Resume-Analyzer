import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, LogOut, FileText, Briefcase, Moon, Sun } from 'lucide-react';
import { logout } from '../features/authSlice';
import { toggleTheme } from '../features/uiSlice';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav
      className={`${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-b shadow-md transition-colors`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="text-blue-600" size={28} />
          <span className={isDark ? 'text-white' : 'text-gray-900'}>ResumeAI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition`}>
                Dashboard
              </Link>
              <Link to="/upload" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition`}>
                Upload Resume
              </Link>
              <Link to="/matcher" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition`}>
                Job Matcher
              </Link>
            </>
          )}

          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} transition`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-3 border-t`}>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="block py-2 text-blue-600">
                Dashboard
              </Link>
              <Link to="/upload" className="block py-2 text-blue-600">
                Upload Resume
              </Link>
              <Link to="/matcher" className="block py-2 text-blue-600">
                Job Matcher
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full mt-3 px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 justify-center"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-center text-blue-600 border-b">
                Login
              </Link>
              <Link to="/register" className="block py-2 text-center text-blue-600 mt-2">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
