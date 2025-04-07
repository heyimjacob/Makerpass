/**
 * Bio Generator Module
 * 
 * Handles bio generation using the OpenAI API based on scraped content.
 */

const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a bio based on scraped content from links
 * @param {Array} links Array of link objects with scraped content
 * @param {Object} options Configuration options
 * @param {string} options.tone Tone of the bio (professional, casual, etc.)
 * @param {number} options.maxLength Maximum length of the bio in characters
 * @param {string} options.name Name to use in the bio (optional)
 * @returns {Promise<string>} Generated bio text
 */
async function generateBio(links, options = {}) {
  if (!links || !Array.isArray(links) || links.length === 0) {
    throw new Error('Links array is required and must not be empty');
  }

  const {
    tone = 'professional',
    maxLength = 500,
    name = ''
  } = options;

  // Extract content from links
  const contentSummaries = links.map(link => ({
    title: link.title,
    url: link.url,
    content: link.contentSummary,
    commentary: link.commentary
  }));

  // Prepare prompt
  const prompt = createPrompt(contentSummaries, {
    tone,
    maxLength,
    name
  });

  try {
    // Generate bio using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional biography writer. Create a ${tone} bio based on the content provided. The bio should be concise (maximum ${maxLength} characters) and highlight the most important aspects that define the person based on their content.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: Math.ceil(maxLength / 2), // Rough estimate of tokens needed
      temperature: 0.7
    });

    const bioText = completion.choices[0]?.message?.content || '';
    
    // Clean up any markdown or unnecessary formatting
    return bioText.trim();
  } catch (error) {
    console.error('Error generating bio:', error);
    throw new Error(`Failed to generate bio: ${error.message}`);
  }
}

/**
 * Create a prompt for the OpenAI API based on scraped content
 * @param {Array} contentSummaries Array of content summaries from links
 * @param {Object} options Configuration options
 * @returns {string} Formatted prompt
 */
function createPrompt(contentSummaries, options) {
  const { name, tone, maxLength } = options;
  
  const nameSection = name ? `for ${name}` : '';
  
  let prompt = `Please write a ${tone} biography ${nameSection} based on the following content from their online presence. The bio should be no more than ${maxLength} characters.\n\n`;
  
  // Add content summaries
  contentSummaries.forEach((item, index) => {
    prompt += `CONTENT ${index + 1} - ${item.title || 'Untitled'} (${item.url}):\n`;
    if (item.commentary) {
      prompt += `USER COMMENTARY: ${item.commentary}\n`;
    }
    prompt += `CONTENT: ${item.content}\n\n`;
  });
  
  prompt += `Based only on the information provided above, write a concise bio that captures the essence of the person's online presence, work, interests, and expertise. The bio should read naturally and not list URLs or mention the sources directly. Pay special attention to the user's commentary about their roles and experiences.`;
  
  return prompt;
}

module.exports = {
  generateBio
}; 