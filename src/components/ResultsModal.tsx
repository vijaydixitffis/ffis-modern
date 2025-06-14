import React from 'react';
import { X, Award, TrendingUp, AlertCircle, XCircle } from 'lucide-react';
import { AssessmentResult } from '../types/assessment';

interface ResultsModalProps {
  result: AssessmentResult;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ result, onClose }) => {
  const getStatusIcon = () => {
    if (result.percentage >= 80) return <Award className="w-8 h-8 text-green-600" />;
    if (result.percentage >= 60) return <TrendingUp className="w-8 h-8 text-blue-600" />;
    if (result.percentage >= 40) return <AlertCircle className="w-8 h-8 text-orange-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Assessment Complete!
            </h2>
            
            <div className="mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {result.percentage}%
              </div>
              
              <div className={`inline-block px-4 py-2 rounded-full border font-semibold ${result.statusColor}`}>
                {result.status}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">
                {result.description}
              </p>
            </div>
            
            <div className="text-sm text-gray-600 mb-6">
              You answered <span className="font-semibold text-gray-800">{result.score} out of 34</span> questions with "Yes"
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Close Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};