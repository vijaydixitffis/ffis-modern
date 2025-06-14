import React from 'react';
import Footer from './Footer';
import ffisLogo from '../../../resources/FFIS-logo.png';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  navigationItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }[];
  onNavigationItemClick: (id: string) => void;
}

function Layout({ children, title, description, navigationItems, onNavigationItemClick }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-4 flex gap-4 min-h-[calc(100vh-2rem)]">
        {/* Left Navigation - Compact with Logo */}
        <nav className="w-48 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 h-full">
            {/* FFIS Logo */}
            <div className="mb-4 px-2">
              <img src={ffisLogo} alt="FFIS Logo" className="h-16 w-auto" />
            </div>
            
            {/* Navigation Items */}
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigationItemClick(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      item.isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-4 h-4">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout; 