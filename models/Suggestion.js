const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  text: { type: String, required: true },
  aiReply: { type: String },
  manualReply: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
