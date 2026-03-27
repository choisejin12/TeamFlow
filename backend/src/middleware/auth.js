const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res,next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.sendStatus(401);
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.sendStatus(401).send('없는 유저입니다.');
        req.user = user;
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;