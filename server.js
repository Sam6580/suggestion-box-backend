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


  

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// server.js
const express = require('express');
const app = express();
// Removed duplicate declaration of port

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = [
        { username: 'admin', password: 'password123' },
        { username: 'user1', password: 'suggestionbox' }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

  

// Server Listening
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
