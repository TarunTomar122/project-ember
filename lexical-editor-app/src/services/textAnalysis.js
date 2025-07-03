import nlp from 'compromise';
import * as openaiService from './openai.js';
import * as geminiService from './gemini.js';

/**
 * Text Analysis Service for Auto-Population
 * Combines local NLP (Compromise.js) with LLM enhancement
 */
export class TextAnalysisService {
  constructor() {
    this.confidenceThreshold = 0.2; // Very low threshold to catch everything
    this.maxContextLength = 1000;
  }

  /**
   * Main analysis function - extracts entities from text
   * @param {string} text - The manuscript text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Extracted entities with confidence scores
   */
  async analyzeText(text, options = {}) {
    try {
      console.log('Starting LLM-based text analysis...');
      
      // Direct LLM analysis for better entity detection
      const entities = await this.performLLMAnalysis(text, options);
      
      // Validate and score results
      const validatedResults = this.validateResults(entities);
      
      return {
        success: true,
        entities: validatedResults,
        stats: {
          charactersFound: validatedResults.characters.length,
          locationsFound: validatedResults.locations.length,
          objectsFound: validatedResults.objects.length,
          organizationsFound: validatedResults.organizations.length,
          eventsFound: validatedResults.events.length,
          magicSystemsFound: validatedResults.magicSystems.length,
          themesFound: validatedResults.themes.length,
          conflictsFound: validatedResults.conflicts.length,
          loreFound: validatedResults.lore.length,
          scenesFound: validatedResults.scenes.length,
          relationshipsFound: validatedResults.relationships.length,
          timelinesFound: validatedResults.timelines.length,
          confidence: this.calculateOverallConfidence(validatedResults)
        }
      };
    } catch (error) {
      console.error('Text analysis failed:', error);
      return {
        success: false,
        error: error.message,
        entities: { 
          characters: [], 
          locations: [], 
          objects: [],
          organizations: [],
          events: [],
          magicSystems: [],
          themes: [],
          conflicts: [],
          lore: [],
          scenes: [],
          relationships: [],
          timelines: []
        }
      };
    }
  }

