import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ApplicationDetails {
  name: string;
  mnemonic: string;
  description: string;
  techStack: string;
  remarks: string;
  ownerName: string;
  companyName: string;
  designation: string;
  email: string;
  phone: string;
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
    remarks: '',
    ownerName: '',
    companyName: '',
    designation: '',
    email: '',
    phone: ''
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Application Name & Mnemonic */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-medium text-gray-700">Application Name *</label>
              <input
                type="text"
                id="name"
                required
                value={details.name}
                onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter application name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mnemonic" className="text-xs font-medium text-gray-700">Application Mnemonic *</label>
              <input
                type="text"
                id="mnemonic"
                required
                value={details.mnemonic}
                onChange={handleMnemonicChange}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm uppercase"
                placeholder="Enter code (max 6 chars)"
                maxLength={6}
              />
            </div>

            {/* Description & Tech Stack */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="description" className="text-xs font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                required
                value={details.description}
                onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Brief description of the application"
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label htmlFor="techStack" className="text-xs font-medium text-gray-700">Tech Stack *</label>
              <textarea
                id="techStack"
                required
                value={details.techStack}
                onChange={(e) => setDetails(prev => ({ ...prev, techStack: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Describe the technology stack used"
                rows={2}
              />
            </div>

            {/* Owner Name & Company Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="ownerName" className="text-xs font-medium text-gray-700">Owner Name *</label>
              <input
                type="text"
                id="ownerName"
                required
                value={details.ownerName}
                onChange={(e) => setDetails(prev => ({ ...prev, ownerName: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter owner name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className="text-xs font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                id="companyName"
                required
                value={details.companyName}
                onChange={(e) => setDetails(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter company name"
              />
            </div>

            {/* Designation & Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="designation" className="text-xs font-medium text-gray-700">Designation *</label>
              <input
                type="text"
                id="designation"
                required
                value={details.designation}
                onChange={(e) => setDetails(prev => ({ ...prev, designation: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter designation"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-medium text-gray-700">Email *</label>
              <input
                type="email"
                id="email"
                required
                value={details.email}
                onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone & Remarks */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                id="phone"
                required
                value={details.phone}
                onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="remarks" className="text-xs font-medium text-gray-700">Remarks</label>
              <textarea
                id="remarks"
                value={details.remarks}
                onChange={(e) => setDetails(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Any additional remarks"
                rows={2}
              />
            </div>

            <div className="col-span-1 md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
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