import React from 'react';
import { CategoryProgress } from '../types/assessment';

interface OverallProgressProps {
  categoryProgress: CategoryProgress[];
  totalQuestions: number;
  answeredQuestions: number;
}

export const OverallProgress: React.FC<OverallProgressProps> = ({
  categoryProgress,
  totalQuestions,
  answeredQuestions
}) => {
  const overallPercentage = (answeredQuestions / totalQuestions) * 100;
  const completedCategories = categoryProgress.filter(cp => cp.completed === cp.total).length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-bold text-gray-800">Overall Progress</h2>
          <p className="text-gray-600 text-xs">
            {answeredQuestions}/{totalQuestions} questions • {completedCategories}/{categoryProgress.length} categories
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-blue-600">
            {Math.round(overallPercentage)}%
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${overallPercentage}%` }}
        />
      </div>
    </div>
  );
};