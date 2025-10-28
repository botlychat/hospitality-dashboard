/**
 * AI Service Module - Claude 3.5 Sonnet Integration
 * Handles all AI-related API calls for the hospitality dashboard
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // For development - move to backend in production
});

const MODEL = 'claude-3-5-sonnet-20241022';

/**
 * Get AI recommendation for guest inquiry
 * @param {string} context - User context or question
 * @param {Object} options - Additional options (units, pricing, etc.)
 * @returns {Promise<string>} AI response
 */
export async function getRecommendation(context, options = {}) {
  try {
    const systemPrompt = `You are a helpful AI assistant for a luxury hospitality business. 
You help guests find the perfect vacation rental unit and answer questions about bookings, amenities, and local recommendations.
Be friendly, professional, and concise. Focus on providing value to guests.`;

    const userPrompt = buildPrompt(context, options);

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('[AI Service] Error getting recommendation:', error);
    
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.status === 500) {
      throw new Error('AI service temporarily unavailable. Please try again.');
    }
    
    throw new Error('Failed to get AI recommendation. Please try again.');
  }
}

/**
 * Multi-turn chat conversation with AI
 * @param {Array} messages - Array of message objects [{role, content}]
 * @returns {Promise<string>} AI response
 */
export async function chat(messages) {
  try {
    const systemPrompt = `You are a helpful AI assistant for a luxury hospitality business.
Answer guest questions about bookings, units, amenities, policies, and local recommendations.
Be warm, professional, and helpful.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.8,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    });

    return message.content[0].text;
  } catch (error) {
    console.error('[AI Service] Error in chat:', error);
    throw new Error('Chat failed. Please try again.');
  }
}

/**
 * Analyze guest behavior patterns
 * @param {Object} guestData - Guest interaction data
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeGuestBehavior(guestData) {
  try {
    const prompt = `Analyze this guest data and provide insights:
${JSON.stringify(guestData, null, 2)}

Provide:
1. Key patterns in guest preferences
2. Recommended units for this guest
3. Optimal pricing strategy
4. Predicted booking likelihood (%)

Format as JSON.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const response = message.content[0].text;
    
    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch (e) {
      // If not valid JSON, return as text
      return { analysis: response };
    }
  } catch (error) {
    console.error('[AI Service] Error analyzing guest behavior:', error);
    throw new Error('Analysis failed. Please try again.');
  }
}

/**
 * Generate unit description
 * @param {Object} unitData - Unit information
 * @returns {Promise<string>} Generated description
 */
export async function generateUnitDescription(unitData) {
  try {
    const prompt = `Generate a compelling description for this vacation rental unit:
    
Name: ${unitData.name}
Type: ${unitData.type || 'Vacation Rental'}
Bedrooms: ${unitData.bedrooms || 'N/A'}
Bathrooms: ${unitData.bathrooms || 'N/A'}
Amenities: ${unitData.amenities?.join(', ') || 'Standard amenities'}
Location: ${unitData.location || 'Prime location'}

Write a 2-3 paragraph description that highlights the best features and appeals to luxury travelers.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      temperature: 0.9,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('[AI Service] Error generating description:', error);
    throw new Error('Description generation failed. Please try again.');
  }
}

/**
 * Get booking insights and recommendations
 * @param {Array} bookings - Array of booking objects
 * @returns {Promise<Object>} Insights and recommendations
 */
export async function getBookingInsights(bookings) {
  try {
    const prompt = `Analyze these bookings and provide actionable insights:
${JSON.stringify(bookings.slice(0, 50), null, 2)}

Provide:
1. Peak booking periods
2. Popular unit types
3. Average booking duration
4. Revenue optimization suggestions
5. Predicted demand for next 30 days

Format as JSON with clear sections.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      temperature: 0.4,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const response = message.content[0].text;
    
    try {
      return JSON.parse(response);
    } catch (e) {
      return { insights: response };
    }
  } catch (error) {
    console.error('[AI Service] Error getting booking insights:', error);
    throw new Error('Insights generation failed. Please try again.');
  }
}

/**
 * Build contextual prompt with available data
 * @private
 */
function buildPrompt(context, options) {
  let prompt = context;

  if (options.units && options.units.length > 0) {
    prompt += `\n\nAvailable units:\n${options.units.map(u => 
      `- ${u.name}: ${u.bedrooms} bed, ${u.bathrooms} bath, $${u.price}/night`
    ).join('\n')}`;
  }

  if (options.businessInfo) {
    prompt += `\n\nBusiness: ${options.businessInfo.name}`;
    if (options.businessInfo.location) {
      prompt += ` in ${options.businessInfo.location}`;
    }
  }

  return prompt;
}

/**
 * Check if AI service is configured
 * @returns {boolean} True if API key is available
 */
export function isConfigured() {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
}

/**
 * Get service status
 * @returns {Object} Status information
 */
export function getStatus() {
  return {
    configured: isConfigured(),
    model: MODEL,
    provider: 'Anthropic (Claude)'
  };
}
