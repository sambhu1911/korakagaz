const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);