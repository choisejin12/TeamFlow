const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// 내가 속한 팀 목록
router.get('/', auth, async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({
            userId: req.user._id
        }).populate('teamId');

        const teams = teamMembers
        .filter(tm => tm.teamId)
        .map(tm => ({
            teamId: tm.teamId._id,
            name: tm.teamId.name,
            description: tm.teamId.description,
            role: tm.role,
            color: tm.teamId.color
        }));
        res.json({ teams });
    } catch (err) {
        console.error('🔥 ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

// 팀 생성
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        if (!name) {
            return res.status(400).json({ message: '팀 이름 필요' });
        }
        // 1. 팀 생성
        const team = new Team({
            name,
            description,
            createdBy: req.user._id,
            color
        });
        await team.save();
        // 2. 만든 사람을 OWNER로 등록
        const teamMember = new TeamMember({
            teamId: team._id,
            userId: req.user._id,
            role: 'OWNER'
        });

        await teamMember.save();

        await Activity.create({
            type: 'TEAM_CREATE',
            message: `${req.user.name}님이 팀을 생성했습니다.`,
            userId: req.user._id,
            teamId: team._id
        });

        res.status(201).json({
            message: '팀 생성 성공',
            team
        });
    } catch (err) {
        console.error('🔥 ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});





// 🔥 팀 상세 조회
router.get('/:teamId', auth, async (req, res) => {
    try {
        const { teamId } = req.params;

        // 1. 팀 확인
        const team = await Team.findById(teamId);
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ message: '잘못된 teamId' });
        }
        if (!team) return res.status(404).json({ message: '팀 없음' });

        // 2. 권한 체크
        const myMembership = await TeamMember.findOne({
            teamId,
            userId: req.user._id
        });

        if (!myMembership) {
            return res.status(403).json({ message: '접근 불가' });
        }

        // 3. 멤버 조회
        const members = await TeamMember.find({ teamId })
            .populate('userId', 'name email');

        const memberList = members
        .filter(m => m.userId)
        .map(m => ({
            userId: m.userId._id,
            name: m.userId.name,
            email: m.userId.email,
            role: m.role
        }));

        // 🔥 4. 내 할일
        const myTasks = await Task.find({
            teamId,
            assigneeId: req.user._id
        });

        // 🔥 5. 팀 할일
        const teamTasks = await Task.find({
            teamId,
            assigneeId: { $ne: req.user._id } 
        }).populate('assigneeId', 'name');

        res.json({
            team: {
                _id: team._id,
                name: team.name,
                description: team.description,
                myRole: myMembership.role,
                color: team.color
            },
            members: memberList,
            myTasks: myTasks.map(t => ({
                taskId: t._id,
                title: t.title,
                status: t.status,
                dueDate: t.dueDate
            })),
            teamTasks: teamTasks.map(t => ({
                taskId: t._id,
                title: t.title,
                status: t.status,
                assignee: {
                    name: t.assigneeId?.name
                },
                dueDate: t.dueDate
            }))
        });

    } catch (err) {
        console.error('🔥 ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;