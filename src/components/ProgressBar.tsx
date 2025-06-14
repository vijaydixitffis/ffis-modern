import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{current} of {total} completed</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};