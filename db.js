const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sam13houston658:VH1FG6wgIQscWw11@cluster6580.hhh5h9a.mongodb.net/suggestionsDB?retryWrites=true&w=majority&appName=Cluster6580';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
