const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  //Total Mici received (likes)
  miciReceived: { type: Number, default: 0 }, 
  //Reference to the user who made the post
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);