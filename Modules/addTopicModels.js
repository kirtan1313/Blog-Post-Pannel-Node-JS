const mongoose = require('mongoose');


const addTopicSchema = new mongoose.Schema({
    topic: {
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('addTopicModel', addTopicSchema);
