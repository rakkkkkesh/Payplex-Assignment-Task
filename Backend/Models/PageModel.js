const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  mailId: { type: String, required: true },
  contact: { type: String, required: true },
  header: { type: String, required: true },
  text: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  logo: { type: String, required: true },
  bannerImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Page', PageSchema);