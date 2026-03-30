const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //"이 값은 User 컬렉션을 참조한다"
    },
    color: {
        type: String,
        default: '#94a3b8' // 기본 색
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
