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
 * Check if Gemini API key is configured
 * @returns {boolean} - Whether the API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
} 