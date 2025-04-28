const express = require('express');
const router = express.Router();
const { generateReply } = require('../utils/openrouter'); // We'll create this file for ChatGPT

// Temporary in-memory storage
let suggestions = [];

router.post('/', async (req, res) => {
  const { text } = req.body;

  const aiReply = await generateReply(text);

  const newSuggestion = {
    id: suggestions.length + 1,
    text,
    aiReply,
    impactScore: Math.floor(Math.random() * 3) + 1,
  };

  suggestions.push(newSuggestion);
  res.status(201).json(newSuggestion);
});

router.get('/', (req, res) => {
  res.json(suggestions);
});

module.exports = router;
