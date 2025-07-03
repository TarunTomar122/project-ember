import React, { useState, useCallback, useEffect } from 'react';
import { textAnalysisService } from '../services/textAnalysis.js';
import useBibleStore from '../stores/bibleStore.js';
import Modal from './shared/Modal.jsx';

export const TextAnalysis = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { 
    addCharacter, 
    addLocation, 
    addObject, 
    addOrganization,
    addEvent,
    addMagicSystem,
    addTimeline,
    addTheme,
    addConflict,
    addLore,
    addScene,
    addRelationship
  } = useBibleStore();

  // Auto-detect entities as user types (debounced)
  const [quickSuggestions, setQuickSuggestions] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text.trim().length > 50) {
        const suggestions = textAnalysisService.quickCharacterDetection(text);
        setQuickSuggestions(suggestions.slice(0, 5));
      } else {
        setQuickSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(timeoutId); 
  }, [text]);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const results = await textAnalysisService.analyzeText(text, {
        provider: selectedProvider
      });

      if (results.success) {
        setAnalysisResults(results);
        setShowResults(true);
      } else {
        setError(results.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, selectedProvider]);

  const handleEntityToggle = useCallback((entityType, entityId) => {
    const fullId = `${entityType}-${entityId}`;
    setSelectedEntities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fullId)) {
        newSet.delete(fullId);
      } else {
        newSet.add(fullId);
      }
      return newSet;
    });
  }, []);

  const handleAddToBible = useCallback(() => {
    if (selectedEntities.size === 0) {
      setError('Please select at least one entity to add to the Bible');
      return;
    }
    setShowConfirmModal(true);
  }, [selectedEntities]);

  // Helper function to normalize pronouns to expected format
  const normalizePronouns = (pronouns) => {
    if (!pronouns) return 'they/them';
    
    const pronounsLower = pronouns.toLowerCase();
    
    if (pronounsLower.includes('he/him') || pronounsLower.includes('he') || pronounsLower.includes('him')) {
      return 'he/him';
    }
    if (pronounsLower.includes('she/her') || pronounsLower.includes('she') || pronounsLower.includes('her')) {
      return 'she/her';
    }
    if (pronounsLower.includes('they/them') || pronounsLower.includes('they') || pronounsLower.includes('them')) {
      return 'they/them';
    }
    
    // If none of the above match, return 'other'
    return 'other';
  };

  const confirmAddToBible = useCallback(() => {
    if (!analysisResults) return;

    let addedCount = 0;

    // Add selected characters
    analysisResults.entities.characters.forEach((character, index) => {
      if (selectedEntities.has(`character-${index}`)) {
        addCharacter({
          name: character.name,
          pronouns: normalizePronouns(character.pronouns),
          age: character.age || '',
          personality: character.personality || '',
          background: character.background || '',
          description: character.description || '',
          tags: character.traits || [],
          notes: `Auto-detected (${character.confidence?.toFixed(2)} confidence)`,
          source: character.source,
          mentions: character.mentions
        });
        addedCount++;
      }
    });

    // Add selected locations
    analysisResults.entities.locations.forEach((location, index) => {
      if (selectedEntities.has(`location-${index}`)) {
        addLocation({
          name: location.name,
          type: location.type || 'other',
          description: location.description || '',
          atmosphere: location.atmosphere || '',
          tags: location.tags || [],
          notes: `Auto-detected (${location.confidence?.toFixed(2)} confidence)`,
          source: location.source,
          mentions: location.mentions
        });
        addedCount++;
      }
    });

    // Add selected objects
    analysisResults.entities.objects.forEach((object, index) => {
      if (selectedEntities.has(`object-${index}`)) {
        addObject({
          name: object.name,
          type: object.type || 'other',
          description: object.description || '',
          significance: object.significance || '',
          tags: object.tags || [],
          notes: `Auto-detected (${object.confidence?.toFixed(2)} confidence)`,
          source: object.source,
          mentions: object.mentions
        });
        addedCount++;
      }
    });

    // Add selected organizations
    (analysisResults.entities.organizations || []).forEach((organization, index) => {
      if (selectedEntities.has(`organization-${index}`)) {
        addOrganization({
          name: organization.name,
          type: organization.type || 'other',
          description: organization.description || '',
          tags: organization.tags || [],
          notes: `Auto-detected (${organization.confidence?.toFixed(2)} confidence)`,
          source: organization.source,
          mentions: organization.mentions
        });
        addedCount++;
      }
    });

    // Add selected events
    (analysisResults.entities.events || []).forEach((event, index) => {
      if (selectedEntities.has(`event-${index}`)) {
        addEvent({
          name: event.name,
          type: event.type || 'other',
          description: event.description || '',
          tags: event.tags || [],
          notes: `Auto-detected (${event.confidence?.toFixed(2)} confidence)`,
          source: event.source,
          mentions: event.mentions
        });
        addedCount++;
      }
    });

    // Add selected magic systems
    (analysisResults.entities.magicSystems || []).forEach((magicSystem, index) => {
      if (selectedEntities.has(`magicSystem-${index}`)) {
        addMagicSystem({
          name: magicSystem.name,
          type: magicSystem.type || 'hard',
          description: magicSystem.description || '',
          tags: magicSystem.tags || [],
          notes: `Auto-detected (${magicSystem.confidence?.toFixed(2)} confidence)`,
          source: magicSystem.source,
          mentions: magicSystem.mentions
        });
        addedCount++;
      }
    });

    // Add selected timelines
    (analysisResults.entities.timelines || []).forEach((timeline, index) => {
      if (selectedEntities.has(`timeline-${index}`)) {
        addTimeline({
          name: timeline.name,
          type: timeline.type || 'story',
          description: timeline.description || '',
          tags: timeline.tags || [],
          notes: `Auto-detected (${timeline.confidence?.toFixed(2)} confidence)`,
          source: timeline.source,
          mentions: timeline.mentions
        });
        addedCount++;
      }
    });

    // Add selected themes
    (analysisResults.entities.themes || []).forEach((theme, index) => {
      if (selectedEntities.has(`theme-${index}`)) {
        addTheme({
          name: theme.name,
          type: theme.type || 'major',
          description: theme.description || '',
          tags: theme.tags || [],
          notes: `Auto-detected (${theme.confidence?.toFixed(2)} confidence)`,
          source: theme.source,
          mentions: theme.mentions
        });
        addedCount++;
      }
    });

    // Add selected conflicts
    (analysisResults.entities.conflicts || []).forEach((conflict, index) => {
      if (selectedEntities.has(`conflict-${index}`)) {
        addConflict({
          name: conflict.name,
          type: conflict.type || 'internal',
          description: conflict.description || '',
          tags: conflict.tags || [],
          notes: `Auto-detected (${conflict.confidence?.toFixed(2)} confidence)`,
          source: conflict.source,
          mentions: conflict.mentions
        });
        addedCount++;
      }
    });

    // Add selected lore
    (analysisResults.entities.lore || []).forEach((loreItem, index) => {
      if (selectedEntities.has(`lore-${index}`)) {
        addLore({
          title: loreItem.title || loreItem.name,
          type: loreItem.type || 'tradition',
          description: loreItem.description || '',
          tags: loreItem.tags || [],
          notes: `Auto-detected (${loreItem.confidence?.toFixed(2)} confidence)`,
          source: loreItem.source,
          mentions: loreItem.mentions
        });
        addedCount++;
      }
    });

    // Add selected scenes
    (analysisResults.entities.scenes || []).forEach((scene, index) => {
      if (selectedEntities.has(`scene-${index}`)) {
        addScene({
          title: scene.title || scene.name,
          description: scene.description || '',
          tags: scene.tags || [],
          notes: `Auto-detected (${scene.confidence?.toFixed(2)} confidence)`,
          source: scene.source,
          mentions: scene.mentions
        });
        addedCount++;
      }
    });

    // Add selected relationships
    (analysisResults.entities.relationships || []).forEach((relationship, index) => {
      if (selectedEntities.has(`relationship-${index}`)) {
        addRelationship({
          fromEntityId: relationship.fromEntityId || '',
          toEntityId: relationship.toEntityId || '',
          relationshipType: relationship.relationshipType || '',
          description: relationship.description || '',
          notes: `Auto-detected (${relationship.confidence?.toFixed(2)} confidence)`,
          source: relationship.source,
          mentions: relationship.mentions
        });
        addedCount++;
      }
    });

    setShowConfirmModal(false);
    setSelectedEntities(new Set());
    setError(null);
    
    // Show success message
    setTimeout(() => {
      setError(`Successfully added ${addedCount} ${addedCount === 1 ? 'entity' : 'entities'} to the Bible!`);
      setTimeout(() => setError(null), 3000);
    }, 100);
  }, [analysisResults, selectedEntities, addCharacter, addLocation, addObject, addOrganization, addEvent, addMagicSystem, addTimeline, addTheme, addConflict, addLore, addScene, addRelationship]);

  const renderEntityCard = (entity, type, index) => {
    const entityId = `${type}-${index}`;
    const isSelected = selectedEntities.has(entityId);
    const confidence = entity.confidence || 0;
    const confidenceColor = confidence > 0.8 ? 'text-green-600' : confidence > 0.6 ? 'text-yellow-600' : 'text-red-600';

    return (
      <div
        key={entityId}
        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleEntityToggle(type, index)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{entity.name}</h4>
            <p className={`text-sm font-medium ${confidenceColor}`}>
              {(confidence * 100).toFixed(0)}% confidence
            </p>
            {entity.description && (
              <p className="text-sm text-gray-600 mt-1">{entity.description}</p>
            )}
            {entity.personality && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Personality:</strong> {entity.personality}
              </p>
            )}
            {entity.type && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> {entity.type}
              </p>
            )}
            {entity.atmosphere && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Atmosphere:</strong> {entity.atmosphere}
              </p>
            )}
            {entity.role && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Role:</strong> {entity.role}
              </p>
            )}
            {entity.traits && entity.traits.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {entity.traits.slice(0, 3).map((trait, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      {trait}
                    </span>
                  ))}
                  {entity.traits.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      +{entity.traits.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            {entity.mentions && entity.mentions.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {entity.mentions.length} mention{entity.mentions.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            }`}>
              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickSuggestions = () => {
    if (quickSuggestions.length === 0) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Suggestions:</h4>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {suggestion.name}
            </span>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Characters detected as you type. Run full analysis for detailed profiles.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Text Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">
            Analyze your manuscript text to automatically detect characters, locations, objects, organizations, events, themes, conflicts, magic systems, and more
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Text Input */}
          <div>
            <label htmlFor="manuscript-text" className="block text-sm font-medium text-gray-700 mb-2">
              Manuscript Text
            </label>
            <textarea
              id="manuscript-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your manuscript text here to analyze for characters, locations, objects, organizations, events, themes, conflicts, magic systems, and other story elements..."
              className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length} characters • Minimum 50 characters recommended for analysis
            </p>
            {renderQuickSuggestions()}
          </div>

          {/* Provider Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">AI Provider:</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || text.trim().length < 50}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze Text</span>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`p-3 rounded-md ${
              error.includes('Successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Display */}
      {showResults && analysisResults && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Found {analysisResults.stats.charactersFound} characters, {analysisResults.stats.locationsFound} locations, {analysisResults.stats.objectsFound} objects, {analysisResults.stats.organizationsFound || 0} organizations, {analysisResults.stats.eventsFound || 0} events, {analysisResults.stats.themesFound || 0} themes, and more
                  • Overall confidence: {(analysisResults.stats.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedEntities(new Set())}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => {
                    const allEntities = new Set();
                    analysisResults.entities.characters.forEach((_, i) => allEntities.add(`character-${i}`));
                    analysisResults.entities.locations.forEach((_, i) => allEntities.add(`location-${i}`));
                    analysisResults.entities.objects.forEach((_, i) => allEntities.add(`object-${i}`));
                    (analysisResults.entities.organizations || []).forEach((_, i) => allEntities.add(`organization-${i}`));
                    (analysisResults.entities.events || []).forEach((_, i) => allEntities.add(`event-${i}`));
                    (analysisResults.entities.magicSystems || []).forEach((_, i) => allEntities.add(`magicSystem-${i}`));
                    (analysisResults.entities.themes || []).forEach((_, i) => allEntities.add(`theme-${i}`));
                    (analysisResults.entities.conflicts || []).forEach((_, i) => allEntities.add(`conflict-${i}`));
                    (analysisResults.entities.lore || []).forEach((_, i) => allEntities.add(`lore-${i}`));
                    (analysisResults.entities.scenes || []).forEach((_, i) => allEntities.add(`scene-${i}`));
                    (analysisResults.entities.relationships || []).forEach((_, i) => allEntities.add(`relationship-${i}`));
                    (analysisResults.entities.timelines || []).forEach((_, i) => allEntities.add(`timeline-${i}`));
                    setSelectedEntities(allEntities);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={handleAddToBible}
                  disabled={selectedEntities.size === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Bible ({selectedEntities.size})
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Characters */}
            {analysisResults.entities.characters.length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Characters ({analysisResults.entities.characters.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.characters.map((character, index) => 
                    renderEntityCard(character, 'character', index)
                  )}
                </div>
              </div>
            )}

            {/* Locations */}
            {analysisResults.entities.locations.length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Locations ({analysisResults.entities.locations.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.locations.map((location, index) => 
                    renderEntityCard(location, 'location', index)
                  )}
                </div>
              </div>
            )}

            {/* Objects */}
            {analysisResults.entities.objects.length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Objects ({analysisResults.entities.objects.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.objects.map((object, index) => 
                    renderEntityCard(object, 'object', index)
                  )}
                </div>
              </div>
            )}

            {/* Organizations */}
            {(analysisResults.entities.organizations || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Organizations ({analysisResults.entities.organizations.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.organizations.map((organization, index) => 
                    renderEntityCard(organization, 'organization', index)
                  )}
                </div>
              </div>
            )}

            {/* Events */}
            {(analysisResults.entities.events || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Events ({analysisResults.entities.events.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.events.map((event, index) => 
                    renderEntityCard(event, 'event', index)
                  )}
                </div>
              </div>
            )}

            {/* Magic Systems */}
            {(analysisResults.entities.magicSystems || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Magic Systems ({analysisResults.entities.magicSystems.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.magicSystems.map((magicSystem, index) => 
                    renderEntityCard(magicSystem, 'magicSystem', index)
                  )}
                </div>
              </div>
            )}

            {/* Themes */}
            {(analysisResults.entities.themes || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Themes ({analysisResults.entities.themes.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.themes.map((theme, index) => 
                    renderEntityCard(theme, 'theme', index)
                  )}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {(analysisResults.entities.conflicts || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Conflicts ({analysisResults.entities.conflicts.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.conflicts.map((conflict, index) => 
                    renderEntityCard(conflict, 'conflict', index)
                  )}
                </div>
              </div>
            )}

            {/* Lore & Rules */}
            {(analysisResults.entities.lore || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Lore & Rules ({analysisResults.entities.lore.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.lore.map((loreItem, index) => 
                    renderEntityCard(loreItem, 'lore', index)
                  )}
                </div>
              </div>
            )}

            {/* Scenes */}
            {(analysisResults.entities.scenes || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Scenes ({analysisResults.entities.scenes.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.scenes.map((scene, index) => 
                    renderEntityCard(scene, 'scene', index)
                  )}
                </div>
              </div>
            )}

            {/* Relationships */}
            {(analysisResults.entities.relationships || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Relationships ({analysisResults.entities.relationships.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.relationships.map((relationship, index) => 
                    renderEntityCard(relationship, 'relationship', index)
                  )}
                </div>
              </div>
            )}

            {/* Timelines */}
            {(analysisResults.entities.timelines || []).length > 0 && (
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Timelines ({analysisResults.entities.timelines.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResults.entities.timelines.map((timeline, index) => 
                    renderEntityCard(timeline, 'timeline', index)
                  )}
                </div>
              </div>
            )}

            {/* No Results */}
            {analysisResults.entities.characters.length === 0 && 
             analysisResults.entities.locations.length === 0 && 
             analysisResults.entities.objects.length === 0 &&
             (analysisResults.entities.organizations || []).length === 0 &&
             (analysisResults.entities.events || []).length === 0 &&
             (analysisResults.entities.magicSystems || []).length === 0 &&
             (analysisResults.entities.themes || []).length === 0 &&
             (analysisResults.entities.conflicts || []).length === 0 &&
             (analysisResults.entities.lore || []).length === 0 &&
             (analysisResults.entities.scenes || []).length === 0 &&
             (analysisResults.entities.relationships || []).length === 0 &&
             (analysisResults.entities.timelines || []).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No entities were detected in the text. Try analyzing a longer passage or check your AI provider settings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Add to Bible"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to add {selectedEntities.size} selected {selectedEntities.size === 1 ? 'entity' : 'entities'} to your Bible?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This will create new entries in your Bible with the auto-detected information. You can always edit them later.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddToBible}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add to Bible
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TextAnalysis; 