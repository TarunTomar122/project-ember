import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
let genAI = null;
if (import.meta.env.VITE_GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
}

/**
 * Expands the given text using Gemini
 * @param {string} selectedText - The text to expand
 * @returns {Promise<string>} - The expanded text
 */
export async function expandText(selectedText) {
  try {
    if (!genAI) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are a helpful writing assistant. Your task is to expand the given text by adding more detail, context, and explanation while maintaining the original meaning and tone. Make the text more comprehensive and informative.

    Please expand this text: "${selectedText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text().trim();
  } catch (error) {
    console.log('Error expanding text with Gemini:', error);
    throw new Error('Failed to expand text with Gemini. Please try again.');
  }
}

/**
 * Check if Gemini API key is configured
 * @returns {boolean} - Whether the API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
} 