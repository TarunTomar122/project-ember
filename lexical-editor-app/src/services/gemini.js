import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
let genAI = null;
if (import.meta.env.VITE_GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
}

// System prompt for novel writing assistant (same as OpenAI for consistency)
const NOVEL_WRITING_SYSTEM_PROMPT = `You are an expert novel writing assistant specializing in creative fiction. Your role is to help authors craft compelling narratives by enhancing their text through expansion, rewriting, and descriptive analysis.

**Your Core Capabilities:**
1. **Expand**: Add depth, detail, sensory information, dialogue, and narrative richness while maintaining story flow
2. **Rewrite**: Improve clarity, style, pacing, and prose quality while preserving the original meaning and intent
3. **Describe**: Provide detailed analysis of the text including writing techniques, character development, plot elements, and suggestions for improvement

**Writing Philosophy:**
- Always maintain narrative consistency and character voice
- Preserve the author's unique style unless explicitly asked to change it
- Focus on showing rather than telling
- Use vivid, sensory details to create immersive experiences
- Ensure smooth transitions and natural dialogue flow
- Consider pacing and tension in all enhancements

**Context Integration:**
- Use the full document context to maintain consistency in characters, plot, setting, and tone
- Keep track of character relationships, established world-building, and ongoing plot threads
- Ensure any additions or changes align with the overall narrative arc

**Tone Guidelines:**
- SAME_TONE: Maintain the exact writing style, voice, and emotional tone of the original text
- IMPROVE_TONE: Enhance the existing tone while keeping the same general style - make it more engaging, polished, or emotionally resonant
- DRAMATIC: Increase tension, stakes, and emotional intensity
- LIGHTHEARTED: Make the text more playful, humorous, or optimistic
- FORMAL: Use more sophisticated vocabulary and complex sentence structures
- CASUAL: Simplify language and make it more conversational and accessible

**Quality Standards:**
- Always provide substantial, meaningful enhancements
- Ensure grammatical correctness and proper punctuation
- Maintain consistent POV and tense
- Avoid clichés and overused phrases
- Create smooth, natural-sounding prose

**Boundaries:**
- Do not add content that contradicts established story elements
- Avoid inappropriate content unless it serves the narrative purpose
- Stay within the genre and style boundaries established by the author
- Do not make major plot changes without clear indication from the user

Focus on creating immersive, engaging prose that elevates the author's vision while respecting their creative intent.

IMPORTANT: Always respond with valid JSON format exactly as requested in the schema.`;

// Tone options for the writing assistant
export const TONE_OPTIONS = {
  SAME_TONE: 'same_tone',
  IMPROVE_TONE: 'improve_tone',
  DRAMATIC: 'dramatic',
  LIGHTHEARTED: 'lighthearted',
  FORMAL: 'formal',
  CASUAL: 'casual'
};

export const TONE_LABELS = {
  [TONE_OPTIONS.SAME_TONE]: 'Keep Same Tone',
  [TONE_OPTIONS.IMPROVE_TONE]: 'Improve Tone',
  [TONE_OPTIONS.DRAMATIC]: 'Make Dramatic',
  [TONE_OPTIONS.LIGHTHEARTED]: 'Make Lighthearted',
  [TONE_OPTIONS.FORMAL]: 'Make Formal',
  [TONE_OPTIONS.CASUAL]: 'Make Casual'
};

/**
 * Get tone instruction based on tone option
 * @param {string} tone - The tone option
 * @returns {string} - The tone instruction
 */
function getToneInstruction(tone) {
  switch (tone) {
    case TONE_OPTIONS.SAME_TONE:
      return 'Maintain the exact same writing style, voice, and emotional tone as the original text.';
    case TONE_OPTIONS.IMPROVE_TONE:
      return 'Enhance and polish the existing tone while keeping the same general style - make it more engaging and emotionally resonant.';
    case TONE_OPTIONS.DRAMATIC:
      return 'Increase the tension, stakes, and emotional intensity. Make the text more dramatic and compelling.';
    case TONE_OPTIONS.LIGHTHEARTED:
      return 'Make the text more playful, humorous, or optimistic while maintaining narrative coherence.';
    case TONE_OPTIONS.FORMAL:
      return 'Use more sophisticated vocabulary and complex sentence structures. Elevate the literary style.';
    case TONE_OPTIONS.CASUAL:
      return 'Simplify the language and make it more conversational and accessible.';
    default:
      return 'Maintain the original tone and style.';
  }
}

/**
 * Parse JSON response from Gemini, handling potential formatting issues
 * @param {string} responseText - The raw response text
 * @returns {Object} - Parsed JSON object
 */
