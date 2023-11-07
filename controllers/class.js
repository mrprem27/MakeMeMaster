const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const Notification = require('../models/Notification');
const DOMAIN_URL = process.env.DOMAIN_URL;

const createClass = async (req, res) => {
    const { userId, isTeacher } = req;
    const { data, courseId } = req.body;
    try {
        if (!isTeacher)
            throw "error"
        const newClass = new Class({
            ...data, teacher: userId, course: courseId
        })
        newClass.set({
            meetLink: ('/meet/' + newClass._id)
        })
        console.log(newClass);
        await Course.findByIdAndUpdate(courseId, { $push: { activeClasses: newClass._id } });
        await newClass.save();
        res.status(201).send('Course Created');
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchMyCourseClasses = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        if (!isTeacher)
            throw new Error("error")
        const classes = await Course.findById(id, 'activeClasses completedClasses').populate('activeClasses completedClasses', 'name timeSlot countOfStudents note');

        res.status(200).json({ classes });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyClassStudents = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        const people = await Class.findById(id, 'students teacher countOfStudents').populate('students teacher', 'fullname email');
        res.status(200).json({ people });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyActiveClasses = async (req, res) => {
    const { userId, isTeacher } = req;
    try {
        if (!isTeacher) {
            const classes = await Student.findById(userId, 'activeClasses').populate({
                path: 'activeClasses', select: 'name timeSlot countOfStudents note course', populate: {
                    path: 'course',
                    model: 'Course',
                    select: 'name'
                }, sort: { name: -1 }
            })
            res.status(200).json({ classes, isTeacher });
        }
        else {
            const classes = await Teacher.findById(userId, 'courses').populate({
                path: 'courses', select: 'name activeClasses activeClass', populate: {
                    path: 'activeClasses',
                    select: 'name timeSlot countOfStudents note',
                    sort: { name: -1 }
                }
            }).sort({ name: -1 });
            res.status(200).json({ classes: classes.courses, isTeacher });
        }

    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyCompletedClasses = async (req, res) => {
    const { userId, isTeacher } = req;
    try {
        if (!isTeacher) {
            const classes = await Student.findById(userId, 'completedClasses').populate({
                path: 'completedClasses', select: 'name timeSlot countOfStudents notecourse', populate: {
                    path: 'course',
                    model: 'Course',
                    select: 'name'
                }, sort: { name: -1 }
            });
            res.status(200).json({ classes, isTeacher });
        }
        else {
            const classes = await Teacher.findById(userId, 'courses').populate({
                path: 'courses', select: 'name completedClasses', populate: {
                    path: 'completedClasses',
                    select: 'name timeSlot countOfStudents note',
                    sort: { name: -1 }
                }
            }).sort({ name: -1 });
            res.status(200).json({ classes: classes.courses, isTeacher });
        }

    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const makeItActiveClass = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, classId } = req.params
    try {
        console.log("shsbhsbhsbx");
        await Course.findByIdAndUpdate(id, { activeClass: classId })
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const openClass = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, classId } = req.params
    try {
        const myClass = await Class.findById(classId, 'students name course').populate('course', 'name');
        const noti = new Notification({
            title: myClass.name + ' Class of ' + myClass.course.name + ' is Active Now',
            class: classId,
            type: 'class activation',
        })
        console.log(noti);
        await noti.save();
        await Course.findByIdAndUpdate(id, { $push: { activeClasses: classId }, $pull: { completedClasses: classId } })
        await Student.updateMany({ _id: { $in: myClass.students } }, { $push: { activeClasses: classId, notifications: noti._id }, $pull: { completedClasses: classId } }, { multi: true });

        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const closeClass = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, classId } = req.params
    try {
        const myClass = await Class.findById(classId, 'students name course').populate('course', 'name');
        const noti = new Notification({
            title: myClass.name + ' Class of ' + myClass.course.name + ' is Closed.',
            class: classId,
            type: 'class deactivation',
        })
        noti.save();
        await Course.findByIdAndUpdate(id, { $pull: { activeClasses: classId }, $push: { completedClasses: classId } })
        await Course.findByIdAndUpdate(id,)
        await Student.updateMany({ _id: { $in: myClass.students } }, {
            $pull: { activeClasses: classId }, $push: {
                completedClasses: classId, notifications: noti._id
            }
        }, { multi: true });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}

module.exports = { openClass, closeClass, makeItActiveClass, createClass, fetchMyCourseClasses, fetchMyClassStudents, fetchMyActiveClasses, fetchMyCompletedClasses }
