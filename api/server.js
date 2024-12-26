require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const Message = require('./message'); // Assuming you have a Message model
const app = express();
const Ably = require('ably');
const cors = require('cors');
const port = process.env.PORT || 3000;  // The port should be set to 3000, where your frontend will connect

// Enable CORS (Cross-Origin Resource Sharing) for your frontend domain
const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with the URL of your frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));  // Allow cross-origin requests

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Initialize Ably connection
const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
const publicChannel = ably.channels.get('chat');

// Listen for new messages on the public chat and save them to MongoDB
publicChannel.subscribe('message', async (message) => {
    const newMessage = new Message({ text: message.data.text });
    try {
        await newMessage.save();
        console.log('Message saved to DB:', message.data.text);
    } catch (err) {
        console.error('Error saving message to DB:', err);
    }
});

// API to get all messages from the MongoDB database
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();  // Fetch all messages from MongoDB
        console.log('Fetched messages from DB:', messages);  // Log messages for debugging
        res.json(messages);  // Send messages as JSON response
    } catch (error) {
        console.error('Error fetching messages:', error);  // Log error
        res.status(500).json({ error: 'Failed to fetch messages' });  // Return error if any
    }
});

// Middleware and static file serving
app.use(express.json());  // Parse incoming JSON requests
app.use(express.static('public'));  // Serve static files like HTML, JS

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);  // Corrected the log message
});








