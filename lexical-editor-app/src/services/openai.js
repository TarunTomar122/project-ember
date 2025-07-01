import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage in development
});

/**
 * Expands the given text using OpenAI
 * @param {string} selectedText - The text to expand
 * @returns {Promise<string>} - The expanded text
 */
export async function expandText(selectedText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful writing assistant. Your task is to expand the given text by adding more detail, context, and explanation while maintaining the original meaning and tone. Make the text more comprehensive and informative."
        },
        {
          role: "user",
          content: `Please expand this text: "${selectedText}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    console.log('response');
    console.log(response);

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.log('Error expanding text:', error);
    throw new Error('Failed to expand text. Please try again.');
  }
}

/**
 * Check if OpenAI API key is configured
 * @returns {boolean} - Whether the API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
} 