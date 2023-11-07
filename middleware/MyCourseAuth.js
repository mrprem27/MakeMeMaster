const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Course = require('../models/course');

module.exports = async (req, res, next) => {
    const { userId, isTeacher } = req;
    let { id } = req.params;
    if (!id) id = req.body.courseId
    try {
        if (!isTeacher)
            throw new Error("error")
        const myCourse = await Course.findById(id, 'teacher');
        console.log(myCourse, userId);
        if (myCourse.teacher != userId)
            //string and Obj id comparison
            throw new Error("unAuthorized Access!!")
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized ,access!!' });
    }
}    