require('dotenv').config({ path: './.env' });
app.use(express.static('public'));
const connectDB = require('./db');

// Call the function to connect
connectDB();



const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Load API key from .env
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// In-memory suggestions array
let suggestions = [];

// Helper function to generate AI reply
async function generateReply(userText, name = "Student", email = "your email") {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant replying on behalf of a college management team. Provide polite, professional, and student-focused responses. Thank the student, acknowledge their suggestion, and explain what steps may be taken. Always end by stating that an official reply will be sent via email soon,without calling the students name."
          },
          {
            role: "user",
            content: `A student named ${name} (email: ${email}) submitted the following feedback: "${userText}". Please generate a formal response from the college management side.`
          }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const baseReply = response.data.choices[0].message.content.trim();

    const finalReply = `${baseReply}\n\nWe assure you that a detailed response will be sent to your college email shortly by our management team.`;

    return finalReply;
  } catch (error) {
    console.error("Error talking to OpenRouter:", error.response ? error.response.data : error.message);
    
    // Just return a default fallback message
    return "Thank you for your suggestion! We appreciate your input. Our management team will review it and respond to your email as soon as possible.";
  }
}

/*async function generateReply(userText, name = "Student", email = "your email") {
  try {
    // console.log("Sending to AI:", { name, email, userText }); // Debug log

    // Dummy mock response to test the flow without hitting the API
    const baseReply = `Thank you ${name} for your feedback. We value your opinion and will review it promptly.`;

    const finalReply = `${baseReply}\n\nWe assure you that a detailed response will be sent to your college email shortly by our management team.`;

    return finalReply;
  } catch (error) {
    console.error("Error generating mock reply:", error.message);
    return "Something went wrong generating the reply.";
  }
}
*/


// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST - Login
/*app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const users = [
    { username: 'admin', password: 'password123' },
    { username: 'user1', password: 'suggestionbox' }
  ];

  const user = users.find(u => u.username === username && u.password === password);



  if (user) {
    res.json({ success: true, message: 'Login successful!' });
  } if (user) {
    const isAdmin = user.username === 'admin'; // Add this line
    res.json({ success: true, message: 'Login successful!', isAdmin }); // Send isAdmin in response
  }else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});*/
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




app.post('/suggestions', async (req, res) => {
  const { name, email, text } = req.body;

  // Corrected parameter order: userText, name, email
  const aiReply = await generateReply(text, name, email);

  const newSuggestion = {
    id: suggestions.length + 1,
    name,
    email,
    text,
    aiReply,
    impactScore: Math.floor(Math.random() * 3) + 1,
  };

  suggestions.push(newSuggestion);
  res.status(201).json(newSuggestion);
});

const Suggestion = require('./models/Suggestion'); // make sure the path is correct

app.post('/suggestions', async (req, res) => {
  const { name, email, text } = req.body;

  try {
    // Example AI reply — replace with your AI function later
    const aiReply = `Thank you, ${name}, for your suggestion: "${text}". We'll review it soon!`;

    const newSuggestion = new Suggestion({
      name,
      email,
      text,
      aiReply
    });

    await newSuggestion.save();

    res.json({ success: true, aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// GET - View Suggestions
app.get('/suggestions', (req, res) => {
  res.json(suggestions);
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
