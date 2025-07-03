import React from 'react';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  CubeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ClockIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  FilmIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import useBibleStore from '../stores/bibleStore';

const LeftSidebar = ({ activeTab, setActiveTab }) => {
  const { activeBibleSection, setActiveBibleSection } = useBibleStore();

  const sidebarSections = [
    {
      id: 'entities',
      name: 'Entities',
      color: 'text-green-600',
      items: [
        { id: 'characters', name: 'Characters', icon: UserGroupIcon },
        { id: 'locations', name: 'Locations', icon: MapPinIcon },
        { id: 'objects', name: 'Objects', icon: CubeIcon },
        { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon }
      ]
    },
    {
      id: 'story',
      name: 'Story Elements',
      color: 'text-purple-600',
      items: [
        { id: 'events', name: 'Events', icon: CalendarDaysIcon },
        { id: 'timelines', name: 'Timelines', icon: ClockIcon },
        { id: 'themes', name: 'Themes', icon: LightBulbIcon },
        { id: 'conflicts', name: 'Conflicts', icon: ExclamationTriangleIcon },
        { id: 'scenes', name: 'Scenes', icon: FilmIcon }
      ]
    },
    {
      id: 'world',
      name: 'World Building',
      color: 'text-orange-600',
      items: [
        { id: 'magicSystems', name: 'Magic Systems', icon: SparklesIcon },
        { id: 'lore', name: 'Lore & Rules', icon: DocumentTextIcon },
        { id: 'relationships', name: 'Relationships', icon: HeartIcon }
      ]
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveBibleSection(itemId);
    setActiveTab('bible');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Story Bible</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your story elements</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {sidebarSections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${section.color} mb-3 px-2`}>
                  {section.name}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === 'bible' && activeBibleSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar; 