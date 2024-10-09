const mongoose = require('mongoose');


const addTopicSchema = new mongoose.Schema({
    topic: {
        type: String, 
        required: true 
    },
    userId: {  // Reference to the user who created the topic
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('addTopicModel', addTopicSchema);
