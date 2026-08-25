// Script generation service abstraction
// Requires an LLM API key.

export function isScriptGeneratorConfigured() {
  return Boolean(import.meta.env.VITE_LLM_API_KEY || import.meta.env.VITE_AI_API_URL);
}

export async function generateScript(prompt, options = {}) {
  const apiKey = import.meta.env.VITE_LLM_API_KEY;
  const apiUrl = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    throw new Error('AI script generation not configured. Set VITE_LLM_API_KEY in your environment.');
  }

  // Integration point for LLM (OpenAI, Anthropic, etc.)
  // const response = await fetch(apiUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: options.model || 'gpt-4',
  //     messages: [
  //       { role: 'system', content: 'You are a professional video script writer.' },
  //       { role: 'user', content: prompt },
  //     ],
  //   }),
  // });
  // return response.json();

  throw new Error('Script generation backend not yet connected. Configure your LLM provider.');
}

export async function generateVideoSummary(projectData) {
  if (!isScriptGeneratorConfigured()) {
    throw new Error('AI service not configured. Set VITE_LLM_API_KEY.');
  }
  throw new Error('Video summary backend not yet connected.');
}
