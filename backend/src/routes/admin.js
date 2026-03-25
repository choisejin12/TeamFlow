const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Team = require('../models/Team');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//전체 유저 조회
router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.json({ users });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 유저 삭제
router.delete('/users/:userId', auth, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);

        res.json({ message: '팀 삭제 완료' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 전체 팀 조회
router.get('/teams', auth, admin, async (req, res) => {
    try {
        const teams = await Team.find();

        res.json({ teams });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 팀 삭제
router.delete('/teams/:teamId', auth, admin, async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.teamId);

        res.json({ message: '팀 삭제 완료' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//공지 생성
router.post('/notices', auth, admin, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: '제목 필요' });
        }
        const notice = new Notice({
            title,
            createdBy: req.user._id
        });

        await notice.save();

        res.status(201).json({
            message: '공지 생성 완료',
            notice
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//공지 조회
router.get('/notices', auth, async (req, res) => {
    try {
        const notices = await Notice.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({ notices });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//공지 삭제
router.delete('/notices/:id', auth, admin, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: '공지 없음' });
        }

        await notice.deleteOne();

        res.json({ message: '공지 삭제 완료' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;