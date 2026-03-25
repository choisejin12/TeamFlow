// routes/invite.js
const express = require('express');
const router = express.Router();
const Invite = require('../models/Invite');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');


// 팀 가입
router.post('/join', auth, async (req, res) => {
    try {
        const { code } = req.body;

        const invite = await Invite.findOne({ code });

        if (!invite) {
            return res.status(400).json({ message: '유효하지 않은 코드' });
        }

        // 🔥 이미 가입했는지 체크
        const exists = await TeamMember.findOne({
            teamId: invite.teamId,
            userId: req.user._id
        });

        if (exists) {
            return res.status(400).json({ message: '이미 가입된 팀' });
        }

        // 🔥 팀 가입
        const member = new TeamMember({
            teamId: invite.teamId,
            userId: req.user._id,
            role: 'MEMBER'
        });

        await member.save();

        res.json({
            message: '팀 가입 성공',
            teamId: invite.teamId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔥 코드 생성
router.post('/:teamId', auth, async (req, res) => {
    try {
        const { teamId } = req.params;

        // 🔥 팀장 확인
        const membership = await TeamMember.findOne({
            teamId,
            userId: req.user._id
        });

        if (!membership || membership.role !== 'OWNER') {
            return res.status(403).json({ message: '팀장만 가능' });
        }

        // 🔥 코드 생성 (랜덤)
        const code = Math.random().toString(36).substring(2, 8);

        const invite = new Invite({
            teamId,
            code,
            createdBy: req.user._id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1시간
        });

        await invite.save();

        res.json({
            message: '초대코드 생성',
            code
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;