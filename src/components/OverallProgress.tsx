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
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-4">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Overall Progress</h2>
        <p className="text-gray-600 text-xs">
          Complete all categories to get your assessment
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            Questions Answered
          </span>
          <span className="text-lg font-bold text-blue-600">
            {answeredQuestions}/{totalQuestions}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>{Math.round(overallPercentage)}% Complete</span>
          <span>{completedCategories}/{categoryProgress.length} Categories Done</span>
        </div>
      </div>
    </div>
  );
};