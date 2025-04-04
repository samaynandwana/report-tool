import { useState } from 'react';
import { useApi } from './useApi';

export const useUpdateActions = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUpdate = async (updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/updates', updateData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create update');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUpdate = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/updates/${id}`, updateData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (updateId, feedbackData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/updates/${updateId}/feedback`, feedbackData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUpdate,
    updateUpdate,
    submitFeedback,
    loading,
    error
  };
}; 