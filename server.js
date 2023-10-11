// Importing Required Modules and Configurations:
const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URI = require('./config'); // Import the MongoDB URI
const { User, Thought, Reaction } = require('./models');
const app = express();
const PORT = 3001;
app.use(express.json());

// Establishing Database Connection:
mongoose.connect(MONGODB_URI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID with populated thoughts and friends
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove user's thoughts (BONUS)
    await Thought.deleteMany({ username: deletedUser.username });
    res.json({ message: 'User and associated thoughts deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a friend to a user's friend list
app.post('/api/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { $push: { friends: req.params.friendId } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a friend from a user's friend list
app.delete('/api/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all thoughts
app.get('/api/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single thought by ID
app.get('/api/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new thought
app.post('/api/thoughts', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    // Push the created thought's _id to the associated user's thoughts array
    await User.findByIdAndUpdate(thought.userId, { $push: { thoughts: thought._id } });
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a thought by ID
app.put('/api/thoughts/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a thought by ID
app.delete('/api/thoughts/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    // Remove the thought from the associated user's thoughts array 
    await User.findByIdAndUpdate(deletedThought.userId, { $pull: { thoughts: deletedThought._id } });
    res.json({ message: 'Thought deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a reaction for a thought
app.post('/api/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    thought.reactions.push(req.body);
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a reaction from a thought
app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    // Find the index of the reaction by reactionId and remove it
    const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === req.params.reactionId);
    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    thought.reactions.splice(reactionIndex, 1);
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});