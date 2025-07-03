// Storage service for Story Bible data persistence
import { ENTITY_TYPES } from '../data/schemas';

// Storage keys
const STORAGE_KEYS = {
  CHARACTERS: 'storyBible_characters',
  LOCATIONS: 'storyBible_locations',
  OBJECTS: 'storyBible_objects',
  LORE: 'storyBible_lore',
  SCENES: 'storyBible_scenes',
  PROJECT: 'storyBible_project',
  BRAINSTORMS: 'storyBible_brainstorms',
  METADATA: 'storyBible_metadata'
};

// Generic storage operations
const loadFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
};

// Enhanced storage service for professional-level Bible
const StorageService = {
  // Generic operations
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading from storage (${key}):`, error);
      return defaultValue;
    }
  },

  setItem: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving to storage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Entity-specific storage operations
export const storageService = {
  // Characters
  loadCharacters: () => loadFromStorage(STORAGE_KEYS.CHARACTERS, []),
  saveCharacters: (characters) => saveToStorage(STORAGE_KEYS.CHARACTERS, characters),
  
  // Locations
  loadLocations: () => loadFromStorage(STORAGE_KEYS.LOCATIONS, []),
  saveLocations: (locations) => saveToStorage(STORAGE_KEYS.LOCATIONS, locations),
  
  // Objects
  loadObjects: () => loadFromStorage(STORAGE_KEYS.OBJECTS, []),
  saveObjects: (objects) => saveToStorage(STORAGE_KEYS.OBJECTS, objects),
  
  // Lore
  loadLore: () => loadFromStorage(STORAGE_KEYS.LORE, []),
  saveLore: (lore) => saveToStorage(STORAGE_KEYS.LORE, lore),
  
  // Scenes
  loadScenes: () => loadFromStorage(STORAGE_KEYS.SCENES, []),
  saveScenes: (scenes) => saveToStorage(STORAGE_KEYS.SCENES, scenes),
  
  // Project
  loadProject: () => loadFromStorage(STORAGE_KEYS.PROJECT, null),
  saveProject: (project) => saveToStorage(STORAGE_KEYS.PROJECT, project),
  
  // Brainstorms
  loadBrainstorms: () => loadFromStorage(STORAGE_KEYS.BRAINSTORMS, []),
  saveBrainstorms: (brainstorms) => saveToStorage(STORAGE_KEYS.BRAINSTORMS, brainstorms),
  
  // Metadata
  loadMetadata: () => loadFromStorage(STORAGE_KEYS.METADATA, {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    backupCount: 0
  }),
  saveMetadata: (metadata) => saveToStorage(STORAGE_KEYS.METADATA, metadata),
  
  // Generic entity operations
  loadEntity: (type) => {
    switch (type) {
      case ENTITY_TYPES.CHARACTER:
        return storageService.loadCharacters();
      case ENTITY_TYPES.LOCATION:
        return storageService.loadLocations();
      case ENTITY_TYPES.OBJECT:
        return storageService.loadObjects();
      case ENTITY_TYPES.LORE:
        return storageService.loadLore();
      case ENTITY_TYPES.SCENE:
        return storageService.loadScenes();
      case ENTITY_TYPES.PROJECT:
        return storageService.loadProject();
      case ENTITY_TYPES.BRAINSTORM:
        return storageService.loadBrainstorms();
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
  },
  
  saveEntity: (type, data) => {
    switch (type) {
      case ENTITY_TYPES.CHARACTER:
        return storageService.saveCharacters(data);
      case ENTITY_TYPES.LOCATION:
        return storageService.saveLocations(data);
      case ENTITY_TYPES.OBJECT:
        return storageService.saveObjects(data);
      case ENTITY_TYPES.LORE:
        return storageService.saveLore(data);
      case ENTITY_TYPES.SCENE:
        return storageService.saveScenes(data);
      case ENTITY_TYPES.PROJECT:
        return storageService.saveProject(data);
      case ENTITY_TYPES.BRAINSTORM:
        return storageService.saveBrainstorms(data);
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
  },
  
  // Backup operations
  exportData: () => {
    const exportData = {
      characters: storageService.loadCharacters(),
      locations: storageService.loadLocations(),
      objects: storageService.loadObjects(),
      lore: storageService.loadLore(),
      scenes: storageService.loadScenes(),
      project: storageService.loadProject(),
      brainstorms: storageService.loadBrainstorms(),
      metadata: storageService.loadMetadata(),
      exportedAt: new Date().toISOString()
    };
    return exportData;
  },
  
  importData: (importData) => {
    try {
      if (importData.characters) storageService.saveCharacters(importData.characters);
      if (importData.locations) storageService.saveLocations(importData.locations);
      if (importData.objects) storageService.saveObjects(importData.objects);
      if (importData.lore) storageService.saveLore(importData.lore);
      if (importData.scenes) storageService.saveScenes(importData.scenes);
      if (importData.project) storageService.saveProject(importData.project);
      if (importData.brainstorms) storageService.saveBrainstorms(importData.brainstorms);
      
      // Update metadata
      const metadata = storageService.loadMetadata();
      storageService.saveMetadata({
        ...metadata,
        lastUpdated: new Date().toISOString(),
        lastImport: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
  
  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
  
  // Get storage stats
  getStorageStats: () => {
    const stats = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      stats[name] = {
        size: item ? item.length : 0,
        exists: !!item
      };
    });
    return stats;
  },
  
  // Search operations
  searchAll: (query) => {
    const results = [];
    const lowercaseQuery = query.toLowerCase();
    
    // Search characters
    const characters = storageService.loadCharacters();
    characters.forEach(char => {
      if (char.name.toLowerCase().includes(lowercaseQuery) ||
          char.personality.toLowerCase().includes(lowercaseQuery) ||
          char.background.toLowerCase().includes(lowercaseQuery)) {
        results.push({ type: ENTITY_TYPES.CHARACTER, entity: char });
      }
    });
    
    // Search locations
    const locations = storageService.loadLocations();
    locations.forEach(loc => {
      if (loc.name.toLowerCase().includes(lowercaseQuery) ||
          loc.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({ type: ENTITY_TYPES.LOCATION, entity: loc });
      }
    });
    
    // Search objects
    const objects = storageService.loadObjects();
    objects.forEach(obj => {
      if (obj.name.toLowerCase().includes(lowercaseQuery) ||
          obj.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({ type: ENTITY_TYPES.OBJECT, entity: obj });
      }
    });
    
    // Search lore
    const lore = storageService.loadLore();
    lore.forEach(loreItem => {
      if (loreItem.title.toLowerCase().includes(lowercaseQuery) ||
          loreItem.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({ type: ENTITY_TYPES.LORE, entity: loreItem });
      }
    });
    
    return results;
  }
};

// Auto-backup functionality
export const autoBackup = {
  isEnabled: () => {
    return localStorage.getItem('autoBackup_enabled') === 'true';
  },
  
  setEnabled: (enabled) => {
    localStorage.setItem('autoBackup_enabled', enabled.toString());
  },
  
  createBackup: () => {
    const backupData = storageService.exportData();
    const backupKey = `backup_${Date.now()}`;
    saveToStorage(backupKey, backupData);
    
    // Update metadata
    const metadata = storageService.loadMetadata();
    storageService.saveMetadata({
      ...metadata,
      lastBackup: new Date().toISOString(),
      backupCount: metadata.backupCount + 1
    });
    
    return backupKey;
  },
  
  listBackups: () => {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('backup_')) {
        const timestamp = key.replace('backup_', '');
        backups.push({
          key,
          timestamp: parseInt(timestamp),
          date: new Date(parseInt(timestamp)).toISOString()
        });
      }
    }
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  },
  
  restoreBackup: (backupKey) => {
    const backupData = loadFromStorage(backupKey);
    if (backupData) {
      return storageService.importData(backupData);
    }
    return false;
  },
  
  deleteBackup: (backupKey) => {
    localStorage.removeItem(backupKey);
  }
};

// Initialize storage on first load
export const initializeStorage = () => {
  const metadata = storageService.loadMetadata();
  if (!metadata.initialized) {
    storageService.saveMetadata({
      ...metadata,
      initialized: true,
      initializedAt: new Date().toISOString()
    });
  }
};

// Export both for compatibility
export { StorageService }; 