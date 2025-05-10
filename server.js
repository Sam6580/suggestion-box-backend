const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env file");
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
};
connectDB();

// Load Mongoose model
const Suggestion = require('./models/Suggestion');

// AI Reply Function
async function generateReply(userText, name = "Student", email = "your email") {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant replying on behalf of a college management team. Provide polite, professional, and student-focused responses. Thank the student, acknowledge their suggestion, and explain what steps may be taken. Always end by stating that an official reply will be sent via email soon, without calling the student's name."
          },
          {
            role: "user",
            content: `A student named ${name} (email: ${email}) submitted the following feedback: "${userText}". Please generate a formal response from the college management side.`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const baseReply = response.data.choices[0].message.content.trim();
    return `${baseReply}\n\nWe assure you that a detailed response will be sent to your college email shortly by our management team.`;
  } catch (error) {
    console.error("Error talking to OpenRouter:", error.response?.data || error.message);
    return "Thank you for your suggestion! We appreciate your input. Our management team will review it and respond to your email as soon as possible.";
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const users = [
    { username: 'admin', password: 'password123' },
    { username: 'user1', password: 'suggestionbox' }
  ];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const isAdmin = user.username === 'admin';
    res.json({ success: true, message: 'Login successful!', isAdmin });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Submit Suggestion
app.post('/suggestions', async (req, res) => {
  const { name, email, text } = req.body;

  try {
    const aiReply = await generateReply(text, name, email);

    const newSuggestion = new Suggestion({
      name,
      email,
      text,
      aiReply
    });

    await newSuggestion.save();
    res.status(201).json({ success: true, aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all suggestions
app.get('/suggestions', async (req, res) => {
  try {
    const allSuggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(allSuggestions);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
  }
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
