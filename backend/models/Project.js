const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  members: {
    type: [String],
    default: []
  }, // [CR-00010] user_ids of collaborators
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);