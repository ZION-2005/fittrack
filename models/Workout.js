import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
    maxlength: [100, 'Workout name cannot be more than 100 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Legs', 'Arms', 'Cardio', 'Core', 'Back', 'Chest', 'Shoulders', 'Full Body', 'Other'],
    default: 'Other',
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Sets must be at least 1'],
    max: [50, 'Sets cannot be more than 50'],
  },
  reps: {
    type: Number,
    required: [true, 'Number of reps is required'],
    min: [1, 'Reps must be at least 1'],
    max: [1000, 'Reps cannot be more than 1000'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
    default: '',
  },
  referenceLink: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
workoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
