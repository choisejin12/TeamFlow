const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true });

// 🔥 TTL (자동 삭제)
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invite', inviteSchema);