function parseGeminiResponse(responseText) {
  try {
    // Clean up the response text
    let cleanText = responseText.trim();
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to parse the JSON
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn('Failed to parse Gemini JSON response:', error);
    console.log('Raw response:', responseText);
    
    // Fallback: try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (fallbackError) {
        console.warn('Fallback JSON parsing also failed:', fallbackError);
      }
    }
    
    throw new Error('Unable to parse Gemini response as JSON');
  }
}

/**
 * Enhanced text expansion using Gemini with structured outputs
 * @param {string} selectedText - The text to expand
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for expansion
 * @returns {Promise<Object>} - Object containing expanded text and metadata
 */
export async function expandText(selectedText, fullContext = '', tone = TONE_OPTIONS.SAME_TONE) {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
    
    const prompt = `${NOVEL_WRITING_SYSTEM_PROMPT}

FULL DOCUMENT CONTEXT:
${fullContext}

TASK: Expand the following selected text to add more detail, depth, and narrative richness. Maintain story consistency and character voice.

SELECTED TEXT: "${selectedText}"

TONE INSTRUCTION: ${getToneInstruction(tone)}

Provide an expanded version that enhances the original while seamlessly fitting into the larger narrative.

Respond with a JSON object in this exact format:
{
  "expanded_text": "The expanded version of the selected text",
  "changes_made": ["List", "of", "specific", "enhancements", "made"],
  "tone_applied": "Description of the tone that was applied"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsedResult = parseGeminiResponse(responseText);
    
    return {
      success: true,
      result: parsedResult,
      original_text: selectedText,
      action: 'expand'
    };
  } catch (error) {
    console.group('✨ Gemini expandText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Tone:', tone);
    console.log('- Model:', 'gemini-2.5-flash-preview-05-20');
    console.groupEnd();
    
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Enhanced text rewriting using Gemini with structured outputs
 * @param {string} selectedText - The text to rewrite
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for rewriting
 * @returns {Promise<Object>} - Object containing rewritten text and metadata
 */
export async function rewriteText(selectedText, fullContext = '', tone = TONE_OPTIONS.IMPROVE_TONE) {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
    
    const prompt = `${NOVEL_WRITING_SYSTEM_PROMPT}

FULL DOCUMENT CONTEXT:
${fullContext}

TASK: Rewrite the following selected text to improve clarity, style, and overall quality while preserving the original meaning and intent.

SELECTED TEXT: "${selectedText}"

TONE INSTRUCTION: ${getToneInstruction(tone)}

Provide a rewritten version that enhances the prose while maintaining narrative consistency.

Respond with a JSON object in this exact format:
{
  "rewritten_text": "The rewritten version of the selected text",
  "improvements_made": ["List", "of", "specific", "improvements", "made"],
  "tone_applied": "Description of the tone that was applied"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsedResult = parseGeminiResponse(responseText);
    
    return {
      success: true,
      result: parsedResult,
      original_text: selectedText,
      action: 'rewrite'
    };
  } catch (error) {
    console.group('✨ Gemini rewriteText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Tone:', tone);
    console.log('- Model:', 'gemini-2.5-flash-preview-05-20');
    console.groupEnd();
    
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Text analysis using Gemini with structured outputs
 * @param {string} selectedText - The text to analyze
 * @param {string} fullContext - The full document context
 * @returns {Promise<Object>} - Object containing analysis results
 */
export async function describeText(selectedText, fullContext = '') {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
    
    const prompt = `${NOVEL_WRITING_SYSTEM_PROMPT}

FULL DOCUMENT CONTEXT:
${fullContext}

TASK: Provide a detailed analysis of the following selected text. Focus on writing techniques, narrative elements, character development, style, and areas for improvement.

SELECTED TEXT: "${selectedText}"

Analyze the text thoroughly and provide constructive feedback that helps the author improve their craft.

Respond with a JSON object in this exact format:
{
  "analysis": "Detailed analysis of the text's narrative and stylistic elements",
  "writing_techniques": ["List", "of", "writing", "techniques", "used"],
  "strengths": ["List", "of", "strong", "elements", "in", "the", "text"],
  "suggestions": ["List", "of", "specific", "improvement", "suggestions"],
  "overall_rating": "Brief overall assessment and rating"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsedResult = parseGeminiResponse(responseText);
    
    return {
      success: true,
      result: parsedResult,
      original_text: selectedText,
      action: 'describe'
    };
  } catch (error) {
    console.group('✨ Gemini describeText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Model:', 'gemini-2.5-flash-preview-05-20');
    console.groupEnd();
    
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Extract story entities from text using Gemini with structured outputs
 * @param {string} text - The text to analyze for entities
 * @returns {Promise<Object>} - Object containing all extracted entities
 */
export async function extractEntities(text) {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
    
    const prompt = `You are an expert story analyst specialized in extracting and categorizing story elements. Your task is to analyze text and identify all characters, locations, objects, organizations, events, themes, conflicts, and other narrative elements with high accuracy and detail.

Analyze the following story text and extract ALL types of story elements including characters, locations, objects, organizations, events, themes, conflicts, and more. Provide detailed information for each entity.

TEXT TO ANALYZE:
${text}

CRITICAL INSTRUCTIONS: 
- Extract FULL character names (e.g., "Kaelen Stormwright", "Seraphina Nightwhisper") not partial words
- Do NOT extract common words, pronouns, or fragments as characters
- Include all mentioned organizations, councils, academies, orders, etc.
- Identify key events, ceremonies, battles, disasters mentioned in the text
- Extract themes like sacrifice vs knowledge, loyalty, power, corruption, etc.
- Identify conflicts between characters or ideological conflicts
- Include magical/fantastical systems and their rules
- Note relationships between characters (master/student, rivals, etc.)
- Include historical events, laws, prophecies, and world-building lore
- Give confidence scores based on how clearly each entity is described
- Be thorough but accurate - only extract what's actually in the text

IMPORTANT: Respond with a JSON object in this exact format:
{
  "characters": [
    {
      "name": "Full character name",
      "description": "Physical description if mentioned",
      "personality": "Personality traits based on actions/dialogue",
      "background": "Background information from the text",
      "role": "protagonist/antagonist/supporting/minor",
      "age": "Age if mentioned or estimated",
      "pronouns": "he/him/she/her/they/them based on context",
      "traits": ["personality trait 1", "personality trait 2"],
      "confidence": 0.85
    }
  ],
  "locations": [
    {
      "name": "Location name",
      "type": "city/building/room/landmark/region/fantasy/other",
      "description": "Description of the location",
      "atmosphere": "Mood or feeling of the place",
      "significance": "Importance to the story",
      "confidence": 0.75
    }
  ],
  "objects": [
    {
      "name": "Object name",
      "type": "weapon/tool/document/treasure/furniture/magical/other",
      "description": "Description of the object",
      "significance": "Importance to the story",
      "confidence": 0.80
    }
  ],
  "organizations": [
    {
      "name": "Organization name",
      "type": "government/guild/academy/council/order/army/other",
      "description": "Description and purpose of the organization",
      "members": ["key member 1", "key member 2"],
      "confidence": 0.70
    }
  ],
  "events": [
    {
      "name": "Event name",
      "type": "battle/ceremony/disaster/discovery/meeting/other",
      "description": "What happened during this event",
      "timeframe": "When it occurred (past/present/future)",
      "significance": "Importance to the story",
      "confidence": 0.75
    }
  ],
  "magicSystems": [
    {
      "name": "Magic system name",
      "type": "hard/soft/divine/elemental/other",
      "description": "How the magic system works",
      "rules": "Limitations or costs of using magic",
      "confidence": 0.80
    }
  ],
  "themes": [
    {
      "name": "Theme name",
      "type": "major/minor/motif",
      "description": "How this theme is expressed in the story",
      "examples": ["example 1", "example 2"],
      "confidence": 0.65
    }
  ],
  "conflicts": [
    {
      "name": "Conflict name",
      "type": "internal/external/person-vs-person/person-vs-society/person-vs-nature/other",
      "description": "Description of the conflict",
      "parties": ["party 1", "party 2"],
      "stakes": "What's at risk",
      "confidence": 0.70
    }
  ],
  "lore": [
    {
      "title": "Lore item title",
      "type": "law/rule/legend/history/prophecy/tradition/other",
      "description": "Detailed description of this lore element",
      "significance": "Importance to the world/story",
      "confidence": 0.75
    }
  ],
  "scenes": [
    {
      "title": "Scene title or description",
      "location": "Where the scene takes place",
      "characters": ["character 1", "character 2"],
      "description": "What happens in this scene",
      "purpose": "Dramatic purpose of the scene",
      "confidence": 0.80
    }
  ],
  "relationships": [
    {
      "fromEntity": "First character/entity name",
      "toEntity": "Second character/entity name",
      "relationshipType": "mentor/student, enemy/rival, family, romantic, alliance, etc.",
      "description": "Description of their relationship",
      "confidence": 0.85
    }
  ],
  "timelines": [
    {
      "name": "Timeline name",
      "type": "historical/story/character/other",
      "description": "Description of this timeline or sequence",
      "events": ["event 1", "event 2"],
      "confidence": 0.70
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsedResult = parseGeminiResponse(responseText);
    
    return {
      success: true,
      result: parsedResult,
      action: 'extract_entities'
    };
  } catch (error) {
    console.group('🔍 Gemini extractEntities Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Text length:', text.length);
    console.log('- Model:', 'gemini-2.5-flash-preview-05-20');
    console.groupEnd();
    
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Check if Gemini API key is configured
 * @returns {boolean} - Whether the API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
} 