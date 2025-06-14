import React from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Category, Answer } from '../types/assessment';
import { QuestionCard } from './QuestionCard';

interface CategoryDialogProps {
  category: Category;
  answers: Answer[];
  onAnswerChange: (questionId: number, value: 'yes' | 'no') => void;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  categoryIndex: number;
  totalCategories: number;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  category,
  answers,
  onAnswerChange,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  categoryIndex,
  totalCategories
}) => {
  const getAnswer = (questionId: number): Answer | undefined => {
    return answers.find(answer => answer.questionId === questionId);
  };

  const completedQuestions = category.questions.filter(q => 
    getAnswer(q.id)?.value !== null && getAnswer(q.id)?.value !== undefined
  ).length;

  const allQuestionsAnswered = completedQuestions === category.questions.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
            {allQuestionsAnswered && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Category {categoryIndex + 1} of {totalCategories}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedQuestions}/{category.questions.length} completed
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((completedQuestions / category.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedQuestions / category.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {category.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={getAnswer(question.id)}
                onAnswerChange={onAnswerChange}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasPrevious
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalCategories }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === categoryIndex
                    ? 'bg-blue-500 w-6'
                    : i < categoryIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasNext
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};