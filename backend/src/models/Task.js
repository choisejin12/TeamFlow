const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    dueDate: {
        type: Date
    },
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


// 🔥 인덱스 (성능 중요)
taskSchema.index({ teamId: 1, status: 1 });
taskSchema.index({ teamId: 1, assigneeId: 1 });
taskSchema.index({ teamId: 1, dueDate: 1 });
taskSchema.index({ assigneeId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);