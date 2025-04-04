import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Layout = () => {
  const { user, switchUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch all users when component mounts
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(console.error);
  }, []);

  // Group users by role for the dropdown
  const groupedUsers = allUsers.reduce((acc, user) => {
    const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(user);
    return acc;
  }, {});

  const isActive = (path) => location.pathname === path;

  // Role-based navigation items
  const getNavItems = () => {
    const items = [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: HomeIcon,
        roles: ['employee', 'manager', 'admin']
      }
    ];

    if (user.role === 'employee') {
      items.push({
        name: 'Submit Update',
        path: '/submit-update',
        icon: PencilSquareIcon,
        roles: ['employee']
      });
    }

    if (['manager', 'admin'].includes(user.role)) {
      items.push({
        name: 'Feedback Queue',
        path: '/feedback',
        icon: ChatBubbleLeftIcon,
        roles: ['manager', 'admin']
      });
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-company-500">MyApp</h1>
          
          {/* User Switcher */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Viewing as:
            </span>
            <select 
              value={user.id}
              onChange={(e) => {
                const selectedUser = allUsers.find(u => u.id === Number(e.target.value));
                switchUser(selectedUser);
              }}
              className="text-sm border rounded p-1"
            >
              {Object.entries(groupedUsers).map(([role, users]) => (
                <optgroup key={role} label={role}>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-64">
            <ul className="space-y-2">
              {getNavItems().map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-company-50 text-company-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 