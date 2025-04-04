import React, { useState } from 'react';
import { useUpdates } from '../hooks/useUpdates';
import { useUpdateActions } from '../hooks/useUpdateActions';
import FeedbackModal from '../components/FeedbackModal';
import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Feedback = () => {
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updates, loading, error } = useUpdates({ status: 'submitted' });
  const { submitFeedback } = useUpdateActions();

  const handleSubmitFeedback = async (feedbackData) => {
    setIsSubmitting(true);
    try {
      await submitFeedback(selectedUpdate.id, feedbackData);
      setSelectedUpdate(null);
      // Optionally refresh the updates list
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUpdateCard = (update) => {
    const hasSubmittedFeedback = update.feedback?.some(f => f.manager_id === 1); // Replace with actual manager ID

    return (
      <div
        key={update.id}
        className={`bg-white rounded-lg border ${
          hasSubmittedFeedback ? 'border-green-200' : 'border-gray-200'
        } p-6 hover:shadow-md transition-shadow`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {update.user?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(update.week_start), 'MMM d')} - {format(new Date(update.week_end), 'MMM d, yyyy')}
            </p>
          </div>
          {hasSubmittedFeedback ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : (
            <button
              onClick={() => setSelectedUpdate(update)}
              className="btn-primary"
            >
              Give Feedback
            </button>
          )}
        </div>

        <p className="text-gray-600 line-clamp-3 mb-4">
          {update.content}
        </p>

        {hasSubmittedFeedback && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Your Feedback</h4>
            <p className="text-sm text-gray-600">
              {update.feedback.find(f => f.manager_id === 1)?.comment || 'No comment provided'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Queue</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 text-company-500 mx-auto mb-4">
            {/* Add a loading spinner SVG here */}
          </div>
          <p className="text-gray-500">Loading updates...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900">Failed to load updates</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : updates.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-900">No updates need feedback</p>
          <p className="text-sm text-gray-500">
            Check back later for new updates
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {updates.map(renderUpdateCard)}
        </div>
      )}

      {selectedUpdate && (
        <FeedbackModal
          update={selectedUpdate}
          onClose={() => setSelectedUpdate(null)}
          onSubmit={handleSubmitFeedback}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Feedback; 