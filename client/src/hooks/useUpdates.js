import { useState, useEffect } from 'react';
import { useApi } from './useApi';

const DUMMY_UPDATES = [
  {
    id: 1,
    user: { id: 1, name: 'John Doe', email: 'john@example.com' },
    content: 'Completed the frontend dashboard implementation and started working on the API integration. Planning to finish the authentication system by end of week.',
    week_start: '2023-11-20',
    week_end: '2023-11-26',
    is_finalized: true,
    feedback: [
      {
        id: 1,
        manager: { id: 2, name: 'Jane Manager' },
        rating: 5
      }
    ]
  },
  {
    id: 2,
    user: { id: 1, name: 'John Doe', email: 'john@example.com' },
    content: 'Working on the database schema and API endpoints. Need to discuss the authentication approach in next planning session.',
    week_start: '2023-11-27',
    week_end: '2023-12-03',
    is_finalized: false,
    feedback: []
  }
];

export const useUpdates = (filters = {}) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter dummy data based on status
        let filteredUpdates = [...DUMMY_UPDATES];
        if (filters.status === 'draft') {
          filteredUpdates = filteredUpdates.filter(u => !u.is_finalized);
        } else if (filters.status === 'submitted') {
          filteredUpdates = filteredUpdates.filter(u => u.is_finalized);
        }
        
        setUpdates(filteredUpdates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [JSON.stringify(filters)]);

  return { updates, loading, error };
}; 