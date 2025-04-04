import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { startOfWeek, endOfWeek, isSameWeek } from 'date-fns';

export const useUpdates = ({ status, userId } = {}) => {
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
            status
          }
        });

        let processedUpdates = response.data;
        const currentWeekStart = startOfWeek(new Date());
        const currentWeekEnd = endOfWeek(currentWeekStart);

        // Find current week's update if it exists
        const currentWeekUpdate = processedUpdates.find(update => 
          isSameWeek(new Date(update.week_start), new Date())
        );

        // Filter out any current week updates
        processedUpdates = processedUpdates.filter(update => 
          !isSameWeek(new Date(update.week_start), new Date())
        );

        // Add current week update (either existing or blank)
        processedUpdates = [
          currentWeekUpdate || {
            id: 'new',
            user_id: userId || user.id,
            content: '',
            week_start: currentWeekStart,
            week_end: currentWeekEnd,
            is_finalized: false,
            Feedbacks: []
          },
          ...processedUpdates
        ];

        // Ensure past weeks are finalized
        processedUpdates = processedUpdates.map(update => ({
          ...update,
          is_finalized: !isSameWeek(new Date(), new Date(update.week_start))
        }));

        setUpdates(processedUpdates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [user.id, userId, status]);

  return { updates, loading, error };
}; 