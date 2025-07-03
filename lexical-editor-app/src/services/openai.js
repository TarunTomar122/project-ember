import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage in development
});

// System prompt for novel writing assistant
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

Focus on creating immersive, engaging prose that elevates the author's vision while respecting their creative intent.`;

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
 * Enhanced text expansion using OpenAI with structured outputs
 * @param {string} selectedText - The text to expand
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for expansion
 * @returns {Promise<Object>} - Object containing expanded text and metadata
 */
export async function expandText(selectedText, fullContext = '', tone = TONE_OPTIONS.SAME_TONE) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: NOVEL_WRITING_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `FULL DOCUMENT CONTEXT:\n${fullContext}\n\nTASK: Expand the following selected text to add more detail, depth, and narrative richness. Maintain story consistency and character voice.\n\nSELECTED TEXT: "${selectedText}"\n\nTONE INSTRUCTION: ${getToneInstruction(tone)}\n\nProvide an expanded version that enhances the original while seamlessly fitting into the larger narrative.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "text_expansion",
          schema: {
            type: "object",
            properties: {
              expanded_text: {
                type: "string",
                description: "The expanded version of the selected text"
              },
              changes_made: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of specific enhancements made to the text"
              },
              tone_applied: {
                type: "string",
                description: "The tone that was applied to the expansion"
              }
            },
            required: ["expanded_text", "changes_made", "tone_applied"],
            additionalProperties: false
          },
          strict: true
        }
      },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      result: result,
      original_text: selectedText,
      action: 'expand'
    };
  } catch (error) {
    console.group('✨ OpenAI expandText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Tone:', tone);
    console.log('- Model:', "gpt-4.1-nano-2025-04-14");
    
    if (error.response) {
      console.error('API Response status:', error.response.status);
      console.error('API Response data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request details:', error.request);
    }
    
    console.groupEnd();
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

/**
 * Enhanced text rewriting using OpenAI with structured outputs
 * @param {string} selectedText - The text to rewrite
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for rewriting
 * @returns {Promise<Object>} - Object containing rewritten text and metadata
 */
export async function rewriteText(selectedText, fullContext = '', tone = TONE_OPTIONS.IMPROVE_TONE) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: NOVEL_WRITING_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `FULL DOCUMENT CONTEXT:\n${fullContext}\n\nTASK: Rewrite the following selected text to improve clarity, style, and overall quality while preserving the original meaning and intent.\n\nSELECTED TEXT: "${selectedText}"\n\nTONE INSTRUCTION: ${getToneInstruction(tone)}\n\nProvide a rewritten version that enhances the prose while maintaining narrative consistency.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "text_rewrite",
          schema: {
            type: "object",
            properties: {
              rewritten_text: {
                type: "string",
                description: "The rewritten version of the selected text"
              },
              improvements_made: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of specific improvements made to the text"
              },
              tone_applied: {
                type: "string",
                description: "The tone that was applied to the rewrite"
              }
            },
            required: ["rewritten_text", "improvements_made", "tone_applied"],
            additionalProperties: false
          },
          strict: true
        }
      },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      result: result,
      original_text: selectedText,
      action: 'rewrite'
    };
  } catch (error) {
    console.group('✏️ OpenAI rewriteText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Tone:', tone);
    console.log('- Model:', "gpt-4.1-nano-2025-04-14");
    
    if (error.response) {
      console.error('API Response status:', error.response.status);
      console.error('API Response data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request details:', error.request);
    }
    
    console.groupEnd();
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

/**
 * Text description and analysis using OpenAI with structured outputs
 * @param {string} selectedText - The text to describe/analyze
 * @param {string} fullContext - The full document context
 * @returns {Promise<Object>} - Object containing analysis and suggestions
 */
export async function describeText(selectedText, fullContext = '') {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: NOVEL_WRITING_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `FULL DOCUMENT CONTEXT:\n${fullContext}\n\nTASK: Provide a detailed analysis and description of the following selected text. Include writing techniques used, strengths, areas for improvement, and specific suggestions.\n\nSELECTED TEXT: "${selectedText}"\n\nProvide comprehensive feedback that will help the author improve their craft.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "text_analysis",
          schema: {
            type: "object",
            properties: {
              analysis: {
                type: "string",
                description: "Detailed analysis of the selected text"
              },
              writing_techniques: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of writing techniques identified in the text"
              },
              strengths: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of strengths in the writing"
              },
              suggestions: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of specific suggestions for improvement"
              },
              overall_rating: {
                type: "string",
                description: "Overall assessment of the text quality"
              }
            },
            required: ["analysis", "writing_techniques", "strengths", "suggestions", "overall_rating"],
            additionalProperties: false
          },
          strict: true
        }
      },
      max_tokens: 1000,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      result: result,
      original_text: selectedText,
      action: 'describe'
    };
  } catch (error) {
    console.group('🔍 OpenAI describeText Error Details');
    console.error('Raw error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.log('Request details:');
    console.log('- Selected text length:', selectedText.length);
    console.log('- Full context length:', fullContext.length);
    console.log('- Model:', "gpt-4.1-nano-2025-04-14");
    
    if (error.response) {
      console.error('API Response status:', error.response.status);
      console.error('API Response data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request details:', error.request);
    }
    
    console.groupEnd();
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

/**
 * Get tone instruction for the AI based on selected tone
 * @param {string} tone - The tone option
 * @returns {string} - Detailed instruction for the tone
 */
function getToneInstruction(tone) {
  switch (tone) {
    case TONE_OPTIONS.SAME_TONE:
      return "Maintain the exact same writing style, voice, and emotional tone as the original text. Keep all stylistic elements consistent.";
    case TONE_OPTIONS.IMPROVE_TONE:
      return "Enhance the existing tone while keeping the same general style. Make it more engaging, polished, and emotionally resonant without changing the fundamental character.";
    case TONE_OPTIONS.DRAMATIC:
      return "Increase the tension, stakes, and emotional intensity. Use more powerful language, heightened emotions, and dramatic pacing.";
    case TONE_OPTIONS.LIGHTHEARTED:
      return "Make the text more playful, humorous, or optimistic. Add levity while maintaining the core message.";
    case TONE_OPTIONS.FORMAL:
      return "Use more sophisticated vocabulary, complex sentence structures, and formal literary language. Elevate the prose style.";
    case TONE_OPTIONS.CASUAL:
      return "Simplify the language and make it more conversational and accessible. Use everyday language and shorter sentences.";
    default:
      return "Maintain the existing tone and style of the text.";
  }
}

/**
 * Check if OpenAI API key is configured
 * @returns {boolean} - Whether the API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
} 