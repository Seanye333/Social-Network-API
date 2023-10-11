// Import mongoose lib
const mongoose = require('mongoose');
// Create a new mongoose Schema object 
const Schema = mongoose.Schema;

// Defining the userSchema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^.+@.+\..+$/, 'Please enter a valid email address']
  },
//  An array of ObjectIds that reference the Thought model. This establishes a relationship between the User and Thought models in a MongoDB database.
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
//   Virtual properties are properties that are not stored in the database but are computed on the fly when you access them. 
// In this case, friendCount returns the number of friends a user has by counting the length of the friends array.
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

// defines a virtual property called friendCount
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// creates a Mongoose model named User based on the userSchema.
const User = mongoose.model('User', userSchema);

// exports the User model, making it available for other parts of the application to use.
module.exports = User;
