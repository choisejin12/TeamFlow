const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');


//통계 조회
router.get('/stats', auth, async (req, res) => {
  try {
    console.log("🔥 stats 실행됨", req.user);
    const userId = req.user._id;
    console.log("req.userㄴㄴㄴㄴㄴ:", req.user);
    const total = await Task.countDocuments({ assigneeId: userId });
    const done = await Task.countDocuments({ assigneeId: userId, status: 'DONE' });
    const progress = await Task.countDocuments({ assigneeId: userId, status: 'IN_PROGRESS' });
    const todo = await Task.countDocuments({ assigneeId: userId, status: 'TODO' });

    res.json({
      total,
      done,
      progress,
      todo
    });

  } catch (err) {
    console.error("stats 에러",err); 
    res.status(500).json({ error: err.message });
  }
});

// 할일 생성
router.post('/', auth, async (req, res) => {
    try {
        const { teamId, title, dueDate } = req.body;

        if (!teamId || !title) {
            return res.status(400).json({ message: '필수값 없음' });
        }

        // 🔥 팀 멤버인지 확인
        const membership = await TeamMember.findOne({
            teamId,
            userId: req.user._id
        });

        if (!membership) {
            return res.status(403).json({ message: '팀에 속하지 않음' });
        }

        const task = new Task({
            teamId,
            title,
            dueDate,
            createdBy: req.user._id,
            assigneeId: req.user._id // 기본은 본인
        });

        await task.save();

        res.status(201).json({
            message: 'Task 생성 완료',
            task
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 할일 조회
router.get('/:teamId', auth, async (req, res) => {
    try {
        const { teamId } = req.params;

        const tasks = await Task.find({ teamId })
            .populate('assigneeId', 'name');

        res.json({ tasks });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 할일 수정
router.patch('/:taskId', auth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, status, dueDate, assigneeId } = req.body;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: 'Task 없음' });

        // 🔥 내 역할 확인
        const membership = await TeamMember.findOne({
            teamId: task.teamId,
            userId: req.user._id
        });

        if (!membership) {
            return res.status(403).json({ message: '권한 없음' });
        }

        // 🔥 권한 체크
        const isOwner = membership.role === 'OWNER';
        const isCreator = task.createdBy.toString() === req.user._id.toString();

        if (!isOwner && !isCreator) {
            return res.status(403).json({ message: '수정 권한 없음' });
        }

        // 🔥 수정
        if (title) task.title = title;
        if (status) task.status = status;
        if (dueDate) task.dueDate = dueDate;

        // 🔥 담당자 변경은 팀장만
        if (assigneeId && isOwner) {
            task.assigneeId = assigneeId;
        }

        await task.save();

        res.json({ message: '수정 완료', task });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 할일 삭제
router.delete('/:taskId', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) return res.status(404).json({ message: 'Task 없음' });

        const membership = await TeamMember.findOne({
            teamId: task.teamId,
            userId: req.user._id
        });

        const isOwner = membership?.role === 'OWNER';
        const isCreator = task.createdBy.toString() === req.user._id.toString();

        if (!isOwner && !isCreator) {
            return res.status(403).json({ message: '삭제 권한 없음' });
        }

        await task.deleteOne();

        res.json({ message: '삭제 완료' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;