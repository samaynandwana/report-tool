import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateActions } from '../hooks/useUpdateActions';
import { validateUpdate } from '../utils/updateValidation';
import { startOfWeek, endOfWeek, format } from 'date-fns';

const Update = () => {
  const navigate = useNavigate();
  const { createUpdate, loading, error: apiError } = useUpdateActions();
  const [validationErrors, setValidationErrors] = useState({});

  // Get current week's start and end dates
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const [formData, setFormData] = useState({
    content: '',
    weekStart: format(currentWeekStart, 'yyyy-MM-dd'),
    weekEnd: format(currentWeekEnd, 'yyyy-MM-dd'),
    isFinalized: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const { isValid, errors } = validateUpdate(formData);
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    try {
      await createUpdate({
        content: formData.content,
        weekStart: formData.weekStart,
        weekEnd: formData.weekEnd,
        isFinalized: formData.isFinalized
      });

      navigate('/dashboard', { 
        state: { message: 'Update submitted successfully' }
      });
    } catch (err) {
      // Error is handled by useUpdateActions
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            New Weekly Update
          </h2>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <label htmlFor="weekStart" className="block text-sm font-medium text-gray-700">
            Week Period
          </label>
          <div className="mt-1 flex space-x-4">
            <div className="flex-1">
              <input
                type="date"
                name="weekStart"
                id="weekStart"
                value={formData.weekStart}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center text-gray-500">to</div>
            <div className="flex-1">
              <input
                type="date"
                name="weekEnd"
                id="weekEnd"
                value={formData.weekEnd}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Update Content
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your progress, challenges, and plans for the week..."
              className={`block w-full rounded-md shadow-sm sm:text-sm
                ${validationErrors.content 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-company-500 focus:ring-company-500'
                }`}
            />
          </div>
          {validationErrors.content && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.content}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="isFinalized"
            name="isFinalized"
            type="checkbox"
            checked={formData.isFinalized}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-company-600 focus:ring-company-500"
          />
          <label htmlFor="isFinalized" className="ml-2 block text-sm text-gray-900">
            Mark as final (cannot be edited after submission)
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-company-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-company-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-company-700 focus:outline-none focus:ring-2 focus:ring-company-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : formData.isFinalized ? 'Submit Update' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update; 