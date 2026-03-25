const admin = (req, res, next) => {
    if (!req.user || req.user.platformRole !== 'ADMIN') {
        return res.status(403).json({ message: '관리자만 접근 가능' });
    }

    next();
};

module.exports = admin;