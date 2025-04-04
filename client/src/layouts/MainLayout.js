import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">MyApp</Link>
            <div className="flex space-x-4">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/update" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/update')}`}
              >
                Update
              </Link>
              <Link 
                to="/feedback" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/feedback')}`}
              >
                Feedback
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 