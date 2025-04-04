import React, { useState } from 'react';
import { useUpdates } from '../hooks/useUpdates';
import UpdateListItem from '../components/UpdateListItem';
import UpdateFilters from '../components/UpdateFilters';
import { ChartBarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    timeRange: 'week',
    status: 'all'
  });

  const { updates, loading, error } = useUpdates(filters);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Updates</h1>
        <button className="btn-primary">
          New Update
        </button>
      </div>

      <UpdateFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading updates...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900">Failed to load updates</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : updates.length === 0 ? (
          <div className="p-8 text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-900">No updates found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or create a new update
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {updates.map((update) => (
              <div key={update.id} className="px-6">
                <UpdateListItem update={update} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 