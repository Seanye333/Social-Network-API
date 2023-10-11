const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the reactionSchema
const reactionSchema = new Schema({
//   automatically generated MongoDB ObjectId for the reaction.
    reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true
  },
//   A string representing the content of the reaction, which is required and limited to 280 characters.
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => createdAtVal.toISOString()
  }
});

// creates a Mongoose model named Reaction based on the reactionSchema.
const Reaction = mongoose.model('Reaction', reactionSchema);

// the Reaction model is exported, making it available for other parts of the application to use. 
module.exports = Reaction;
