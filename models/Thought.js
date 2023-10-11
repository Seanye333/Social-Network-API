// Import mongoose lib
const mongoose = require('mongoose');
// Create a new mongoose Schema object 
const Schema = mongoose.Schema;

// Defining the reactionSchema
const reactionSchema = new Schema({
// unique identifier for the reaction
    reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true
  },
// content of the reaction
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
// Author 
  username: {
    type: String,
    required: true
  },
// timestamp when the reaction was created 
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => createdAtVal.toISOString()
  }
});

// Defining the thoughtSchema
const thoughtSchema = new Schema({
// content of the thought
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
// create timestamp
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => createdAtVal.toISOString()
  },
// author who posted thought
  username: {
    type: String,
    required: true
  },
// an array of reactionSchema objects representing reactions associated with the thought
  reactions: [reactionSchema]
});

// defines a virtual property called reactionCount
// reactionCount returns the number of reactions associated with the thought by counting the length of the reactions array.
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// creates a Mongoose model named Thought based on the thoughtSchema.
const Thought = mongoose.model('Thought', thoughtSchema);

// exports the Thought model, making it available for other parts of the application to use.
module.exports = Thought;
