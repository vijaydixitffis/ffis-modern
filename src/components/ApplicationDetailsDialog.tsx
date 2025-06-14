import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ApplicationDetails {
  name: string;
  mnemonic: string;
  description: string;
  techStack: string;
  remarks: string;
}

interface ApplicationDetailsDialogProps {
  onClose: () => void;
  onStart: (details: ApplicationDetails) => void;
  initialDetails?: ApplicationDetails;
}

export const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({ 
  onClose, 
  onStart,
  initialDetails 
}) => {
  const [details, setDetails] = useState<ApplicationDetails>({
    name: '',
    mnemonic: '',
    description: '',
    techStack: '',
    remarks: ''
  });

  // Update form when initialDetails changes
  useEffect(() => {
    if (initialDetails) {
      setDetails(initialDetails);
    }
  }, [initialDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(details);
  };

  const handleMnemonicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setDetails(prev => ({ ...prev, mnemonic: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {initialDetails ? 'Update Application Details' : 'Application Details'}
            </h2>
            <p className="text-gray-600">
              {initialDetails 
                ? 'Update the application information below'
                : 'Please provide essential information about the application to be assessed'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Application Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={details.name}
                onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter application name"
              />
            </div>

            <div>
              <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-700 mb-1">
                Application Mnemonic (6 letters) *
              </label>
              <input
                type="text"
                id="mnemonic"
                required
                value={details.mnemonic}
                onChange={handleMnemonicChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="Enter 6-letter code"
                maxLength={6}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                required
                value={details.description}
                onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the application"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
                Tech Stack *
              </label>
              <textarea
                id="techStack"
                required
                value={details.techStack}
                onChange={(e) => setDetails(prev => ({ ...prev, techStack: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the technology stack used"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                id="remarks"
                value={details.remarks}
                onChange={(e) => setDetails(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional remarks"
                rows={2}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {initialDetails ? 'Update Details' : 'Start Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 