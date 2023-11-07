const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Class = require('../models/class');

module.exports = async (req, res, next) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        const people = await Class.findById(id, 'students teacher');
        // console.log(people,userId);
        if (!people.students.includes(userId) && (people.teacher != userId))
            throw new Error("Error UnAuthorized Access");
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized ,access!!' });
    }
}