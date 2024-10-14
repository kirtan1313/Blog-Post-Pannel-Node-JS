const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    path: String,
    userEmail: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Referencing comments
});

module.exports = mongoose.model('Blog', blogSchema);
