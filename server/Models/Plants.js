import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  blenderModel: {
    type: String,
    required: true
  },
  plantImage: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Plant = mongoose.model('Plant', plantSchema)
export default Plant;