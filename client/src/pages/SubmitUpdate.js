import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SubmitUpdate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    content: '',
    is_finalized: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Implement API call to submit update
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/updates`, {
        ...formData,
        user_id: user.id,
        week_start: getWeekStart(),
        week_end: getWeekEnd(),
        submitted_at: formData.is_finalized ? new Date().toISOString() : null
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting update:', error);
      // TODO: Show error message to user
    }
  };

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  };

  const getWeekEnd = () => {
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Submit Weekly Update
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            What did you work on this week?
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Describe your progress, challenges, and plans..."
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="is_finalized"
            name="is_finalized"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-company-600 focus:ring-company-500"
            checked={formData.is_finalized}
            onChange={(e) => setFormData({ ...formData, is_finalized: e.target.checked })}
          />
          <label htmlFor="is_finalized" className="ml-2 block text-sm text-gray-900">
            Submit as final (cannot be edited after submission)
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary"
          >
            {formData.is_finalized ? 'Submit Update' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitUpdate; 