import React from 'react';
import { 
  LightBulbIcon,
  PencilIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  MegaphoneIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const MainSideNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'brainstorm',
      name: 'Brainstorm',
      icon: LightBulbIcon
    },
    {
      id: 'write',
      name: 'Write',
      icon: PencilIcon
    },
    {
      id: 'bible',
      name: 'Story Bible',
      icon: BookOpenIcon
    },
    {
      id: 'analyse',
      name: 'Analyse',
      icon: ChartBarIcon
    },
    {
      id: 'publish',
      name: 'Publish',
      icon: RocketLaunchIcon
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: MegaphoneIcon
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainSideNavigation; 