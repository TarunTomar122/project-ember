import { useState } from 'react';
import useBibleStore from '../../stores/bibleStore';
import Modal from './Modal';
import { ENTITY_TYPES } from '../../data/schemas';

const ModalManager = () => {
  const { 
    showCreateModal,
    createModalType,
    closeCreateModal,
    showDeleteModal,
    deleteTarget,
    closeDeleteModal,
    addCharacter,
    addLocation,
    deleteCharacter,
    deleteLocation
  } = useBibleStore();

  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    
    switch (createModalType) {
      case ENTITY_TYPES.CHARACTER:
        addCharacter(formData);
        break;
      case ENTITY_TYPES.LOCATION:
        addLocation(formData);
        break;
      default:
        console.error('Unknown create type:', createModalType);
        return;
    }
    
    setFormData({});
    closeCreateModal();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    
    switch (deleteTarget.type) {
      case 'character':
        deleteCharacter(deleteTarget.entity.id);
        break;
      case 'location':
        deleteLocation(deleteTarget.entity.id);
        break;
      default:
        console.error('Unknown delete type:', deleteTarget.type);
        return;
    }
    
    closeDeleteModal();
  };

  const renderCreateForm = () => {
    switch (createModalType) {
      case ENTITY_TYPES.CHARACTER:
        return (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter character name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pronouns
              </label>
              <input
                type="text"
                value={formData.pronouns || ''}
                onChange={(e) => handleInputChange('pronouns', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="he/him, she/her, they/them, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="text"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25, young adult, elderly, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality
              </label>
              <textarea
                value={formData.personality || ''}
                onChange={(e) => handleInputChange('personality', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe their personality traits..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <textarea
                value={formData.background || ''}
                onChange={(e) => handleInputChange('background', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe their history and background..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Character
              </button>
            </div>
          </form>
        );
        
      case ENTITY_TYPES.LOCATION:
        return (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a type</option>
                <option value="city">City</option>
                <option value="building">Building</option>
                <option value="room">Room</option>
                <option value="landmark">Landmark</option>
                <option value="region">Region</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the location..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atmosphere
              </label>
              <textarea
                value={formData.atmosphere || ''}
                onChange={(e) => handleInputChange('atmosphere', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the mood and atmosphere..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Location
              </button>
            </div>
          </form>
        );
        
      default:
        return <div>Unknown entity type</div>;
    }
  };

  return (
    <>
      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        title={`Create New ${createModalType === ENTITY_TYPES.CHARACTER ? 'Character' : 'Location'}`}
        size="md"
      >
        {renderCreateForm()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">
                Delete {deleteTarget?.type}?
              </h4>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{deleteTarget?.entity?.name || deleteTarget?.entity?.title}"? 
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalManager; 