import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const useUpdates = ({ status, userId, weekStart, weekEnd } = {}) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/updates`, {
          params: {
            user_id: userId || user.id,
            status,
            week_start: weekStart?.toISOString(),
            week_end: weekEnd?.toISOString()
          }
        });
        setUpdates(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [user.id, userId, status, weekStart, weekEnd]);

  return { updates, loading, error };
}; 