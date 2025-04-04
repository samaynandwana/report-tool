import React from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const UpdateListItem = ({ update }) => {
  const statusColor = update.is_finalized ? 'text-green-600' : 'text-yellow-500';
  const StatusIcon = update.is_finalized ? CheckCircleIcon : ClockIcon;

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              {update.user?.name}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-500">
              {format(new Date(update.week_start), 'MMM d')} - {format(new Date(update.week_end), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-gray-600 line-clamp-2">{update.content}</p>
        </div>
        <div className="ml-4 flex items-center">
          <StatusIcon className={`h-5 w-5 ${statusColor}`} />
          <span className={`ml-2 text-sm ${statusColor}`}>
            {update.is_finalized ? 'Submitted' : 'Draft'}
          </span>
        </div>
      </div>
      {update.feedback && update.feedback.length > 0 && (
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-500">
            {update.feedback.length} feedback response{update.feedback.length !== 1 ? 's' : ''}
          </span>
          <div className="ml-2 flex -space-x-1">
            {update.feedback.slice(0, 3).map((feedback) => (
              <div
                key={feedback.id}
                className="h-6 w-6 rounded-full bg-company-100 flex items-center justify-center"
                title={feedback.manager?.name}
              >
                <span className="text-xs text-company-600">
                  {feedback.manager?.name.charAt(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateListItem; 