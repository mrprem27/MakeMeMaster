const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    if (!req.cookies.tkn) {
        return res.status(401).json({ error: 'Unauthorized ,access!!' });
    }
    try {
        const decodedToken = jwt.verify(req.cookies.tkn, SECRET_KEY);
        req.userId = decodedToken.user._id;
        req.isTeacher=decodedToken.user.isTeacher
        req.username=decodedToken.user.username
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized ,access!!' });
    }
}