// Enhanced Data schemas for Professional Story Bible
import { v4 as uuidv4 } from 'uuid';

// Character schema - Professional level
export const createCharacter = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  otherNames: [], // aliases, nicknames, titles
  pronouns: 'they/them',
  age: '',
  occupation: '',
  role: 'supporting', // protagonist, antagonist, supporting, minor
  
  // Physical Appearance
  physical: {
    height: '',
    build: '',
    hairColor: '',
    eyeColor: '',
    skinTone: '',
    distinguishingFeatures: [],
    clothingStyle: '',
    appearance: '' // general description
  },
  
  // Psychology & Personality
  psychology: {
    personality: '',
    motivations: [],
    fears: [],
    desires: [],
    goals: [],
    flaws: [],
    strengths: [],
    secrets: [],
    coreBeliefs: [],
    worldview: ''
  },
  
  // Voice & Dialogue
  voice: {
    speechPatterns: [],
    vocabulary: '', // formal, casual, technical, etc.
    catchPhrases: [],
    accent: '',
    dialogueStyle: '',
    voiceNotes: ''
  },
  
  // Background & History
  background: {
    backstory: '',
    family: [],
    education: '',
    significantEvents: [],
    upbringing: '',
    formativeExperiences: []
  },
  
  // Relationships
  relationships: [],
  
  // Story Development
  story: {
    characterArc: '',
    growthPoints: [],
    keyMoments: [],
    scenePresence: [], // scene IDs where character appears
    plotSignificance: '',
    firstAppearance: '',
    characterFunction: '' // how they serve the plot
  },
  
  // Organization & Meta
  groups: [], // factions, organizations they belong to
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [], // from text analysis
  source: 'manual', // manual, llm_analysis, pattern_analysis
  confidence: 1.0,
  
  // Media & References
  media: {
    images: [],
    voiceReference: '',
    inspirationNotes: '',
    faceClaim: ''
  },
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Location schema - Professional level
export const createLocation = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'other', // city, building, room, landmark, region, fantasy, other
  significance: '',
  
  // Physical Description
  physical: {
    description: '',
    size: '',
    layout: '',
    architecture: '',
    climate: '',
    geography: '',
    inhabitants: '',
    population: ''
  },
  
  // Sensory Details
  sensory: {
    atmosphere: '',
    sounds: [],
    smells: [],
    lighting: '',
    temperature: '',
    textures: [],
    overallMood: ''
  },
  
  // History & Background
  history: {
    founded: '',
    significantEvents: [],
    previousNames: [],
    culturalImportance: '',
    legends: []
  },
  
  // Story Integration
  story: {
    scenesHere: [], // scene IDs
    plotSignificance: '',
    firstAppearance: '',
    storyRole: '',
    symbolism: '',
    stateChanges: [] // how location changes over time
  },
  
  // Connections
  connections: {
    parentLocation: '', // ID of containing location
    childLocations: [], // IDs of contained locations
    connectedLocations: [], // IDs of related locations
    travelTimes: {} // locationId: timeToTravel
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Media & References
  media: {
    maps: [],
    images: [],
    floorPlans: [],
    inspirationNotes: ''
  },
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Object/Item schema - Professional level
export const createObject = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'other', // weapon, artifact, document, tool, vehicle, jewelry, book, other
  owner: '', // character ID
  location: '', // location ID
  
  // Physical Properties
  physical: {
    description: '',
    size: '',
    weight: '',
    material: '',
    condition: '',
    appearance: '',
    uniqueFeatures: []
  },
  
  // Function & Use
  function: {
    purpose: '',
    howUsed: '',
    abilities: [],
    limitations: [],
    specialProperties: []
  },
  
  // History & Provenance
  history: {
    origin: '',
    creator: '',
    previousOwners: [],
    significantEvents: [],
    ageEstimate: '',
    culturalContext: ''
  },
  
  // Story Integration
  story: {
    plotImportance: '',
    symbolism: '',
    keyScenes: [], // scene IDs where object is important
    stateChanges: [], // how object changes throughout story
    firstAppearance: ''
  },
  
  // Value & Properties
  value: {
    monetary: '',
    sentimental: '',
    magical: '',
    rarity: '',
    significance: ''
  },
  
  // Relationships
  relationships: {
    relatedCharacters: [], // IDs and relationship types
    relatedLocations: [], // IDs and connection types
    relatedObjects: [] // IDs and relationship types
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Media & References
  media: {
    images: [],
    sketches: [],
    inspirationNotes: ''
  },
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Organization schema - NEW
export const createOrganization = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'other', // government, guild, company, faction, military, religious, criminal, other
  status: 'active', // active, defunct, hidden, emerging
  
  // Structure & Hierarchy
  structure: {
    leadershipType: '', // monarchy, democracy, dictatorship, council, etc.
    hierarchy: [],
    size: '',
    members: [], // character IDs
    leaders: [], // character IDs
    departments: []
  },
  
  // Purpose & Operations
  purpose: {
    goals: [],
    methods: [],
    resources: [],
    territories: [], // location IDs
    activities: [],
    influence: ''
  },
  
  // Culture & Identity
  culture: {
    values: [],
    traditions: [],
    symbols: [],
    colors: [],
    mottos: [],
    ceremonies: []
  },
  
  // History
  history: {
    founded: '',
    founders: [],
    significantEvents: [],
    conflicts: [],
    alliances: [],
    achievements: []
  },
  
  // Relationships
  relationships: {
    allies: [], // organization IDs
    enemies: [], // organization IDs
    neutral: [], // organization IDs
    parentOrganization: '',
    childOrganizations: []
  },
  
  // Story Integration
  story: {
    plotRole: '',
    conflictsWith: [],
    keyScenes: [],
    storyArc: ''
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Event schema - NEW
export const createEvent = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'other', // battle, ceremony, discovery, betrayal, meeting, death, birth, other
  date: '',
  duration: '',
  
  // Context
  context: {
    location: '', // location ID
    participants: [], // character IDs
    witnesses: [], // character IDs
    organizations: [], // organization IDs
    description: ''
  },
  
  // Cause & Effect
  causality: {
    causes: [],
    triggers: [],
    consequences: [],
    beforeState: '',
    afterState: '',
    significance: ''
  },
  
  // Story Integration
  story: {
    plotImportance: '',
    storyFunction: '',
    relatedScenes: [],
    foreshadowing: [],
    callbacks: []
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Magic System schema - NEW
export const createMagicSystem = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'hard', // hard, soft, hybrid
  magicSource: '',
  
  // Mechanics
  mechanics: {
    howItWorks: '',
    energy: '', // what powers it
    limitations: [],
    costs: [],
    rules: [],
    exceptions: []
  },
  
  // Usage
  usage: {
    whoCanUse: [],
    learningProcess: '',
    skill: '',
    commonUses: [],
    rareUses: [],
    forbiddenUses: []
  },
  
  // World Integration
  world: {
    culturalImpact: '',
    economicImpact: '',
    politicalImpact: '',
    socialAcceptance: '',
    history: '',
    practitioners: [] // character IDs
  },
  
  // Story Integration
  story: {
    plotRole: '',
    conflicts: [],
    advantages: [],
    disadvantages: []
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Timeline schema - NEW
export const createTimeline = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'story', // story, world, character, other
  timeframe: '',
  
  // Events
  events: [
    // {
    //   id: eventId,
    //   date: '',
    //   title: '',
    //   description: '',
    //   characters: [],
    //   locations: [],
    //   significance: ''
    // }
  ],
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Theme schema - NEW
export const createTheme = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  description: '',
  type: 'major', // major, minor, subtheme
  
  // Expression
  expression: {
    symbols: [],
    motifs: [],
    characters: [], // character IDs that embody theme
    locations: [], // location IDs that represent theme
    objects: [], // object IDs that symbolize theme
    events: [], // event IDs that explore theme
    scenes: [] // scene IDs where theme appears
  },
  
  // Development
  development: {
    introduction: '',
    progression: '',
    resolution: '',
    techniques: []
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Conflict schema - NEW
export const createConflict = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  name: '',
  type: 'internal', // internal, external, interpersonal, societal, supernatural
  category: 'character', // character vs character, character vs self, character vs society, etc.
  
  // Participants
  participants: {
    protagonist: '', // character ID
    antagonist: '', // character/organization ID
    allies: [], // character IDs
    affected: [] // character IDs
  },
  
  // Structure
  structure: {
    setup: '',
    escalation: [],
    climax: '',
    resolution: '',
    aftermath: ''
  },
  
  // Stakes
  stakes: {
    whatIsAtRisk: [],
    consequences: [],
    rewards: [],
    personalStakes: [],
    worldStakes: []
  },
  
  // Story Integration
  story: {
    plotFunction: '',
    characterDevelopment: '',
    themeConnection: '',
    relatedScenes: [],
    resolution: ''
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Enhanced Lore/Rule schema
export const createLore = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  title: '',
  type: 'tradition', // magic system, law, tradition, belief, custom, other
  category: '',
  
  // Content
  content: {
    description: '',
    rules: [],
    exceptions: [],
    variations: [],
    origins: '',
    purpose: ''
  },
  
  // World Integration
  world: {
    cultures: [], // which cultures follow this
    regions: [], // location IDs where this applies
    practitioners: [], // character IDs who use/follow this
    influence: '',
    enforcement: ''
  },
  
  // Relationships
  relationships: {
    relatedCharacters: [],
    relatedLocations: [],
    relatedEvents: [],
    conflictsWith: [],
    supportsBy: []
  },
  
  // Story Integration
  story: {
    plotRelevance: '',
    conflicts: [],
    advantages: [],
    complications: []
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Enhanced Scene schema
export const createScene = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  title: '',
  description: '',
  purpose: '',
  
  // Context
  context: {
    location: '', // location ID
    timeOfDay: '',
    weather: '',
    season: '',
    duration: '',
    pov: '' // character ID
  },
  
  // Participants
  participants: {
    characters: [], // character IDs present
    mainCharacters: [], // characters with important roles
    backgroundCharacters: []
  },
  
  // Structure
  structure: {
    objectives: [],
    conflicts: [],
    obstacles: [],
    stakes: [],
    outcome: '',
    mood: '',
    tone: ''
  },
  
  // Story Function
  story: {
    plotFunction: '',
    characterDevelopment: [],
    worldBuilding: [],
    themeExploration: [],
    foreshadowing: [],
    callbacks: []
  },
  
  // Technical
  technical: {
    order: 0,
    chapter: '',
    wordCount: 0,
    pacing: '',
    tension: ''
  },
  
  // Objects & Elements
  elements: {
    importantObjects: [], // object IDs
    events: [], // event IDs
    themes: [], // theme IDs
    conflicts: [] // conflict IDs
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Analysis Data
  mentions: [],
  source: 'manual',
  confidence: 1.0,
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Relationship schema for cross-entity connections
export const createRelationship = (fromEntityId, toEntityId, overrides = {}) => ({
  id: uuidv4(),
  fromEntityId,
  fromEntityType: '',
  toEntityId,
  toEntityType: '',
  relationshipType: '', // family, friend, enemy, romantic, professional, etc.
  description: '',
  strength: 'medium', // weak, medium, strong
  status: 'current', // current, past, developing, complicated
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Enhanced Project Overview schema
export const createProjectOverview = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  title: '',
  subtitle: '',
  genre: '',
  subgenres: [],
  style: '',
  targetAudience: '',
  
  // Content
  content: {
    braindump: '',
    synopsis: '',
    logline: '',
    theme: '',
    premise: '',
    hooks: []
  },
  
  // Structure
  structure: {
    format: '', // novel, novella, short story, series
    plannedLength: '',
    currentWordCount: 0,
    chapterCount: 0,
    actStructure: [],
    plotPoints: []
  },
  
  // Development
  development: {
    status: 'planning', // planning, outlining, drafting, revising, editing, completed
    currentPhase: '',
    completionPercentage: 0,
    deadlines: [],
    milestones: []
  },
  
  // World
  world: {
    setting: '',
    timeperiod: '',
    worldType: '', // realistic, fantasy, sci-fi, historical, etc.
    worldComplexity: '', // simple, moderate, complex
    magicSystem: '', // magic system ID if applicable
    technology: ''
  },
  
  // Characters
  characters: {
    protagonistCount: 1,
    mainCharacters: [], // character IDs
    supportingCharacters: [],
    antagonists: []
  },
  
  // Themes & Conflicts
  themes: [], // theme IDs
  conflicts: [], // conflict IDs
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Media & References
  media: {
    coverArt: '',
    moodBoard: [],
    inspirationNotes: '',
    references: []
  },
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Enhanced Brainstorm Entry schema
export const createBrainstormEntry = (overrides = {}) => ({
  id: uuidv4(),
  
  // Basic Info
  type: 'idea', // idea, question, note, inspiration, problem, solution
  title: '',
  content: '',
  category: '',
  
  // Classification
  classification: {
    priority: 'medium', // low, medium, high, critical
    urgency: 'normal', // low, normal, high
    complexity: 'simple', // simple, moderate, complex
    feasibility: 'possible' // impossible, difficult, possible, easy
  },
  
  // Development
  development: {
    expanded: false,
    implemented: false,
    transferredToBible: false,
    relatedEntries: [],
    childIdeas: [],
    parentIdea: ''
  },
  
  // Connections
  connections: {
    relatedCharacters: [],
    relatedLocations: [],
    relatedObjects: [],
    relatedThemes: [],
    relatedConflicts: []
  },
  
  // Organization & Meta
  tags: [],
  notes: '',
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Validation helpers - Enhanced
export const validateCharacter = (character) => {
  const errors = [];
  if (!character.name.trim()) errors.push('Character name is required');
  if (character.pronouns && !['he/him', 'she/her', 'they/them', 'other'].includes(character.pronouns)) {
    errors.push('Invalid pronouns format');
  }
  return errors;
};

export const validateLocation = (location) => {
  const errors = [];
  if (!location.name.trim()) errors.push('Location name is required');
  return errors;
};

export const validateObject = (object) => {
  const errors = [];
  if (!object.name.trim()) errors.push('Object name is required');
  return errors;
};

export const validateOrganization = (organization) => {
  const errors = [];
  if (!organization.name.trim()) errors.push('Organization name is required');
  return errors;
};

export const validateEvent = (event) => {
  const errors = [];
  if (!event.name.trim()) errors.push('Event name is required');
  return errors;
};

export const validateMagicSystem = (magicSystem) => {
  const errors = [];
  if (!magicSystem.name.trim()) errors.push('Magic system name is required');
  return errors;
};

export const validateTimeline = (timeline) => {
  const errors = [];
  if (!timeline.name.trim()) errors.push('Timeline name is required');
  return errors;
};

export const validateTheme = (theme) => {
  const errors = [];
  if (!theme.name.trim()) errors.push('Theme name is required');
  return errors;
};

export const validateConflict = (conflict) => {
  const errors = [];
  if (!conflict.name.trim()) errors.push('Conflict name is required');
  return errors;
};

export const validateLore = (lore) => {
  const errors = [];
  if (!lore.title.trim()) errors.push('Lore title is required');
  return errors;
};

export const validateScene = (scene) => {
  const errors = [];
  if (!scene.title.trim()) errors.push('Scene title is required');
  return errors;
};

export const validateProjectOverview = (overview) => {
  const errors = [];
  if (!overview.title.trim()) errors.push('Project title is required');
  return errors;
};

export const validateRelationship = (relationship) => {
  const errors = [];
  if (!relationship.fromEntityId) errors.push('From entity is required');
  if (!relationship.toEntityId) errors.push('To entity is required');
  if (!relationship.relationshipType.trim()) errors.push('Relationship type is required');
  return errors;
};

// Entity types enumeration - Expanded
export const ENTITY_TYPES = {
  CHARACTER: 'character',
  LOCATION: 'location',
  OBJECT: 'object',
  ORGANIZATION: 'organization',
  EVENT: 'event',
  MAGIC_SYSTEM: 'magicSystem',
  TIMELINE: 'timeline',
  THEME: 'theme',
  CONFLICT: 'conflict',
  LORE: 'lore',
  SCENE: 'scene',
  PROJECT: 'project',
  BRAINSTORM: 'brainstorm',
  RELATIONSHIP: 'relationship'
};

// Entity factory - Enhanced
export const createEntity = (type, overrides = {}) => {
  switch (type) {
    case ENTITY_TYPES.CHARACTER:
      return createCharacter(overrides);
    case ENTITY_TYPES.LOCATION:
      return createLocation(overrides);
    case ENTITY_TYPES.OBJECT:
      return createObject(overrides);
    case ENTITY_TYPES.ORGANIZATION:
      return createOrganization(overrides);
    case ENTITY_TYPES.EVENT:
      return createEvent(overrides);
    case ENTITY_TYPES.MAGIC_SYSTEM:
      return createMagicSystem(overrides);
    case ENTITY_TYPES.TIMELINE:
      return createTimeline(overrides);
    case ENTITY_TYPES.THEME:
      return createTheme(overrides);
    case ENTITY_TYPES.CONFLICT:
      return createConflict(overrides);
    case ENTITY_TYPES.LORE:
      return createLore(overrides);
    case ENTITY_TYPES.SCENE:
      return createScene(overrides);
    case ENTITY_TYPES.PROJECT:
      return createProjectOverview(overrides);
    case ENTITY_TYPES.BRAINSTORM:
      return createBrainstormEntry(overrides);
    case ENTITY_TYPES.RELATIONSHIP:
      return createRelationship('', '', overrides);
    default:
      throw new Error(`Unknown entity type: ${type}`);
  }
};

// Update entity helper
export const updateEntity = (entity, updates) => ({
  ...entity,
  ...updates,
  updatedAt: new Date().toISOString()
});

// Cross-entity relationship helpers
export const linkEntities = (fromEntity, toEntity, relationshipType, description = '') => {
  return createRelationship(fromEntity.id, toEntity.id, {
    fromEntityType: fromEntity.type || 'unknown',
    toEntityType: toEntity.type || 'unknown',
    relationshipType,
    description
  });
};

// Search helpers for professional features
export const searchEntities = (entities, query, filters = {}) => {
  return entities.filter(entity => {
    // Basic text search
    const matchesQuery = !query || 
      entity.name?.toLowerCase().includes(query.toLowerCase()) ||
      entity.title?.toLowerCase().includes(query.toLowerCase()) ||
      entity.description?.toLowerCase().includes(query.toLowerCase()) ||
      entity.notes?.toLowerCase().includes(query.toLowerCase());
    
    // Filter by type
    const matchesType = !filters.type || entity.type === filters.type;
    
    // Filter by tags
    const matchesTags = !filters.tags || filters.tags.every(tag => 
      entity.tags?.includes(tag)
    );
    
    // Filter by date range
    const matchesDateRange = !filters.dateRange || (
      new Date(entity.createdAt) >= new Date(filters.dateRange.start) &&
      new Date(entity.createdAt) <= new Date(filters.dateRange.end)
    );
    
    return matchesQuery && matchesType && matchesTags && matchesDateRange;
  });
};

// Export/Import helpers
export const exportProject = (projectData) => {
  return {
    version: '2.0',
    exportDate: new Date().toISOString(),
    project: projectData.project,
    entities: projectData.entities,
    relationships: projectData.relationships,
    metadata: {
      entityCounts: {
        characters: projectData.entities.filter(e => e.type === 'character').length,
        locations: projectData.entities.filter(e => e.type === 'location').length,
        objects: projectData.entities.filter(e => e.type === 'object').length,
        // ... other counts
      }
    }
  };
};

export const importProject = (importData) => {
  // Validation and import logic
  if (!importData.version || !importData.entities) {
    throw new Error('Invalid import data format');
  }
  
  return {
    project: importData.project,
    entities: importData.entities,
    relationships: importData.relationships || []
  };
}; 