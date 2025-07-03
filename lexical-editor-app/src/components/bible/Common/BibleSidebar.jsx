import useBibleStore from '../../../stores/bibleStore';
import { ENTITY_TYPES } from '../../../data/schemas';

const BibleSidebar = () => {
  const { 
    activeBibleSection, 
    setActiveBibleSection, 
    characters, 
    locations, 
    objects, 
    lore, 
    scenes, 
    project,
    openCreateModal
  } = useBibleStore();

  const sections = [
    {
      id: 'project',
      label: 'Project Overview',
      icon: '📋',
      count: project ? 1 : 0,
      type: ENTITY_TYPES.PROJECT
    },
    {
      id: 'characters',
      label: 'Characters',
      icon: '👥',
      count: characters.length,
      type: ENTITY_TYPES.CHARACTER
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: '🗺️',
      count: locations.length,
      type: ENTITY_TYPES.LOCATION
    },
    {
      id: 'objects',
      label: 'Objects & Items',
      icon: '🎒',
      count: objects.length,
      type: ENTITY_TYPES.OBJECT
    },
    {
      id: 'lore',
      label: 'Lore & Rules',
      icon: '📜',
      count: lore.length,
      type: ENTITY_TYPES.LORE,
      disabled: true // Phase 1 limitation
    },
    {
      id: 'scenes',
      label: 'Scenes',
      icon: '🎬',
      count: scenes.length,
      type: ENTITY_TYPES.SCENE,
      disabled: true // Phase 1 limitation
    }
  ];

  const handleSectionClick = (section) => {
    if (!section.disabled) {
      setActiveBibleSection(section.id);
    }
  };

  const handleCreateClick = (section, e) => {
    e.stopPropagation();
    if (!section.disabled) {
      openCreateModal(section.type);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Story Bible</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your story elements</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {sections.map((section) => (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => handleSectionClick(section)}
                disabled={section.disabled}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeBibleSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : section.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{section.icon}</span>
                  <span className={section.disabled ? 'line-through' : ''}>{section.label}</span>
                  {section.disabled && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeBibleSection === section.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {section.count}
                  </span>
                  {!section.disabled && (
                    <button
                      onClick={(e) => handleCreateClick(section, e)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                      title={`Create new ${section.label.toLowerCase()}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer with Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          {/* Quick Actions */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Quick Actions
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => openCreateModal(ENTITY_TYPES.CHARACTER)}
                className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <span className="mr-2">👤</span>
                New Character
              </button>
              <button
                onClick={() => openCreateModal(ENTITY_TYPES.LOCATION)}
                className="w-full flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <span className="mr-2">📍</span>
                New Location
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Total Entries:</span>
                <span>{characters.length + locations.length + objects.length + lore.length + scenes.length}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Last Updated:</span>
                <span>
                  {characters.length > 0 || locations.length > 0 
                    ? 'Today'
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleSidebar; 