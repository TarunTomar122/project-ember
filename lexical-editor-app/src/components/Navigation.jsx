import React from 'react';
import { 
  ShareIcon,
  InformationCircleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ className = '' }) => {
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - App icon and title */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Ap</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Adobe ParaForge</h1>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <ShareIcon className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <InformationCircleIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <BellIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation; 