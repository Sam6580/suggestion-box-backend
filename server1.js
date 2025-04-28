const OpenAI = require('openai');

// Replace 'YOUR_API_KEY' with your actual key
const openai = new OpenAI({
  apiKey: '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',
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// api function
async function generateReply(userText) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // or 'gpt-4' if you have access
        messages: [
          { role: 'system', content: 'You are a helpful suggestion box assistant.' },
          { role: 'user', content: userText },
        ],
        max_tokens: 100,
      });
      console.log(response.data.choices[0].message.content.trim());
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error talking to OpenAI:', error);
      return "Thank you for your suggestion! We appreciate your input.";
    }
}

  

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Temporary in-memory storage
let suggestions = [];

// POST API - Submit Suggestion
app.post('/suggestions', async (req, res) => {
    const { text } = req.body;
  
    const aiReply = await generateReply(text);
  
    const newSuggestion = {
      id: suggestions.length + 1,
      text: text,
      aiReply: aiReply,
      impactScore: Math.floor(Math.random() * 3) + 1,
    };
  
// GET API - View All Suggestions
app.get('/suggestions', (req, res) => {
    res.json(suggestions);
  });
  
    suggestions.push(newSuggestion);
    res.status(201).json(newSuggestion);
  });
  

// Server Listening
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
