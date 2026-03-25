const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: String,
        enum: ['OWNER', 'MEMBER'],
        default: 'MEMBER'
    },
    joinedAt: Date
}, { timestamps: true });

// 중복 가입 방지
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);

