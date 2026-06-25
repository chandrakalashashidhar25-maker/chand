const mongoose = require('mongoose');

const TrimesterSchema = new mongoose.Schema({
  files: [{ type: String }], // file paths
  uploadedAt: { type: Date, default: Date.now }
});

const PlantSchema = new mongoose.Schema({
  plantName: { type: String, required: true },
  date: { type: Date, required: true },
  report: { type: String, default: '' },
  // Initial upload files (photos/videos)
  files: [{ type: String }],
  // Trimesters
  trimester1: TrimesterSchema,
  trimester2: TrimesterSchema,
  trimester3: TrimesterSchema,
  trimester4: TrimesterSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plant', PlantSchema);
