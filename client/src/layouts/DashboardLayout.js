import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilSquareIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: HomeIcon
    },
    {
      path: '/submit-update',
      name: 'Submit Update',
      icon: PencilSquareIcon
    },
    {
      path: '/feedback-queue',
      name: 'Feedback Queue',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-company-500">MyApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                {/* Add user menu here later */}
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${isActive(item.path)
                      ? 'bg-company-50 text-company-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-6">
              {children}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
            <p className="text-sm text-gray-500">
              Future insights and analytics will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 