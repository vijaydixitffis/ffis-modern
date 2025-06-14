import React from 'react';
import { FileText } from 'lucide-react';
import FFISLogo from '../../../resources/FFIS-logo.png';

interface HeaderProps {
  title: string;
  description: string;
}

function Header({ title, description }: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        {/* FFIS Logo */}
        <div className="flex-shrink-0">
          <img 
            src={FFISLogo} 
            alt="FFIS Logo" 
            className="h-24 object-contain"
          />
        </div>
        
        {/* Title Section */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {title}
            </h1>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl">
            {description}
          </p>
        </div>
        
        {/* Empty div for balance */}
        <div className="flex-shrink-0 w-24"></div>
      </div>
    </div>
  );
}

export default Header; 