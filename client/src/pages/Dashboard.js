import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUpdates } from '../hooks/useUpdates';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { CheckCircleIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const { updates, loading, error } = useUpdates({
    status: statusFilter === 'All Status' ? null : statusFilter.toLowerCase(),
    userId: selectedEmployee?.id || user.id
  });

  // Fetch employees for managers
  useEffect(() => {
    if (user.role === 'manager') {
      axios.get(`${process.env.REACT_APP_API_URL}/users/employees?manager_id=${user.id}`)
        .then(response => {
          setEmployees(response.data);
          // Don't automatically select first employee for managers
          // so they see their own updates by default
        })
        .catch(console.error);
    }
  }, [user]);

  const renderUpdateCard = (update) => {
    const statusIcon = update.is_finalized ? (
      <div className="flex items-center text-green-600">
        <CheckCircleIcon className="h-5 w-5 mr-1" />
        <span>Submitted</span>
      </div>
    ) : (
      <div className="flex items-center text-yellow-600">
        <ClockIcon className="h-5 w-5 mr-1" />
        <span>Draft</span>
      </div>
    );

    return (
      <div key={update.id} className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {format(new Date(update.week_start), 'MMM d')} - {format(new Date(update.week_end), 'MMM d, yyyy')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{update.content}</p>
          </div>
          <div className="flex items-center gap-4">
            {statusIcon}
            {!update.is_finalized && (
              <>
                <Link
                  to={`/submit-update/${update.id}`}
                  className="text-company-600 hover:text-company-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={async () => {
                    if (update.id === 'new') {
                      return; // Don't allow deleting the current week's blank update
                    }
                    
                    try {
                      await axios.delete(`${process.env.REACT_APP_API_URL}/updates/${update.id}`);
                      window.location.reload();
                    } catch (error) {
                      console.error('Error deleting update:', error);
                      alert('Failed to delete update');
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
        {update.Feedbacks?.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            {update.Feedbacks.map(feedback => (
              <div key={feedback.id} className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-company-100 text-company-600">
                  {feedback.manager?.name[0]}
                </span>
                <p className="ml-2 text-sm text-gray-600">{feedback.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Weekly Updates
          </h2>
        </div>
        {/* Allow both employees and managers to submit updates */}
        {(user.role === 'employee' || user.role === 'manager') && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link to="/submit-update" className="btn-primary">
              Current Update
            </Link>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        {/* Employee Selection for Managers */}
        {user.role === 'manager' && employees.length > 0 && (
          <select
            value={selectedEmployee?.id || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedEmployee(selectedId ? employees.find(emp => emp.id === Number(selectedId)) : null);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
          >
            <option value="">My Updates</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}'s Updates
              </option>
            ))}
          </select>
        )}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
        >
          <option>All Status</option>
          <option>Draft</option>
          <option>Submitted</option>
        </select>
      </div>

      {/* Updates Display */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <div className="space-y-6">
          {updates.map(renderUpdateCard)}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 