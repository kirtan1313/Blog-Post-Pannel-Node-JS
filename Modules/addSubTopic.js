const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    subtopic: {
        type: String,
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',  
        required: true
    }
});

module.exports = mongoose.model('Subtopic', subtopicSchema);
