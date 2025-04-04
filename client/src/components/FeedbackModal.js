import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const FeedbackModal = ({ update, onClose, onSubmit, isSubmitting }) => {
  const [feedback, setFeedback] = useState({
    rating: 3,
    comment: '',
    isExceptional: false,
    feedbackType: 'weekly'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-left sm:mt-0">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                Submit Feedback
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  For update from {update.user?.name}
                  <br />
                  <span className="text-xs">
                    Submitted on {new Date(update.submitted_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {update.content}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-8 w-8 ${
                            star <= feedback.rating
                              ? 'text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-company-500 focus:ring-company-500 sm:text-sm"
                    placeholder="Provide specific feedback..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="exceptional"
                    checked={feedback.isExceptional}
                    onChange={(e) => setFeedback(prev => ({ ...prev, isExceptional: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-company-600 focus:ring-company-500"
                  />
                  <label htmlFor="exceptional" className="ml-2 block text-sm text-gray-900">
                    Mark as exceptional performance
                  </label>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-company-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-company-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 