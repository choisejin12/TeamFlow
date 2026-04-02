const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Team = require('../models/Team');
const Notice = require('../models/Notice');
const Activity = require('../models/Activity');
const TeamMember = require('../models/TeamMember');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//전체 유저 조회
router.get('/users', auth, admin, async (req, res) => {
   
  try {
    const users = await User.aggregate([

      // ✅ 팀 개수 (최적화)
      {
        $lookup: {
          from: 'teammembers',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] }
              }
            },
            {
              $count: 'count'
            }
          ],
          as: 'teamCountArr'
        }
      },

      // ✅ task 개수 (최적화)
      {
        $lookup: {
          from: 'tasks',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$assigneeId', '$$userId'] }
              }
            },
            {
              $count: 'count'
            }
          ],
          as: 'taskCountArr'
        }
      },

      // ✅ count 추출 + 날짜 포맷
      {
        $addFields: {
          teamCount: {
            $ifNull: [{ $arrayElemAt: ['$teamCountArr.count', 0] }, 0]
          },
          taskCount: {
            $ifNull: [{ $arrayElemAt: ['$taskCountArr.count', 0] }, 0]
          },

            createdAt: {
            $dateToString: {
                format: "%Y-%m-%d",
                date: { $ifNull: ['$createdAt', new Date()] }
            }
            }
        }
      },

      // ✅ 불필요 데이터 제거
      {
        $project: {
          password: 0,
          teamCountArr: 0,
          taskCountArr: 0
        }
      }

    ]);

    res.json({ users });

  } catch (err) {
    console.error(" 에러:", err);  // 이거 추가
    res.status(500).json({ error: err.message });
  }
});

// 유저 삭제
router.delete('/users/:userId', auth, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);

        res.json({ message: '유저 삭제 완료' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 전체 팀 조회
router.get('/teams', auth, admin, async (req, res) => {
  try {
    const teams = await Team.aggregate([

      // ✅ 멤버 수
      {
        $lookup: {
          from: 'teammembers',
          let: { teamId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$teamId', '$$teamId'] }
              }
            },
            {
              $count: 'count'
            }
          ],
          as: 'memberCountArr'
        }
      },

      // ✅ task 수
      {
        $lookup: {
          from: 'tasks',
          let: { teamId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$teamId', '$$teamId'] }
              }
            },
            {
              $count: 'count'
            }
          ],
          as: 'taskCountArr'
        }
      },

      // ✅ 팀장 찾기
      {
        $lookup: {
          from: 'teammembers',
          let: { teamId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$teamId', '$$teamId'] },
                role: 'OWNER'
              }
            },
            { $limit: 1 } // 팀장은 1명 가정
          ],
          as: 'owner'
        }
      },

      // ✅ 팀장 user 정보 가져오기
      {
        $lookup: {
          from: 'users',
          localField: 'owner.userId',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },

      // ✅ 데이터 정리
      {
        $addFields: {
          memberCount: {
            $ifNull: [{ $arrayElemAt: ['$memberCountArr.count', 0] }, 0]
          },
          taskCount: {
            $ifNull: [{ $arrayElemAt: ['$taskCountArr.count', 0] }, 0]
          },

          ownerName: {
            $ifNull: [{ $arrayElemAt: ['$ownerInfo.name', 0] }, '없음']
          },

          createdAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        }
      },

      // ✅ 불필요 제거
      {
        $project: {
          memberCountArr: 0,
          taskCountArr: 0,
          owner: 0,
          ownerInfo: 0
        }
      }

    ]);

    res.json({ teams });

  } catch (err) {
    console.error(" teams 에러:", err);
    res.status(500).json({ error: err.message });
  }
});

// 팀 삭제
router.delete('/teams/:teamId', auth, admin, async (req, res) => {
    try {
        const { teamId } = req.params;
        
        await Team.findByIdAndDelete(req.params.teamId);

        await TeamMember.deleteMany({ 
            teamId: new mongoose.Types.ObjectId(teamId) 
        });

        res.json({ message: '팀 삭제 완료' });

    } catch (err) {
        console.error("팀 삭제 에러:", err);
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

        await Activity.create({
            type: 'NOTICE_CREATE',
            message: `새로운 공지사항이 등록되었습니다.`,
            userId: req.user._id
        });

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
        console.error(" notices 에러:", err);
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

//로그조회
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity
      .find()
      .populate('teamId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//search
router.get('/search', auth, admin, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json({ users: [], teams: [], notices: [] });

    const regex = new RegExp(q, 'i');

    // ✅ users (taskCount, teamCount 포함)
    const users = await User.aggregate([
      {
        $match: {
          $or: [{ name: regex }, { email: regex }]
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assigneeId',
          as: 'tasks'
        }
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: 'userId',
          as: 'teams'
        }
      },
      {
        $addFields: {
          taskCount: { $size: '$tasks' },
          teamCount: { $size: '$teams' }
        }
      },
      {
        $project: {
          password: 0,
          tasks: 0,
          teams: 0
        }
      },
      {
        $addFields: {
          createdAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        }
      },
      
    ]);

    // ✅ teams
    const teams = await Team.aggregate([
      { $match: { name: regex } },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: 'teamId',
          as: 'members'
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'teamId',
          as: 'tasks'
        }
      },
      {
        $addFields: {
          memberCount: { $size: '$members' },
          taskCount: { $size: '$tasks' }
        }
      },
      {
        $project: {
          members: 0,
          tasks: 0
        }
      }
    ]);

    // ✅ notices (이건 이미 ok)
    const notices = await Notice.find({
      title: regex
    }).populate('createdBy', 'name');

    res.json({ users, teams, notices });

  } catch (err) {
    console.error("search 에러:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;