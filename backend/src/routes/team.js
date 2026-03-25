const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const Task = require('../models/Task');


// 팀 생성
router.post('/', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: '팀 이름 필요' });
        }
        // 1. 팀 생성
        const team = new Team({
            name,
            description,
            createdBy: req.user._id
        });
        await team.save();
        // 2. 만든 사람을 OWNER로 등록
        const teamMember = new TeamMember({
            teamId: team._id,
            userId: req.user._id,
            role: 'OWNER'
        });

        await teamMember.save();
        res.status(201).json({
            message: '팀 생성 성공',
            team
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 내가 속한 팀 목록
router.get('/', auth, async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({
            userId: req.user._id
        }).populate('teamId');

        const teams = teamMembers.map(tm => ({
            teamId: tm.teamId._id,
            name: tm.teamId.name,
            description: tm.teamId.description,
            role: tm.role
        }));
        res.json({ teams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔥 팀 상세 조회
router.get('/:teamId', auth, async (req, res) => {
    try {
        const { teamId } = req.params;

        // 1. 팀 확인
        const team = await Team.findById(teamId);
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

        const memberList = members.map(m => ({
            userId: m.userId._id,
            name: m.userId.name,
            email: m.userId.email,
            role: m.role
        }));

        // 🔥 4. 내 할일
        const myTasks = await Task.find({
            teamId,
            createdBy: req.user._id
        });

        // 🔥 5. 팀 할일
        const teamTasks = await Task.find({ teamId })
            .populate('assigneeId', 'name');

        res.json({
            team: {
                id: team._id,
                name: team.name,
                description: team.description,
                myRole: myMembership.role
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
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;