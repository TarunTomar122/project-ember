import { useState, useMemo } from 'react';
import useBibleStore from '../../../stores/bibleStore';

const ObjectsList = () => {
  const { 
    objects, 
    selectedEntity, 
    setSelectedEntity, 
    openCreateModal, 
    deleteObject 
  } = useBibleStore();

  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name'); // name, type, createdAt
  const [filterType, setFilterType] = useState('all');

  // Get unique object types for filtering
  const objectTypes = useMemo(() => {
    const types = [...new Set(objects.map(obj => obj.type).filter(Boolean))];
    return types.sort();
  }, [objects]);

  // Filter and sort objects
  const filteredAndSortedObjects = useMemo(() => {
    let filtered = objects;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(obj => obj.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [objects, filterType, sortBy]);

  const handleObjectClick = (object) => {
    setSelectedEntity(selectedEntity?.id === object.id ? null : object);
  };

  const handleEditObject = (object, e) => {
    e.stopPropagation();
    // TODO: Open edit modal or navigate to edit form
    console.log('Edit object:', object);
  };

  const handleDeleteObject = (object, e) => {
    e.stopPropagation();
    deleteObject(object.id);
  };

  const renderObjectCard = (object) => {
    const isSelected = selectedEntity?.id === object.id;
    
    return (
      <div
        key={object.id}
        onClick={() => handleObjectClick(object)}
        className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {object.name}
            </h3>
            {object.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                {object.type}
              </span>
            )}
            {object.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {object.description}
              </p>
            )}
            {object.significance && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">Significance:</span>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {object.significance}
                </p>
              </div>
            )}
            {object.owner && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">Owner:</span>
                <span className="text-sm text-gray-600 ml-1">{object.owner}</span>
              </div>
            )}
            {object.tags && object.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {object.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {object.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{object.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            {/* Auto-detection badge */}
            {object.source && object.source !== 'manual' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Auto-detected
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1 ml-3">
            <button
              onClick={(e) => handleEditObject(object, e)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit object"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={(e) => handleDeleteObject(object, e)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete object"
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

  const renderObjectRow = (object) => {
    const isSelected = selectedEntity?.id === object.id;
    
    return (
      <tr
        key={object.id}
        onClick={() => handleObjectClick(object)}
        className={`cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {object.name}
          </div>
          {object.source && object.source !== 'manual' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              Auto-detected
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {object.type || 'Unspecified'}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {object.description || 'No description'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-600">
            {object.owner || '-'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {object.tags && object.tags.length > 0 ? (
              object.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">No tags</span>
            )}
            {object.tags && object.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{object.tags.length - 2}</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => handleEditObject(object, e)}
              className="text-gray-400 hover:text-blue-600"
              title="Edit object"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={(e) => handleDeleteObject(object, e)}
              className="text-gray-400 hover:text-red-600"
              title="Delete object"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Objects & Items</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage important objects, artifacts, and items in your story
            </p>
          </div>
          <button
            onClick={() => openCreateModal('object')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Object
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {objectTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>

            {/* Count */}
            <div className="text-sm text-gray-600">
              {filteredAndSortedObjects.length} of {objects.length} objects
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedObjects.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No objects found</h3>
              <p className="mt-2 text-gray-600">
                {objects.length === 0 
                  ? "Get started by creating your first object."
                  : "No objects match your current filters."
                }
              </p>
              <button
                onClick={() => openCreateModal('object')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Object
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedObjects.map(renderObjectCard)}
            </div>
          </div>
        ) : (
          <div className="bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedObjects.map(renderObjectRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectsList; 