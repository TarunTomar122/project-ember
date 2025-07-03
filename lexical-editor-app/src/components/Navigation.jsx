import React from 'react';
import { 
  HomeIcon,
  BookOpenIcon,
  BeakerIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ activeTab, setActiveTab, className = '' }) => {
  const mainTabs = [
    {
      id: 'editor',
      name: 'Editor',
      icon: HomeIcon
    },
    {
      id: 'bible',
      name: 'Story Bible',
      icon: BookOpenIcon
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: BeakerIcon
    },
    {
      id: 'analysis',
      name: 'Analysis',
      icon: MagnifyingGlassIcon
    }
  ];

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">Project Ember</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 