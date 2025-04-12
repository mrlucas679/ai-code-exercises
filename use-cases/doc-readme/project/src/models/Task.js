const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
    default: 'TODO'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  dueDate: {
    type: Date
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Find tasks that are due soon
taskSchema.statics.findDueSoon = function(days = 1) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.find({
    dueDate: { $gte: today, $lte: futureDate },
    reminderSent: false,
    status: { $ne: 'DONE' }
  }).populate('assignedTo', 'name email');
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;