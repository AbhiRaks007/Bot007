// Google Gemini Pro API call helper
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GEMINI_API_KEY = process.env.API_KEY;
// Use the latest and most capable available model
const GEMINI_MODEL = 'models/gemini-2.5-pro';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// List available models for this API key
async function listGeminiModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Available Gemini models:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error listing Gemini models:', err);
  }
}

// Call this once on server start
listGeminiModels();

async function getGeminiResponse(userMsg) {
  const body = {
    contents: [{ parts: [{ text: userMsg }] }]
  };
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    // Log the full response for debugging
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text || '[No response]';
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      return '[Blocked: ' + data.promptFeedback.blockReason + ']';
    } else if (data.error) {
      // Show error message from Gemini API
      return '[Gemini API error: ' + (data.error.message || JSON.stringify(data.error)) + ']';
    } else {
      return '[No valid response from Gemini API]';
    }
  } catch (err) {
    console.error('Error contacting Gemini API:', err);
    return '[Error contacting Gemini API]';
  }
}

module.exports = { getGeminiResponse };
