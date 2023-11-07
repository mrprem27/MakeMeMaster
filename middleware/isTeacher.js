const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    if (!req.cookies.tkn) {
        next();
    }
    else {
        try {
            try {
                const decodedToken = jwt.verify(req.cookies.tkn, SECRET_KEY);
                req.userId = decodedToken.user._id;
                req.isTeacher = decodedToken.user.isTeacher
            } catch (error) {
                console.log(error.message);
            }
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized ,access!!' });
        }
    }
}