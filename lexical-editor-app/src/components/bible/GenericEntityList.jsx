import { useState, useMemo } from 'react';
import useBibleStore from '../../stores/bibleStore';

const GenericEntityList = ({ entityType, displayName, icon }) => {
  const store = useBibleStore();
  const entities = store[entityType] || [];
  const selectedEntity = store.selectedEntity;
  const setSelectedEntity = store.setSelectedEntity;
  const openCreateModal = store.openCreateModal;
  
  // Get the appropriate delete function
  const deleteFunction = store[`delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`];

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Sort entities
  const sortedEntities = useMemo(() => {
    return [...entities].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || a.title || '').localeCompare(b.name || b.title || '');
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  }, [entities, sortBy]);

  const handleEntityClick = (entity) => {
    setSelectedEntity(selectedEntity?.id === entity.id ? null : entity);
  };

  const handleEditEntity = (entity, e) => {
    e.stopPropagation();
    console.log('Edit entity:', entity);
  };

  const handleDeleteEntity = (entity, e) => {
    e.stopPropagation();
    if (deleteFunction) {
      deleteFunction(entity.id);
    }
  };

  const getEntityDescription = (entity) => {
    return entity.description || 
           entity.personality || 
           entity.background || 
           entity.summary || 
           entity.purpose ||
           entity.details ||
           'No description available';
  };

  const getEntityName = (entity) => {
    return entity.name || entity.title || 'Untitled';
  };

  const renderEntityCard = (entity) => {
    const isSelected = selectedEntity?.id === entity.id;
    
    return (
      <div
        key={entity.id}
        onClick={() => handleEntityClick(entity)}
        className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {getEntityName(entity)}
            </h3>
            
            {entity.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                {entity.type}
              </span>
            )}
            
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {getEntityDescription(entity)}
            </p>
            
            {entity.tags && entity.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {entity.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {entity.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{entity.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* Auto-detection badge */}
            {entity.source && entity.source !== 'manual' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Auto-detected
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-1 ml-3">
            <button
              onClick={(e) => handleEditEntity(entity, e)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title={`Edit ${displayName.toLowerCase()}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={(e) => handleDeleteEntity(entity, e)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title={`Delete ${displayName.toLowerCase()}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (entities.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage {displayName.toLowerCase()} in your story
              </p>
            </div>
            <button
              onClick={() => openCreateModal(entityType)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add {displayName.slice(0, -1)}
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {displayName} Yet</h3>
            <p className="text-gray-600 mb-6">Start building your story by adding your first {displayName.toLowerCase()}</p>
            <button
              onClick={() => openCreateModal(entityType)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add {displayName.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {entities.length} {entities.length === 1 ? displayName.slice(0, -1).toLowerCase() : displayName.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => openCreateModal(entityType)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {displayName.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEntities.map(renderEntityCard)}
        </div>
      </div>
    </div>
  );
};

export default GenericEntityList; 