const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const async = require('async');
const auth = require('../middleware/auth');

// ▼▼▼▼ 로그인 API ▼▼▼▼
router.post('/login',async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).send("이메일을 찾을 수 없습니다.")
        }
        const isMatch = await user.comparePassword(req.body.password);
        if(!isMatch){
            return res.status(400).send("비밀번호가 올바르지 않습니다.")
        }
        const payload = {
            userId: user._id
        }

        const accessToken = jwt.sign(payload,process.env.JWT_SECRET, { expiresIn : '1h'})
        return res.json({user: {
        id: user._id,
        email: user.email,
        name: user.name,
        platformRole: user.platformRole
        },accessToken});
    }catch(err){
         return res.status(500).json({ error: err.message });
    }
})


// ▼▼▼▼ 회원가입 API ▼▼▼▼
router.post('/register', async (req,res,next) => {
    try{
        const { name, email, password } = req.body;
        const user = new User({
            name,
            email,
            password
        });
        await user.save();
        return res.status(200).json({success:true});

    }catch(err){
         return res.status(500).json({ error: err.message });
    }
})

// ▼▼▼▼ 인증 API ▼▼▼▼
router.get('/auth', auth, async (req,res) => { // auth 미들웨어가 먼저 실행됨 토큰 검증 후 req.user 사용 가능
    return res.status(200).json({ // 프론트에서 userData로 저장됨
        id: req.user._id,
        email: req.user.email,
        platformRole: req.user.platformRole,
        name: req.user.name,
        image: req.user.image,
    })
})


module.exports = router;