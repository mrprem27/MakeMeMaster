const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Class = require('../models/class');

module.exports = async (req, res, next) => {
    const { userId, isTeacher } = req;
    let { id } = req.params;
    try {
        if (!isTeacher)
            throw new Error("error")
        const myClass = await Class.findById(id, 'teacher');
        //string and Obj id comparison
        if (myClass.teacher != userId)
            throw new Error("unAuthorized Access!!")
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ error: 'Unauthorized ,access!!' });
    }
}    