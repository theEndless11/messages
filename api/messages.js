const mongoose = require('mongoose');

const mongoose = require('mongoose');
const Message = require('../message');  // Assuming you have the 'message' model

// MongoDB URI should come from your environment variable (ensure you have it set)
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB (with retry logic if necessary)
const connectToDatabase = async () => {
    if (mongoose.connections[0].readyState) {
        return mongoose.connections[0];  // Reuse existing connection if available
    }
    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Handle GET requests to fetch messages from the database
module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            await connectToDatabase();  // Ensure the connection is established
            const messages = await Message.find();  // Fetch all messages
            res.status(200).json(messages);  // Send response as JSON
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};




