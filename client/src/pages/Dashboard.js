import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUpdates } from '../hooks/useUpdates';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { CheckCircleIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const { updates, loading, error } = useUpdates({
    status: statusFilter === 'All Status' ? null : statusFilter.toLowerCase(),
    userId: selectedEmployee?.id || user.id,
    weekStart: startOfWeek(selectedDate),
    weekEnd: endOfWeek(selectedDate)
  });

  // Fetch employees for managers
  useEffect(() => {
    if (user.role === 'manager') {
      axios.get(`${process.env.REACT_APP_API_URL}/users/employees?manager_id=${user.id}`)
        .then(response => {
          setEmployees(response.data);
          if (!selectedEmployee) {
            setSelectedEmployee(response.data[0]);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handlePreviousWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addWeeks(prev, 1));
  };

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
          {statusIcon}
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
        {user.role === 'employee' && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link to="/submit-update" className="btn-primary">
              New Update
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {/* Week Selection */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium">
            Week of {format(startOfWeek(selectedDate), 'MMM d, yyyy')}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4">
          {/* Employee Selection for Managers */}
          {user.role === 'manager' && employees.length > 0 && (
            <select
              value={selectedEmployee?.id || ''}
              onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === Number(e.target.value)))}
              className="rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
            >
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
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