  /**
   * Direct LLM analysis for entity detection
   * @param {string} text - Text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Extracted entities
   */
  async performLLMAnalysis(text, options = {}) {
    const provider = options.provider || 'openai';
    const aiService = provider === 'gemini' ? geminiService : openaiService;
    
    console.log(`Using ${provider} for entity analysis...`);

    try {
      const response = await aiService.extractEntities(text);
      console.log('Raw LLM response:', response);
      
      // Extract the entities from the response
      let analysisResult = null;
      
      if (response && response.result) {
        console.log('Response result:', response.result);
        analysisResult = response.result;
      }
      
      console.log('Parsed analysis result:', analysisResult);
      
      if (analysisResult && (analysisResult.characters || analysisResult.locations || analysisResult.objects || 
                                analysisResult.organizations || analysisResult.events || analysisResult.magicSystems ||
                                analysisResult.themes || analysisResult.conflicts || analysisResult.lore ||
                                analysisResult.scenes || analysisResult.relationships || analysisResult.timelines)) {
        // Add source information to each entity
        const entities = {
          characters: (analysisResult.characters || []).map(char => ({
            ...char,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, char.name)
          })),
          locations: (analysisResult.locations || []).map(loc => ({
            ...loc,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, loc.name)
          })),
          objects: (analysisResult.objects || []).map(obj => ({
            ...obj,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, obj.name)
          })),
          organizations: (analysisResult.organizations || []).map(org => ({
            ...org,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, org.name)
          })),
          events: (analysisResult.events || []).map(event => ({
            ...event,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, event.name)
          })),
          magicSystems: (analysisResult.magicSystems || []).map(magic => ({
            ...magic,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, magic.name)
          })),
          themes: (analysisResult.themes || []).map(theme => ({
            ...theme,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, theme.name)
          })),
          conflicts: (analysisResult.conflicts || []).map(conflict => ({
            ...conflict,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, conflict.name)
          })),
          lore: (analysisResult.lore || []).map(loreItem => ({
            ...loreItem,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, loreItem.title)
          })),
          scenes: (analysisResult.scenes || []).map(scene => ({
            ...scene,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, scene.title)
          })),
          relationships: (analysisResult.relationships || []).map(rel => ({
            ...rel,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, `${rel.fromEntity} ${rel.toEntity}`)
          })),
          timelines: (analysisResult.timelines || []).map(timeline => ({
            ...timeline,
            source: 'llm_analysis',
            mentions: this.createMockMentions(text, timeline.name)
          }))
        };
        
        console.log('Processed LLM entities:', entities);
        return entities;
      } else {
        console.log('No valid analysis result, falling back to pattern analysis');
        return this.performBasicPatternAnalysis(text);
      }
    } catch (error) {
      console.error('LLM analysis failed:', error);
      console.error('Error details:', error.message);
      
      // Fallback to basic pattern matching if LLM fails
      return this.performBasicPatternAnalysis(text);
    }
  }
  
  /**
   * Basic pattern analysis fallback
   * @param {string} text - Text to analyze
   * @returns {Object} Basic entity extractions
   */
  performBasicPatternAnalysis(text) {
    console.log('Using basic pattern analysis as fallback...');
    
    // Enhanced pattern matching for characters (capitalized names)
    const characterMatches = text.match(/\b[A-Z][a-z]+\b/g) || [];
    const commonWords = ['If', 'The', 'And', 'But', 'Or', 'So', 'Yet', 'For', 'Nor', 'A', 'An', 'She', 'He', 'They', 'We', 'You', 'I', 'Me', 'Us', 'Him', 'Her', 'Their', 'His', 'Its', 'Our', 'Your', 'My', 'What', 'How', 'Where', 'When', 'Why', 'Who', 'Which', 'That', 'This', 'These', 'Those', 'With', 'Without', 'Through', 'During', 'Before', 'After', 'Above', 'Below', 'Up', 'Down', 'In', 'Out', 'On', 'Off', 'Over', 'Under', 'Again', 'Further', 'Then', 'Once', 'Here', 'There', 'Where', 'Now', 'Today', 'Tomorrow', 'Yesterday', 'Soon', 'Already', 'Still', 'Yet', 'Just', 'Only', 'Also', 'Too', 'Very', 'Really', 'Quite', 'Rather', 'Much', 'Many', 'Most', 'More', 'Less', 'Few', 'Little', 'Some', 'All', 'Every', 'Each', 'Both', 'Either', 'Neither', 'Another', 'Other', 'Same', 'Different', 'New', 'Old', 'First', 'Last', 'Next', 'Previous', 'Good', 'Bad', 'Best', 'Worst', 'Better', 'Worse', 'Big', 'Small', 'Large', 'Little', 'Long', 'Short', 'High', 'Low', 'Hot', 'Cold', 'Warm', 'Cool', 'Fast', 'Slow', 'Quick', 'Easy', 'Hard', 'Simple', 'Complex', 'True', 'False', 'Right', 'Wrong', 'Left', 'Right', 'Inside', 'Outside', 'Suddenly', 'Maybe', 'Perhaps', 'Probably', 'Definitely', 'Certainly', 'Possibly', 'Obviously', 'Clearly', 'Actually', 'Really', 'Truly', 'Indeed', 'However', 'Therefore', 'Because', 'Since', 'Although', 'Though', 'Unless', 'Until', 'While', 'Whereas', 'Meanwhile', 'Otherwise', 'Instead', 'Besides', 'Moreover', 'Furthermore', 'Nevertheless', 'Nonetheless', 'Consequently', 'Accordingly', 'Finally', 'Lastly', 'Firstly', 'Secondly', 'Thirdly', 'Eventually', 'Immediately', 'Recently', 'Currently', 'Previously', 'Later', 'Earlier', 'Somewhere', 'Anywhere', 'Everywhere', 'Nowhere', 'Someone', 'Anyone', 'Everyone', 'Nobody', 'Something', 'Anything', 'Everything', 'Nothing'];
    
    const characters = [...new Set(characterMatches)]
      .filter(name => name.length > 2)
      .filter(name => !commonWords.includes(name))
      .slice(0, 15)
      .map(name => ({
        name,
        description: this.inferFromContext(text, name, ['tall', 'short', 'eyes', 'hair', 'young', 'old', 'beautiful', 'handsome', 'dark', 'fair', 'thin', 'heavy']),
        personality: this.inferFromContext(text, name, ['brave', 'scared', 'determined', 'quiet', 'loud', 'kind', 'cruel', 'smart', 'foolish', 'angry', 'happy', 'sad']),
        background: this.inferFromContext(text, name, ['father', 'mother', 'family', 'work', 'job', 'friend', 'enemy', 'brother', 'sister', 'child', 'parent']),
        role: this.inferCharacterRole(text, name),
        age: this.inferFromContext(text, name, ['years old', 'age', 'young', 'old', 'child', 'adult', 'teenager', 'elderly']),
        pronouns: this.inferPronouns(text, name),
        traits: this.inferTraits(text, name),
        confidence: 0.7,
        source: 'pattern_analysis',
        mentions: this.createMockMentions(text, name)
      }));
    
    // Enhanced pattern matching for locations
    const locationWords = [
      // Buildings
      'house', 'home', 'building', 'mansion', 'castle', 'palace', 'cottage', 'cabin', 'shack', 'barn', 'warehouse', 'factory', 'mill', 'shop', 'store', 'market', 'mall', 'plaza', 'tower', 'temple', 'church', 'mosque', 'synagogue', 'monastery', 'cathedral', 'chapel',
      // Rooms
      'room', 'bedroom', 'kitchen', 'bathroom', 'attic', 'basement', 'cellar', 'study', 'library', 'office', 'living room', 'dining room', 'hall', 'hallway', 'corridor', 'chamber', 'vault', 'dungeon',
      // Outdoor places
      'garden', 'yard', 'courtyard', 'park', 'forest', 'woods', 'jungle', 'desert', 'mountain', 'hill', 'valley', 'field', 'meadow', 'plain', 'beach', 'shore', 'cliff', 'cave', 'cavern',
      // Urban areas
      'city', 'town', 'village', 'street', 'road', 'avenue', 'lane', 'alley', 'square', 'plaza', 'district', 'neighborhood', 'suburb',
      // Transportation
      'station', 'airport', 'port', 'harbor', 'dock', 'terminal', 'platform', 'bridge', 'tunnel',
      // Institutions
      'school', 'university', 'college', 'hospital', 'clinic', 'museum', 'gallery', 'theater', 'cinema', 'restaurant', 'cafe', 'bar', 'inn', 'hotel', 'motel',
      // Misc
      'shed', 'garage', 'stable', 'kennel', 'greenhouse', 'workshop', 'studio', 'laboratory', 'observatory'
    ];
    
    const locations = locationWords
      .filter(word => text.toLowerCase().includes(word.toLowerCase()))
      .map(word => ({
        name: word,
        type: this.inferLocationType(word),
        description: this.inferFromContext(text, word, ['dark', 'bright', 'large', 'small', 'old', 'new', 'empty', 'crowded', 'quiet', 'noisy', 'beautiful', 'ugly', 'clean', 'dirty']),
        atmosphere: this.inferLocationAtmosphere(text, word),
        significance: this.inferFromContext(text, word, ['important', 'secret', 'hidden', 'dangerous', 'safe', 'mysterious', 'magical', 'sacred', 'forbidden']),
        confidence: 0.6,
        source: 'pattern_analysis',
        mentions: this.createMockMentions(text, word)
      }));
    
    // Enhanced pattern matching for objects
    const objectWords = [
      // Documents
      'letter', 'note', 'book', 'notebook', 'diary', 'journal', 'document', 'paper', 'scroll', 'map', 'chart', 'blueprint', 'contract', 'will', 'deed', 'certificate', 'report', 'file',
      // Tools/Weapons
      'sword', 'knife', 'dagger', 'gun', 'pistol', 'rifle', 'bow', 'arrow', 'spear', 'axe', 'hammer', 'tool', 'key', 'lock', 'chain', 'rope', 'lever', 'button', 'switch',
      // Containers
      'box', 'chest', 'trunk', 'bag', 'sack', 'pouch', 'basket', 'container', 'bottle', 'jar', 'vase', 'pot', 'barrel', 'crate', 'case', 'suitcase', 'briefcase',
      // Furniture
      'chair', 'table', 'desk', 'bed', 'sofa', 'couch', 'bench', 'stool', 'shelf', 'cabinet', 'dresser', 'wardrobe', 'mirror', 'lamp', 'clock',
      // Jewelry/Valuables
      'ring', 'necklace', 'bracelet', 'earring', 'crown', 'tiara', 'jewel', 'gem', 'diamond', 'gold', 'silver', 'coin', 'treasure', 'artifact',
      // Technology
      'phone', 'computer', 'laptop', 'tablet', 'camera', 'television', 'radio', 'watch',
      // Vehicles
      'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'boat', 'ship', 'plane', 'helicopter', 'train', 'carriage', 'wagon',
      // Clothing
      'dress', 'shirt', 'pants', 'coat', 'jacket', 'hat', 'shoes', 'boots', 'gloves', 'scarf', 'belt', 'helmet', 'armor',
      // Misc
      'door', 'window', 'gate', 'fence', 'wall', 'stairs', 'ladder', 'beam', 'column', 'statue', 'painting', 'picture', 'candle', 'torch', 'crystal', 'orb', 'staff', 'wand'
    ];
    
    const objects = objectWords
      .filter(word => text.toLowerCase().includes(word.toLowerCase()))
      .map(word => ({
        name: word,
        type: this.inferObjectType(word),
        description: this.inferFromContext(text, word, ['old', 'new', 'ancient', 'modern', 'broken', 'damaged', 'perfect', 'beautiful', 'ugly', 'large', 'small', 'heavy', 'light', 'sharp', 'dull', 'bright', 'dark', 'magical', 'ordinary']),
        significance: this.inferFromContext(text, word, ['important', 'valuable', 'precious', 'dangerous', 'powerful', 'magical', 'cursed', 'blessed', 'ancient', 'legendary', 'mysterious', 'hidden', 'lost', 'stolen']),
        confidence: 0.6,
        source: 'pattern_analysis',
        mentions: this.createMockMentions(text, word)
      }));
    
    console.log('Pattern analysis results:', { characters, locations, objects });
    return { characters, locations, objects };
  }
  
  // Helper methods for enhanced pattern analysis
  inferFromContext(text, name, keywords) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(name.toLowerCase())) {
        for (const keyword of keywords) {
          if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
            return sentence.trim();
          }
        }
      }
    }
    return '';
  }
  
  inferPronouns(text, name) {
    const context = this.inferFromContext(text, name, ['he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'their']);
    if (context.toLowerCase().includes(' he ') || context.toLowerCase().includes(' him ') || context.toLowerCase().includes(' his ')) {
      return 'he/him';
    }
    if (context.toLowerCase().includes(' she ') || context.toLowerCase().includes(' her ')) {
      return 'she/her';
    }
    return 'they/them';
  }
  
  inferTraits(text, name) {
    const traits = [];
    const traitKeywords = ['brave', 'scared', 'kind', 'cruel', 'smart', 'wise', 'foolish', 'strong', 'weak', 'determined', 'hesitant', 'confident', 'nervous', 'calm', 'angry', 'patient', 'impatient'];
    
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(name.toLowerCase())) {
        for (const trait of traitKeywords) {
          if (sentence.toLowerCase().includes(trait) && !traits.includes(trait)) {
            traits.push(trait);
          }
        }
      }
    }
    return traits.slice(0, 3); // Limit to 3 traits
  }
  
  inferCharacterRole(text, name) {
    if (text.indexOf(name) < text.length * 0.3) return 'protagonist';
    if (text.toLowerCase().includes(name.toLowerCase() + ' said') || text.toLowerCase().includes(name.toLowerCase() + ' asked')) return 'supporting';
    return 'minor';
  }
  
  inferLocationType(word) {
    const types = {
      'attic': 'room',
      'house': 'building',
      'room': 'room',
      'station': 'building',
      'town': 'city',
      'city': 'city',
      'shed': 'building',
      'valley': 'region'
    };
    return types[word.toLowerCase()] || 'other';
  }
  
  inferLocationDescription(text, word) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        return sentence.trim();
      }
    }
    return '';
  }
  
  inferLocationAtmosphere(text, word) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        if (sentence.includes('quiet') || sentence.includes('dark') || sentence.includes('abandoned') || sentence.includes('dust')) {
          return sentence.includes('quiet') ? 'quiet' : sentence.includes('dark') ? 'mysterious' : 'abandoned';
        }
      }
    }
    return '';
  }
  
  inferLocationSignificance(text, word) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        if (sentence.includes('found') || sentence.includes('hidden') || sentence.includes('secret')) {
          return 'Important location where secrets are discovered';
        }
      }
    }
    return '';
  }
  
  inferObjectType(word) {
    const types = {
      'letter': 'document',
      'key': 'tool',
      'notebook': 'document',
      'book': 'document',
      'map': 'document',
      'trunk': 'furniture',
      'box': 'container',
      'locker': 'furniture'
    };
    return types[word.toLowerCase()] || 'other';
  }
  
  inferObjectDescription(text, word) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        return sentence.trim();
      }
    }
    return '';
  }
  
  inferObjectSignificance(text, word) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        if (sentence.includes('found') || sentence.includes('hidden') || sentence.includes('secret') || sentence.includes('important')) {
          return 'Key story element that drives the plot forward';
        }
      }
    }
    return '';
  }
  
  /**
   * Create mock mentions for entities (since we're not doing local NLP anymore)
   * @param {string} text - Full text
   * @param {string} entityName - Entity name to find
   * @returns {Array} Mock mentions array
   */
  createMockMentions(text, entityName) {
    const mentions = [];
    const regex = new RegExp(`\\b${entityName}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null && mentions.length < 3) {
      const start = Math.max(0, match.index - 50);
      const end = Math.min(text.length, match.index + match[0].length + 50);
      const context = text.substring(start, end).trim();
      
      mentions.push({
        position: match.index,
        context,
        sentence: context
      });
    }
    
    return mentions;
  }

  /**
   * Local NLP analysis using Compromise.js (DEPRECATED - keeping for reference)
   * @param {string} text - Text to analyze
   * @returns {Object} Raw entity extractions
   */
  performLocalAnalysis(text) {
    const doc = nlp(text);
    
    // Extract people (potential characters)
    const rawPeople = doc.people().out('array');
    console.log('Raw people detected:', rawPeople);
    
    const people = rawPeople.map(name => ({
      name: name.trim(),
      mentions: this.findMentions(text, name),
      confidence: 0.8, // High confidence for NLP-detected people
      source: 'local_nlp'
    }));

    // Extract places (potential locations)
    const rawPlaces = doc.places().out('array');
    console.log('Raw places detected:', rawPlaces);
    
    const places = rawPlaces.map(place => ({
      name: place.trim(),
      mentions: this.findMentions(text, place),
      confidence: 0.7,
      source: 'local_nlp'
    }));

    // Extract proper nouns (potential characters/locations/objects)
    const rawProperNouns = doc.match('#ProperNoun').out('array');
    console.log('Raw proper nouns detected:', rawProperNouns);
    
    const properNouns = rawProperNouns
      .filter(noun => noun.length > 1)
      .map(noun => ({
        name: noun.trim(),
        mentions: this.findMentions(text, noun),
        confidence: 0.5,
        source: 'local_nlp',
        type: 'unknown' // Will be classified by LLM
      }));

    // Extract quoted speech (dialogue)
    const dialogue = doc.quotations().out('array').map(quote => ({
      text: quote.trim(),
      speaker: this.inferSpeaker(text, quote),
      confidence: 0.6
    }));

    console.log('Local analysis results:', {
      people: people.length,
      places: places.length,
      properNouns: properNouns.length,
      dialogue: dialogue.length
    });

    return {
      people,
      places,
      properNouns,
      dialogue,
      sentences: doc.sentences().out('array'),
      wordCount: doc.wordCount()
    };
  }

  /**
   * Find all mentions of an entity in text with context
   * @param {string} text - Full text
   * @param {string} entity - Entity name to find
   * @returns {Array} Array of mention objects with context
   */
  findMentions(text, entity) {
    const mentions = [];
    const regex = new RegExp(`\\b${entity}\\b`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const start = Math.max(0, match.index - 100);
      const end = Math.min(text.length, match.index + match[0].length + 100);
      const context = text.substring(start, end).trim();

      mentions.push({
        position: match.index,
        context,
        sentence: this.getSentenceContaining(text, match.index)
      });
    }

    return mentions;
  }

  /**
   * Get the sentence containing a specific position
   * @param {string} text - Full text
   * @param {number} position - Character position
   * @returns {string} Sentence containing the position
   */
  getSentenceContaining(text, position) {
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    let currentPos = 0;

    for (const sentence of sentences) {
      if (currentPos <= position && position <= currentPos + sentence.length) {
        return sentence;
      }
      currentPos += sentence.length;
    }

    return '';
  }

  /**
   * Infer speaker from dialogue context
   * @param {string} text - Full text
   * @param {string} quote - Quoted text
   * @returns {string|null} Inferred speaker name
   */
  inferSpeaker(text, quote) {
    const quoteIndex = text.indexOf(quote);
    if (quoteIndex === -1) return null;

    // Look for speaker patterns before and after quote
    const before = text.substring(Math.max(0, quoteIndex - 200), quoteIndex);
    const after = text.substring(quoteIndex + quote.length, Math.min(text.length, quoteIndex + quote.length + 200));

    // Common dialogue patterns
    const speakerPatterns = [
      /(\w+)\s+said[:\s]/i,
      /(\w+)\s+shouted[:\s]/i,
      /(\w+)\s+whispered[:\s]/i,
      /(\w+)\s+asked[:\s]/i,
      /(\w+)\s+replied[:\s]/i,
      /(\w+)[:\s]+$/i
    ];

    for (const pattern of speakerPatterns) {
      const match = before.match(pattern) || after.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Enhance entities using LLM analysis
   * @param {Object} localAnalysis - Results from local NLP
   * @param {string} originalText - Original manuscript text
   * @param {Object} options - Enhancement options
   * @returns {Object} Enhanced entity data
   */
  async enhanceWithLLM(localAnalysis, originalText, options = {}) {
    const provider = options.provider || 'openai';
    const aiService = provider === 'gemini' ? geminiService : openaiService;

    const enhancedEntities = {
      characters: [],
      locations: [],
      objects: []
    };

    try {
      // Process high-confidence people as characters
      for (const person of localAnalysis.people) {
        if (person.confidence >= this.confidenceThreshold) {
          const characterData = await this.generateCharacterProfile(person, originalText, aiService);
          if (characterData) {
            enhancedEntities.characters.push(characterData);
          }
        }
      }

      // Process places as locations
      for (const place of localAnalysis.places) {
        if (place.confidence >= this.confidenceThreshold) {
          const locationData = await this.generateLocationProfile(place, originalText, aiService);
          if (locationData) {
            enhancedEntities.locations.push(locationData);
          }
        }
      }

      // Classify and enhance proper nouns
      const classifiedNouns = await this.classifyProperNouns(localAnalysis.properNouns, originalText, aiService);
      enhancedEntities.characters.push(...classifiedNouns.characters);
      enhancedEntities.locations.push(...classifiedNouns.locations);
      enhancedEntities.objects.push(...classifiedNouns.objects);

    } catch (error) {
      console.error('LLM enhancement failed:', error);
      // Fallback to local analysis only
      return this.fallbackToLocalAnalysis(localAnalysis);
    }

    return enhancedEntities;
  }

  /**
   * Generate character profile using LLM
   * @param {Object} person - Person entity from local analysis
   * @param {string} text - Original text
   * @param {Object} aiService - AI service instance
   * @returns {Object|null} Character profile or null
   */
  async generateCharacterProfile(person, text, aiService) {
    const context = this.buildContext(person);
    
    const prompt = `Analyze this character from the following text context and create a character profile:

Character Name: ${person.name}
Context: ${context}

Please provide a JSON response with the following structure:
{
  "name": "character name",
  "pronouns": "they/them/he/him/she/her",
  "age": "estimated age or age range",
  "personality": "brief personality description",
  "background": "brief background based on text",
  "relationships": ["list of other characters they interact with"],
  "traits": ["key personality traits"],
  "confidence": 0.0-1.0,
  "description": "physical description if mentioned",
  "role": "protagonist/antagonist/supporting/minor"
}

Only include information that can be reasonably inferred from the text. Use null for unknown fields.`;

    try {
      // Use the describeText function as it's closest to our needs
      const response = await aiService.describeText(prompt, text);
      
      const characterData = this.parseJSONResponse(response.result.analysis);
      if (characterData && characterData.name) {
        return {
          ...characterData,
          mentions: person.mentions,
          source: 'llm_enhanced',
          lastAnalyzed: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Character profile generation failed:', error);
    }

    return null;
  }

  /**
   * Generate location profile using LLM
   * @param {Object} place - Place entity from local analysis
   * @param {string} fullText - Original text
   * @param {Object} aiService - AI service instance
   * @returns {Object|null} Location profile or null
   */
  async generateLocationProfile(place, fullText, aiService) {
    const context = this.buildContext(place);
    
    const prompt = `Analyze this location from the following text context and create a location profile:

Location Name: ${place.name}
Context: ${context}

Please provide a JSON response with the following structure:
{
  "name": "location name",
  "type": "city/building/room/landmark/region/fantasy/other",
  "description": "description based on text",
  "atmosphere": "mood or feeling of the location",
  "significance": "importance to the story",
  "connections": ["other locations or characters associated"],
  "tags": ["relevant tags"],
  "confidence": 0.0-1.0
}

Only include information that can be reasonably inferred from the text. Use null for unknown fields.`;

    try {
      const response = await aiService.describeText(prompt, fullText);
      
      const locationData = this.parseJSONResponse(response.result.analysis);
      if (locationData && locationData.name) {
        return {
          ...locationData,
          mentions: place.mentions,
          source: 'llm_enhanced',
          lastAnalyzed: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Location profile generation failed:', error);
    }

    return null;
  }

  /**
   * Classify proper nouns into character/location/object categories
   * @param {Array} properNouns - Array of proper noun entities
   * @param {string} fullText - Original text
   * @param {Object} aiService - AI service instance
   * @returns {Object} Classified entities
   */
  async classifyProperNouns(properNouns, fullText, aiService) {
    if (properNouns.length === 0) {
      return { characters: [], locations: [], objects: [] };
    }

    const nounsList = properNouns.map(noun => noun.name).join(', ');
    const context = properNouns.map(noun => 
      `${noun.name}: ${noun.mentions.slice(0, 2).map(m => m.context).join(' ')}`
    ).join('\n');

    const prompt = `Classify these proper nouns from a story into categories based on their context:

Proper Nouns: ${nounsList}

Context for each:
${context}

Please provide a JSON response with the following structure:
{
  "characters": [{"name": "char_name", "confidence": 0.0-1.0}],
  "locations": [{"name": "loc_name", "confidence": 0.0-1.0}],
  "objects": [{"name": "obj_name", "confidence": 0.0-1.0}]
}

Only include names that clearly belong to each category. Exclude unclear or ambiguous terms.`;

    try {
      const response = await aiService.describeText(prompt, fullText);
      
      const classification = this.parseJSONResponse(response.result.analysis);
      if (classification) {
        return {
          characters: classification.characters || [],
          locations: classification.locations || [],
          objects: classification.objects || []
        };
      }
    } catch (error) {
      console.error('Proper noun classification failed:', error);
    }

    return { characters: [], locations: [], objects: [] };
  }

  /**
   * Build context string for LLM analysis
   * @param {Object} entity - Entity to build context for
   * @returns {string} Context string
   */
  buildContext(entity) {
    if (!entity.mentions || entity.mentions.length === 0) {
      return '';
    }

    // Get up to 3 most relevant mentions
    const relevantMentions = entity.mentions
      .slice(0, 3)
      .map(mention => mention.context)
      .join('\n\n');

    return relevantMentions.length > this.maxContextLength 
      ? relevantMentions.substring(0, this.maxContextLength) + '...'
      : relevantMentions;
  }

  /**
   * Parse JSON response from LLM
   * @param {string} response - LLM response
   * @returns {Object|null} Parsed JSON or null
   */
  parseJSONResponse(response) {
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('Failed to parse LLM JSON response:', error);
      return null;
    }
  }

  /**
   * Fallback to local analysis if LLM fails
   * @param {Object} localAnalysis - Local analysis results
   * @returns {Object} Fallback entity data
   */
  fallbackToLocalAnalysis(localAnalysis) {
    console.log('Fallback analysis - input:', localAnalysis);
    
    // If compromise.js didn't find anything, do basic manual detection
    if (localAnalysis.people.length === 0 && localAnalysis.places.length === 0) {
      console.log('No entities found by compromise.js, trying manual detection...');
      
      // Basic manual detection for debugging
      const text = localAnalysis.sentences.join(' ');
      const manualCharacters = [];
      const manualLocations = [];
      
      // Look for common character patterns
      const characterPatterns = [
        /\b[A-Z][a-z]+\b/g  // Capitalized words (potential names)
      ];
      
      characterPatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        matches.forEach(match => {
          if (match.length > 2 && !manualCharacters.some(c => c.name === match)) {
            manualCharacters.push({
              name: match,
              confidence: 0.6,
              source: 'manual_detection',
              mentions: this.findMentions(text, match)
            });
          }
        });
      });
      
      console.log('Manual detection found:', {
        characters: manualCharacters.length,
        locations: manualLocations.length
      });
      
      return {
        characters: manualCharacters.slice(0, 10), // Limit to avoid too many results
        locations: manualLocations,
        objects: [],
        organizations: [],
        events: [],
        magicSystems: [],
        themes: [],
        conflicts: [],
        lore: [],
        scenes: [],
        relationships: [],
        timelines: []
      };
    }
    
    const result = {
      characters: localAnalysis.people.map(person => ({
        name: person.name,
        confidence: person.confidence,
        source: 'local_fallback',
        mentions: person.mentions
      })),
      locations: localAnalysis.places.map(place => ({
        name: place.name,
        confidence: place.confidence,
        source: 'local_fallback',
        mentions: place.mentions
      })),
      objects: [],
      organizations: [],
      events: [],
      magicSystems: [],
      themes: [],
      conflicts: [],
      lore: [],
      scenes: [],
      relationships: [],
      timelines: []
    };
    
    console.log('Fallback analysis - output:', result);
    return result;
  }

  /**
   * Validate and filter results
   * @param {Object} entities - Entity data to validate
   * @returns {Object} Validated entity data
   */
  validateResults(entities) {
    console.log('Validating entities:', entities);
    console.log('Confidence threshold:', this.confidenceThreshold);
    
    // Support all entity types
    const validated = {
      characters: [],
      locations: [],
      objects: [],
      organizations: [],
      events: [],
      magicSystems: [],
      themes: [],
      conflicts: [],
      lore: [],
      scenes: [],
      relationships: [],
      timelines: []
    };

    // Filter by confidence threshold and deduplicate
    Object.keys(validated).forEach(category => {
      const entityList = entities[category] || [];
      console.log(`Processing ${category}:`, entityList);
      
      const seen = new Set();
      
      validated[category] = entityList
        .filter(entity => {
          const confidence = entity.confidence || 0;
          const name = (entity.name || entity.title)?.toLowerCase().trim();
          
          console.log(`Checking entity: ${name}, confidence: ${confidence}`);
          
          if (confidence < this.confidenceThreshold || !name || seen.has(name)) {
            console.log(`Filtered out: confidence ${confidence} < ${this.confidenceThreshold}, name: ${name}, seen: ${seen.has(name)}`);
            return false;
          }
          
          seen.add(name);
          return true;
        })
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    });

    console.log('Validated results:', validated);
    return validated;
  }

  /**
   * Calculate overall confidence score
   * @param {Object} entities - Validated entities
   * @returns {number} Overall confidence score
   */
  calculateOverallConfidence(entities) {
    const allEntities = [
      ...entities.characters,
      ...entities.locations,
      ...entities.objects,
      ...entities.organizations,
      ...entities.events,
      ...entities.magicSystems,
      ...entities.themes,
      ...entities.conflicts,
      ...entities.lore,
      ...entities.scenes,
      ...entities.relationships,
      ...entities.timelines
    ];

    if (allEntities.length === 0) return 0;

    const totalConfidence = allEntities.reduce((sum, entity) => sum + (entity.confidence || 0), 0);
    return totalConfidence / allEntities.length;
  }

  /**
   * Quick character detection for real-time suggestions
   * @param {string} text - Text to analyze
   * @returns {Array} Array of potential characters
   */
  quickCharacterDetection(text) {
    const doc = nlp(text);
    return doc.people().out('array').map(name => ({
      name: name.trim(),
      confidence: 0.7,
      source: 'quick_detection'
    }));
  }

  /**
   * Extract story elements for auto-suggestions
   * @param {string} text - Text to analyze
   * @returns {Object} Story elements
   */
  extractStoryElements(text) {
    const doc = nlp(text);
    
    return {
      characters: doc.people().out('array'),
      locations: doc.places().out('array'),
      organizations: doc.organizations().out('array'),
      dates: doc.dates ? doc.dates().out('array') : [],
      emotions: doc.match('#Emotion').out('array'),
      actions: doc.verbs().out('array'),
      themes: this.extractThemes(text),
      tone: this.analyzeTone(doc)
    };
  }

  /**
   * Extract themes from text
   * @param {string} text - Text to analyze
   * @returns {Array} Array of potential themes
   */
  extractThemes(text) {
    // Simple theme detection based on common story themes
    const themeKeywords = {
      'love': ['love', 'heart', 'romance', 'passion', 'affection'],
      'adventure': ['adventure', 'journey', 'quest', 'explore', 'discover'],
      'mystery': ['mystery', 'secret', 'hidden', 'unknown', 'puzzle'],
      'conflict': ['war', 'battle', 'fight', 'struggle', 'conflict'],
      'friendship': ['friend', 'friendship', 'companion', 'ally', 'trust'],
      'betrayal': ['betray', 'betrayal', 'deceive', 'trick', 'lie'],
      'redemption': ['redemption', 'forgive', 'atone', 'redeem', 'salvation'],
      'power': ['power', 'control', 'dominance', 'authority', 'rule']
    };

    const themes = [];
    const textLower = text.toLowerCase();

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => textLower.includes(keyword));
      if (matches.length > 0) {
        themes.push({
          theme,
          confidence: matches.length / keywords.length,
          keywords: matches
        });
      }
    });

    return themes.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze tone of text
   * @param {Object} doc - Compromise document
   * @returns {Object} Tone analysis
   */
  analyzeTone(doc) {
    // Simple tone detection based on word sentiment
    const positiveWords = doc.match('#Positive').out('array');
    const negativeWords = doc.match('#Negative').out('array');
    const totalWords = doc.wordCount();

    const positiveScore = positiveWords.length / totalWords;
    const negativeScore = negativeWords.length / totalWords;

    if (positiveScore > negativeScore) {
      return { tone: 'positive', confidence: positiveScore };
    } else if (negativeScore > positiveScore) {
      return { tone: 'negative', confidence: negativeScore };
    } else {
      return { tone: 'neutral', confidence: 1 - Math.abs(positiveScore - negativeScore) };
    }
  }
}

// Export singleton instance
export const textAnalysisService = new TextAnalysisService(); 