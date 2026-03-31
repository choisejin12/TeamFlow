const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: String, // 'NOTICE', 'MEMBER_ADD', 'TASK_COMPLETE' 등

  message: String, // "새로운 멤버가 추가되었습니다"

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Activity', activitySchema);