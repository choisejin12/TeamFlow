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
    createAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
