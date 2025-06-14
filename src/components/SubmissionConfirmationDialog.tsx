import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface SubmissionConfirmationDialogProps {
  onClose: () => void;
}

export const SubmissionConfirmationDialog: React.FC<SubmissionConfirmationDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Submission Successful
            </h2>
            
            <p className="text-gray-600 mb-8">
              Thank you for submitting the assessment. The results have been successfully recorded in our database.
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 