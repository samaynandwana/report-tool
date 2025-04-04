import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns';

const SubmitUpdate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [existingUpdate, setExistingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    content: ''
  });
  const [status, setStatus] = useState('');

  // Fetch existing update for current week
  useEffect(() => {
    const fetchCurrentWeekUpdate = async () => {
      try {
        setStatus('Loading...');
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(weekStart);

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/updates`, {
          params: {
            user_id: user.id,
            week_start: weekStart.toISOString(),
            week_end: weekEnd.toISOString()
          }
        });

        const update = response.data[0];
        if (update) {
          setExistingUpdate(update);
          setFormData({
            content: update.content || ''
          });
        } else {
          setExistingUpdate(null);
          setFormData({
            content: ''
          });
        }
        setStatus('');
      } catch (error) {
        console.error('Error fetching update:', error);
        setStatus('Error loading update');
      }
    };

    fetchCurrentWeekUpdate();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus('Saving...');
      
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(weekStart);
      
      const data = {
        ...formData,
        user_id: user.id,
        week_start: weekStart,
        week_end: weekEnd,
        is_finalized: false
      };

      if (existingUpdate && existingUpdate.id !== 'new') {
        await axios.put(`${process.env.REACT_APP_API_URL}/updates/${existingUpdate.id}`, data);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/updates`, data);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting update:', error);
      setStatus('Error saving update. Please try again.');
      return;
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Current Week Update
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

        {status && (
          <p className="text-sm text-gray-600">
            {status}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary"
          >
            Save Update
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