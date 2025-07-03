import React, { useState } from 'react';
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
  HeartIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import useBibleStore from '../../stores/bibleStore';
import CharactersList from './Characters/CharactersList';
import LocationsList from './Locations/LocationsList';
import ObjectsList from './Objects/ObjectsList';
import GenericEntityList from './GenericEntityList';

const BibleContainer = () => {
  const [activeSection, setActiveSection] = useState('characters');
  const { selectedEntity, setSelectedEntity, clearAllData, getEntityCounts } = useBibleStore();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const sections = [
    { id: 'characters', name: 'Characters', icon: UserGroupIcon },
    { id: 'locations', name: 'Locations', icon: MapPinIcon },
    { id: 'objects', name: 'Objects', icon: CubeIcon },
    { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon },
    { id: 'events', name: 'Events', icon: CalendarDaysIcon },
    { id: 'timelines', name: 'Timelines', icon: ClockIcon },
    { id: 'themes', name: 'Themes', icon: LightBulbIcon },
    { id: 'conflicts', name: 'Conflicts', icon: ExclamationTriangleIcon },
    { id: 'scenes', name: 'Scenes', icon: FilmIcon },
    { id: 'magicSystems', name: 'Magic Systems', icon: SparklesIcon },
    { id: 'lore', name: 'Lore & Rules', icon: DocumentTextIcon },
    { id: 'relationships', name: 'Relationships', icon: HeartIcon }
  ];

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirmation(false);
  };

  const entityCounts = getEntityCounts();

  const renderContent = () => {
    switch (activeSection) {
      case 'characters':
        return <CharactersList />;
      case 'locations':
        return <LocationsList />;
      case 'objects':
        return <ObjectsList />;
      case 'organizations':
        return <GenericEntityList entityType="organizations" displayName="Organizations" icon="🏢" />;
      case 'events':
        return <GenericEntityList entityType="events" displayName="Events" icon="📅" />;
      case 'timelines':
        return <GenericEntityList entityType="timelines" displayName="Timelines" icon="⏰" />;
      case 'themes':
        return <GenericEntityList entityType="themes" displayName="Themes" icon="💡" />;
      case 'conflicts':
        return <GenericEntityList entityType="conflicts" displayName="Conflicts" icon="⚔️" />;
      case 'scenes':
        return <GenericEntityList entityType="scenes" displayName="Scenes" icon="🎬" />;
      case 'magicSystems':
        return <GenericEntityList entityType="magicSystems" displayName="Magic Systems" icon="✨" />;
      case 'lore':
        return <GenericEntityList entityType="lore" displayName="Lore & Rules" icon="📜" />;
      case 'relationships':
        return <GenericEntityList entityType="relationships" displayName="Relationships" icon="💕" />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <h3 className="text-lg font-medium mb-2">Welcome to your Story Bible</h3>
            <p>Select a section to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Story Bible</h1>
            <p className="text-sm text-gray-600">Manage your story world and characters</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowClearConfirmation(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-wrap gap-2 p-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Detail Panel (when entity is selected) */}
      {selectedEntity && (
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedEntity.name || selectedEntity.title || 'Untitled'}
              </h3>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    {selectedEntity.description || selectedEntity.personality || selectedEntity.background || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedEntity.tags && selectedEntity.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntity.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedEntity.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedEntity.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500 space-y-1">
                  <div>Created: {new Date(selectedEntity.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(selectedEntity.updatedAt).toLocaleDateString()}</div>
                  <div>ID: {selectedEntity.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowClearConfirmation(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Clear All Bible Data
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to clear all Bible data? This action cannot be undone and will permanently delete:
                      </p>
                      <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                        <li>{entityCounts.characters} Characters</li>
                        <li>{entityCounts.locations} Locations</li>
                        <li>{entityCounts.objects} Objects</li>
                        <li>{entityCounts.organizations} Organizations</li>
                        <li>{entityCounts.events} Events</li>
                        <li>{entityCounts.magicSystems} Magic Systems</li>
                        <li>{entityCounts.timelines} Timelines</li>
                        <li>{entityCounts.themes} Themes</li>
                        <li>{entityCounts.conflicts} Conflicts</li>
                        <li>{entityCounts.lore} Lore</li>
                        <li>{entityCounts.scenes} Scenes</li>
                        <li>{entityCounts.relationships} Relationships</li>
                      </ul>
                      <p className="mt-2 text-sm font-medium text-red-600">
                        Total: {entityCounts.total} items will be deleted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleClearAll}
                >
                  Clear All Data
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowClearConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleContainer; 