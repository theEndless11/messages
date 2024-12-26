"use strict";

require('dotenv').config(); // Load environment variables


var express = require('express');

var mongoose = require('mongoose');

var Message = require('./message'); // Assuming you have a Message model


var app = express();

var Ably = require('ably');

var cors = require('cors');

var port = process.env.PORT || 3000; // The port should be set to 3000, where your frontend will connect
// Enable CORS (Cross-Origin Resource Sharing) for your frontend domain

var corsOptions = {
  origin: 'http://localhost:3000',
  // Replace with the URL of your frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions)); // Allow cross-origin requests
// Connect to MongoDB

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.log('MongoDB connection error:', err);
}); // Initialize Ably connection

var ably = new Ably.Realtime({
  key: process.env.ABLY_API_KEY
});
var publicChannel = ably.channels.get('chat'); // Listen for new messages on the public chat and save them to MongoDB

publicChannel.subscribe('message', function _callee(message) {
  var newMessage;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newMessage = new Message({
            text: message.data.text
          });
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(newMessage.save());

        case 4:
          console.log('Message saved to DB:', message.data.text);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error('Error saving message to DB:', _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}); // API to get all messages from the MongoDB database

app.get('/messages', function _callee2(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Message.find());

        case 3:
          messages = _context2.sent;
          // Fetch all messages from MongoDB
          console.log('Fetched messages from DB:', messages); // Log messages for debugging

          res.json(messages); // Send messages as JSON response

          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching messages:', _context2.t0); // Log error

          res.status(500).json({
            error: 'Failed to fetch messages'
          }); // Return error if any

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Middleware and static file serving

app.use(express.json()); // Parse incoming JSON requests

app.use(express["static"]('public')); // Serve static files like HTML, JS
// Start server

app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port)); // Corrected the log message
});
//# sourceMappingURL=server.dev.js.map
