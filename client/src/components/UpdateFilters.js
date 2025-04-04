import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

const UpdateFilters = ({ filters, onFilterChange }) => {
  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' }
  ];

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="flex items-center">
        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm text-gray-700">Filter by:</span>
      </div>
      
      <select
        value={filters.timeRange}
        onChange={(e) => onFilterChange('timeRange', e.target.value)}
        className="rounded-md border-gray-300 text-sm focus:border-company-500 focus:ring-company-500"
      >
        {timeRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="rounded-md border-gray-300 text-sm focus:border-company-500 focus:ring-company-500"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UpdateFilters; 