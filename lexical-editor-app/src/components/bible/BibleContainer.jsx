import React from 'react';
import useBibleStore from '../../stores/bibleStore';
import CharactersList from './Characters/CharactersList';
import LocationsList from './Locations/LocationsList';
import ObjectsList from './Objects/ObjectsList';
import GenericEntityList from './GenericEntityList';
import BibleSidebar from './Common/BibleSidebar';

const BibleContainer = () => {
  // Get UI state from store
  const { activeBibleSection, selectedEntity, setSelectedEntity } = useBibleStore();

  const renderContent = () => {
    switch (activeBibleSection) {
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
            <p>Select a section from the sidebar to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default BibleContainer; 