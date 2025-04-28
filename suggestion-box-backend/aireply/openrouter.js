const axios = require('axios');

// Your OpenRouter API Key
const OPENROUTER_API_KEY = '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';

async function generateReply(userText) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",  // You can even use gpt-4, claude, etc.
        messages: [
          { role: "system", content: "You are a helpful suggestion box assistant." },
          { role: "user", content: userText }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Raw response:", response.data);
    return response.data.choices[0].message.content.trim();
    console.log("we assure to get back to u with a proper reply from the management team");
    
  } catch (error) {
    console.error("Error talking to OpenRouter:", error.response ? error.response.data : error.message);
    return "Thank you for your suggestion! We appreciate your input.";
  }
}