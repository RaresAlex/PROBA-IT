const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  miciBalance: { type: Number, default: 5 }, 
  grillSetup: { type: String, default: "MID Gratar" }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);