"use strict";

var mongoose = require('mongoose'); // MongoDB Message Model


var messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    // Ensure the text is not empty
    maxlength: 500 // Limit length of the message (optional)

  },
  timestamp: {
    type: Date,
    "default": Date.now
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields

}); // Create the Message model based on the schema

var Message = mongoose.model('Message', messageSchema); // Export the Message model for use in other parts of the application

module.exports = Message;
//# sourceMappingURL=message.dev.js.map
