require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, required: true },
  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Update points endpoint
app.post('/api/points', async (req, res) => {
  try {
    const { firebaseUid, points } = req.body;
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      user = new User({ firebaseUid, points: 0 });
    }
    
    user.points = Math.max(0, points);
    await user.save();
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get points endpoint
app.get('/api/points/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.json({ points: 0 });
    }
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 