import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { 
  createCharacter, 
  createLocation, 
  createObject, 
  createOrganization,
  createEvent,
  createMagicSystem,
  createTimeline,
  createTheme,
  createConflict,
  createLore,
  createScene,
  createProjectOverview,
  createBrainstormEntry,
  createRelationship,
  validateCharacter,
  validateLocation,
  validateObject,
  validateOrganization,
  validateEvent,
  validateMagicSystem,
  validateTimeline,
  validateTheme,
  validateConflict,
  validateLore,
  validateScene,
  validateRelationship,
  updateEntity,
  searchEntities,
  ENTITY_TYPES 
} from '../data/schemas.js';
import { storageService, StorageService } from '../services/storage.js';

// Enhanced Bible Store with professional features
const useBibleStore = create(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Core entities
        characters: [],
        locations: [],
        objects: [],
        
        // New professional entities
        organizations: [],
        events: [],
        magicSystems: [],
        timelines: [],
        themes: [],
        conflicts: [],
        lore: [],
        scenes: [],
        relationships: [],
        
        // Project data
        projectOverview: null,
        brainstormEntries: [],
        
        // UI state
        searchQuery: '',
        searchFilters: {
          type: '',
          tags: [],
          dateRange: null,
          source: '',
          confidence: 0
        },
        
        // Bible UI state
        activeBibleSection: 'characters',
        selectedEntity: null,
        showCreateModal: false,
        createModalEntityType: null,
        
        // Selection state
        selectedEntities: [],
        bulkMode: false,
        
        // Entity operations
        
        // Characters
        addCharacter: (character) => {
          const validationErrors = validateCharacter(character);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newCharacter = character.id ? character : createCharacter(character);
            const newCharacters = [...state.characters, newCharacter];
            storageService.saveCharacters(newCharacters);
            return { characters: newCharacters };
          });
        },
        
        updateCharacter: (id, updates) => {
          set((state) => {
            const updatedCharacters = state.characters.map(char => 
              char.id === id ? updateEntity(char, updates) : char
            );
            storageService.saveCharacters(updatedCharacters);
            return { characters: updatedCharacters };
          });
        },
        
        deleteCharacter: (id) => {
          set((state) => {
            const filteredCharacters = state.characters.filter(char => char.id !== id);
            storageService.saveCharacters(filteredCharacters);
            return { characters: filteredCharacters };
          });
        },
        
        // Locations
        addLocation: (location) => {
          const validationErrors = validateLocation(location);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newLocation = location.id ? location : createLocation(location);
            const newLocations = [...state.locations, newLocation];
            storageService.saveLocations(newLocations);
            return { locations: newLocations };
          });
        },
        
        updateLocation: (id, updates) => {
          set((state) => {
            const updatedLocations = state.locations.map(loc => 
              loc.id === id ? updateEntity(loc, updates) : loc
            );
            storageService.saveLocations(updatedLocations);
            return { locations: updatedLocations };
          });
        },
        
        deleteLocation: (id) => {
          set((state) => {
            const filteredLocations = state.locations.filter(loc => loc.id !== id);
            storageService.saveLocations(filteredLocations);
            return { locations: filteredLocations };
          });
        },
        
        // Objects
        addObject: (object) => {
          const validationErrors = validateObject(object);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newObject = object.id ? object : createObject(object);
            const newObjects = [...state.objects, newObject];
            storageService.saveObjects(newObjects);
            return { objects: newObjects };
          });
        },
        
        updateObject: (id, updates) => {
          set((state) => {
            const updatedObjects = state.objects.map(obj => 
              obj.id === id ? updateEntity(obj, updates) : obj
            );
            storageService.saveObjects(updatedObjects);
            return { objects: updatedObjects };
          });
        },
        
        deleteObject: (id) => {
          set((state) => {
            const filteredObjects = state.objects.filter(obj => obj.id !== id);
            storageService.saveObjects(filteredObjects);
            return { objects: filteredObjects };
          });
        },
        
        // Organizations
        addOrganization: (organization) => {
          const validationErrors = validateOrganization(organization);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newOrganization = organization.id ? organization : createOrganization(organization);
            const newOrganizations = [...state.organizations, newOrganization];
            StorageService.setItem('organizations', newOrganizations);
            return { organizations: newOrganizations };
          });
        },
        
        updateOrganization: (id, updates) => {
          set((state) => {
            const updatedOrganizations = state.organizations.map(org => 
              org.id === id ? updateEntity(org, updates) : org
            );
            StorageService.setItem('organizations', updatedOrganizations);
            return { organizations: updatedOrganizations };
          });
        },
        
        deleteOrganization: (id) => {
          set((state) => {
            const filteredOrganizations = state.organizations.filter(org => org.id !== id);
            StorageService.setItem('organizations', filteredOrganizations);
            return { organizations: filteredOrganizations };
          });
        },
        
        // Events
        addEvent: (event) => {
          const validationErrors = validateEvent(event);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newEvent = event.id ? event : createEvent(event);
            const newEvents = [...state.events, newEvent];
            StorageService.setItem('events', newEvents);
            return { events: newEvents };
          });
        },
        
        updateEvent: (id, updates) => {
          set((state) => {
            const updatedEvents = state.events.map(event => 
              event.id === id ? updateEntity(event, updates) : event
            );
            StorageService.setItem('events', updatedEvents);
            return { events: updatedEvents };
          });
        },
        
        deleteEvent: (id) => {
          set((state) => {
            const filteredEvents = state.events.filter(event => event.id !== id);
            StorageService.setItem('events', filteredEvents);
            return { events: filteredEvents };
          });
        },
        
        // Magic Systems
        addMagicSystem: (magicSystem) => {
          const validationErrors = validateMagicSystem(magicSystem);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newMagicSystem = magicSystem.id ? magicSystem : createMagicSystem(magicSystem);
            const newMagicSystems = [...state.magicSystems, newMagicSystem];
            StorageService.setItem('magicSystems', newMagicSystems);
            return { magicSystems: newMagicSystems };
          });
        },
        
        updateMagicSystem: (id, updates) => {
          set((state) => {
            const updatedMagicSystems = state.magicSystems.map(ms => 
              ms.id === id ? updateEntity(ms, updates) : ms
            );
            StorageService.setItem('magicSystems', updatedMagicSystems);
            return { magicSystems: updatedMagicSystems };
          });
        },
        
        deleteMagicSystem: (id) => {
          set((state) => {
            const filteredMagicSystems = state.magicSystems.filter(ms => ms.id !== id);
            StorageService.setItem('magicSystems', filteredMagicSystems);
            return { magicSystems: filteredMagicSystems };
          });
        },
        
        // Timelines
        addTimeline: (timeline) => {
          const validationErrors = validateTimeline(timeline);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newTimeline = timeline.id ? timeline : createTimeline(timeline);
            const newTimelines = [...state.timelines, newTimeline];
            StorageService.setItem('timelines', newTimelines);
            return { timelines: newTimelines };
          });
        },
        
        updateTimeline: (id, updates) => {
          set((state) => {
            const updatedTimelines = state.timelines.map(tl => 
              tl.id === id ? updateEntity(tl, updates) : tl
            );
            StorageService.setItem('timelines', updatedTimelines);
            return { timelines: updatedTimelines };
          });
        },
        
        deleteTimeline: (id) => {
          set((state) => {
            const filteredTimelines = state.timelines.filter(tl => tl.id !== id);
            StorageService.setItem('timelines', filteredTimelines);
            return { timelines: filteredTimelines };
          });
        },
        
        // Themes
        addTheme: (theme) => {
          const validationErrors = validateTheme(theme);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newTheme = theme.id ? theme : createTheme(theme);
            const newThemes = [...state.themes, newTheme];
            StorageService.setItem('themes', newThemes);
            return { themes: newThemes };
          });
        },
        
        updateTheme: (id, updates) => {
          set((state) => {
            const updatedThemes = state.themes.map(theme => 
              theme.id === id ? updateEntity(theme, updates) : theme
            );
            StorageService.setItem('themes', updatedThemes);
            return { themes: updatedThemes };
          });
        },
        
        deleteTheme: (id) => {
          set((state) => {
            const filteredThemes = state.themes.filter(theme => theme.id !== id);
            StorageService.setItem('themes', filteredThemes);
            return { themes: filteredThemes };
          });
        },
        
        // Conflicts
        addConflict: (conflict) => {
          const validationErrors = validateConflict(conflict);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newConflict = conflict.id ? conflict : createConflict(conflict);
            const newConflicts = [...state.conflicts, newConflict];
            StorageService.setItem('conflicts', newConflicts);
            return { conflicts: newConflicts };
          });
        },
        
        updateConflict: (id, updates) => {
          set((state) => {
            const updatedConflicts = state.conflicts.map(conflict => 
              conflict.id === id ? updateEntity(conflict, updates) : conflict
            );
            StorageService.setItem('conflicts', updatedConflicts);
            return { conflicts: updatedConflicts };
          });
        },
        
        deleteConflict: (id) => {
          set((state) => {
            const filteredConflicts = state.conflicts.filter(conflict => conflict.id !== id);
            StorageService.setItem('conflicts', filteredConflicts);
            return { conflicts: filteredConflicts };
          });
        },
        
        // Lore
        addLore: (loreItem) => {
          const validationErrors = validateLore(loreItem);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newLore = loreItem.id ? loreItem : createLore(loreItem);
            const newLoreItems = [...state.lore, newLore];
            StorageService.setItem('lore', newLoreItems);
            return { lore: newLoreItems };
          });
        },
        
        updateLore: (id, updates) => {
          set((state) => {
            const updatedLore = state.lore.map(loreItem => 
              loreItem.id === id ? updateEntity(loreItem, updates) : loreItem
            );
            StorageService.setItem('lore', updatedLore);
            return { lore: updatedLore };
          });
        },
        
        deleteLore: (id) => {
          set((state) => {
            const filteredLore = state.lore.filter(loreItem => loreItem.id !== id);
            StorageService.setItem('lore', filteredLore);
            return { lore: filteredLore };
          });
        },
        
        // Scenes
        addScene: (scene) => {
          const validationErrors = validateScene(scene);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newScene = scene.id ? scene : createScene(scene);
            const newScenes = [...state.scenes, newScene];
            StorageService.setItem('scenes', newScenes);
            return { scenes: newScenes };
          });
        },
        
        updateScene: (id, updates) => {
          set((state) => {
            const updatedScenes = state.scenes.map(scene => 
              scene.id === id ? updateEntity(scene, updates) : scene
            );
            StorageService.setItem('scenes', updatedScenes);
            return { scenes: updatedScenes };
          });
        },
        
        deleteScene: (id) => {
          set((state) => {
            const filteredScenes = state.scenes.filter(scene => scene.id !== id);
            StorageService.setItem('scenes', filteredScenes);
            return { scenes: filteredScenes };
          });
        },
        
        // Relationships
        addRelationship: (relationship) => {
          const validationErrors = validateRelationship(relationship);
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
          
          set((state) => {
            const newRelationship = relationship.id ? relationship : createRelationship(
              relationship.fromEntityId, 
              relationship.toEntityId, 
              relationship
            );
            const newRelationships = [...state.relationships, newRelationship];
            StorageService.setItem('relationships', newRelationships);
            return { relationships: newRelationships };
          });
        },
        
        updateRelationship: (id, updates) => {
          set((state) => {
            const updatedRelationships = state.relationships.map(rel => 
              rel.id === id ? updateEntity(rel, updates) : rel
            );
            StorageService.setItem('relationships', updatedRelationships);
            return { relationships: updatedRelationships };
          });
        },
        
        deleteRelationship: (id) => {
          set((state) => {
            const filteredRelationships = state.relationships.filter(rel => rel.id !== id);
            StorageService.setItem('relationships', filteredRelationships);
            return { relationships: filteredRelationships };
          });
        },
        
        // Project Overview
        setProjectOverview: (overview) => {
          set(() => {
            const newOverview = overview.id ? overview : createProjectOverview(overview);
            StorageService.setItem('projectOverview', newOverview);
            return { projectOverview: newOverview };
          });
        },
        
        updateProjectOverview: (updates) => {
          set((state) => {
            const updatedOverview = state.projectOverview 
              ? updateEntity(state.projectOverview, updates)
              : createProjectOverview(updates);
            StorageService.setItem('projectOverview', updatedOverview);
            return { projectOverview: updatedOverview };
          });
        },
        
        // Brainstorm Entries
        addBrainstormEntry: (entry) => {
          set((state) => {
            const newEntry = entry.id ? entry : createBrainstormEntry(entry);
            const newEntries = [...state.brainstormEntries, newEntry];
            StorageService.setItem('brainstormEntries', newEntries);
            return { brainstormEntries: newEntries };
          });
        },
        
        updateBrainstormEntry: (id, updates) => {
          set((state) => {
            const updatedEntries = state.brainstormEntries.map(entry => 
              entry.id === id ? updateEntity(entry, updates) : entry
            );
            StorageService.setItem('brainstormEntries', updatedEntries);
            return { brainstormEntries: updatedEntries };
          });
        },
        
        deleteBrainstormEntry: (id) => {
          set((state) => {
            const filteredEntries = state.brainstormEntries.filter(entry => entry.id !== id);
            StorageService.setItem('brainstormEntries', filteredEntries);
            return { brainstormEntries: filteredEntries };
          });
        },
        
        // Enhanced search and filtering
        setSearchQuery: (query) => {
          set({ searchQuery: query });
        },
        
        setSearchFilters: (filters) => {
          set((state) => ({
            searchFilters: { ...state.searchFilters, ...filters }
          }));
        },
        
        clearSearchFilters: () => {
          set({
            searchQuery: '',
            searchFilters: {
              type: '',
              tags: [],
              dateRange: null,
              source: '',
              confidence: 0
            }
          });
        },
        
        // Get all entities combined
        getAllEntities: () => {
          const state = get();
          return [
            ...state.characters.map(e => ({ ...e, entityType: 'character' })),
            ...state.locations.map(e => ({ ...e, entityType: 'location' })),
            ...state.objects.map(e => ({ ...e, entityType: 'object' })),
            ...state.organizations.map(e => ({ ...e, entityType: 'organization' })),
            ...state.events.map(e => ({ ...e, entityType: 'event' })),
            ...state.magicSystems.map(e => ({ ...e, entityType: 'magicSystem' })),
            ...state.timelines.map(e => ({ ...e, entityType: 'timeline' })),
            ...state.themes.map(e => ({ ...e, entityType: 'theme' })),
            ...state.conflicts.map(e => ({ ...e, entityType: 'conflict' })),
            ...state.lore.map(e => ({ ...e, entityType: 'lore' })),
            ...state.scenes.map(e => ({ ...e, entityType: 'scene' }))
          ];
        },
        
        // Enhanced search with filters
        searchAllEntities: () => {
          const state = get();
          const allEntities = state.getAllEntities();
          return searchEntities(allEntities, state.searchQuery, state.searchFilters);
        },
        
        // UI state management
        setActiveBibleSection: (section) => {
          set({ activeBibleSection: section });
        },
        
        setSelectedEntity: (entity) => {
          set({ selectedEntity: entity });
        },
        
        openCreateModal: (entityType) => {
          set({ 
            showCreateModal: true, 
            createModalEntityType: entityType 
          });
        },
        
        closeCreateModal: () => {
          set({ 
            showCreateModal: false, 
            createModalEntityType: null 
          });
        },
        
        // Bulk operations
        toggleBulkMode: () => {
          set((state) => ({
            bulkMode: !state.bulkMode,
            selectedEntities: state.bulkMode ? [] : state.selectedEntities
          }));
        },
        
        selectEntity: (entityId) => {
          set((state) => {
            const isSelected = state.selectedEntities.includes(entityId);
            return {
              selectedEntities: isSelected 
                ? state.selectedEntities.filter(id => id !== entityId)
                : [...state.selectedEntities, entityId]
            };
          });
        },
        
        selectAllEntities: () => {
          const state = get();
          const allIds = state.getAllEntities().map(e => e.id);
          set({ selectedEntities: allIds });
        },
        
        clearSelection: () => {
          set({ selectedEntities: [] });
        },
        
        // Delete selected entities
        deleteSelectedEntities: () => {
          const state = get();
          const { selectedEntities } = state;
          
          selectedEntities.forEach(entityId => {
            // Find entity type and delete accordingly
            const allEntities = state.getAllEntities();
            const entity = allEntities.find(e => e.id === entityId);
            
            if (entity) {
              switch (entity.entityType) {
                case 'character':
                  state.deleteCharacter(entityId);
                  break;
                case 'location':
                  state.deleteLocation(entityId);
                  break;
                case 'object':
                  state.deleteObject(entityId);
                  break;
                case 'organization':
                  state.deleteOrganization(entityId);
                  break;
                case 'event':
                  state.deleteEvent(entityId);
                  break;
                case 'magicSystem':
                  state.deleteMagicSystem(entityId);
                  break;
                case 'timeline':
                  state.deleteTimeline(entityId);
                  break;
                case 'theme':
                  state.deleteTheme(entityId);
                  break;
                case 'conflict':
                  state.deleteConflict(entityId);
                  break;
                case 'lore':
                  state.deleteLore(entityId);
                  break;
                case 'scene':
                  state.deleteScene(entityId);
                  break;
                default:
                  break;
              }
            }
          });
          
          set({ selectedEntities: [] });
        },
        
        // Relationship helpers
        createRelationship: (fromEntityId, toEntityId, relationshipType, description = '') => {
          const state = get();
          const newRelationship = createRelationship(fromEntityId, toEntityId, {
            relationshipType,
            description
          });
          state.addRelationship(newRelationship);
          return newRelationship;
        },
        
        getEntityRelationships: (entityId) => {
          const state = get();
          return state.relationships.filter(rel => 
            rel.fromEntityId === entityId || rel.toEntityId === entityId
          );
        },
        
        // Statistics
        getEntityCounts: () => {
          const state = get();
          return {
            characters: state.characters.length,
            locations: state.locations.length,
            objects: state.objects.length,
            organizations: state.organizations.length,
            events: state.events.length,
            magicSystems: state.magicSystems.length,
            timelines: state.timelines.length,
            themes: state.themes.length,
            conflicts: state.conflicts.length,
            lore: state.lore.length,
            scenes: state.scenes.length,
            relationships: state.relationships.length,
            total: state.getAllEntities().length
          };
        },
        
        // Load data from storage
        loadData: () => {
          set({
            characters: storageService.loadCharacters(),
            locations: storageService.loadLocations(),
            objects: storageService.loadObjects(),
            organizations: StorageService.getItem('organizations', []),
            events: StorageService.getItem('events', []),
            magicSystems: StorageService.getItem('magicSystems', []),
            timelines: StorageService.getItem('timelines', []),
            themes: StorageService.getItem('themes', []),
            conflicts: StorageService.getItem('conflicts', []),
            lore: storageService.loadLore(),
            scenes: storageService.loadScenes(),
            relationships: StorageService.getItem('relationships', []),
            projectOverview: storageService.loadProject(),
            brainstormEntries: storageService.loadBrainstorms()
          });
        },
        
        // Clear all data
        clearAllData: () => {
          set({
            characters: [],
            locations: [],
            objects: [],
            organizations: [],
            events: [],
            magicSystems: [],
            timelines: [],
            themes: [],
            conflicts: [],
            lore: [],
            scenes: [],
            relationships: [],
            projectOverview: null,
            brainstormEntries: [],
            searchQuery: '',
            searchFilters: {
              type: '',
              tags: [],
              dateRange: null,
              source: '',
              confidence: 0
            },
            selectedEntities: [],
            bulkMode: false
          });
          
          // Clear storage
          storageService.clearAll();
        }
      })
    ),
    {
      name: 'bible-store',
      partialize: (state) => ({
        characters: state.characters,
        locations: state.locations,
        objects: state.objects,
        organizations: state.organizations,
        events: state.events,
        magicSystems: state.magicSystems,
        timelines: state.timelines,
        themes: state.themes,
        conflicts: state.conflicts,
        lore: state.lore,
        scenes: state.scenes,
        relationships: state.relationships,
        projectOverview: state.projectOverview,
        brainstormEntries: state.brainstormEntries
      })
    }
  )
);

export default useBibleStore; 