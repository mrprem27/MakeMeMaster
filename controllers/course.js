const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const NotificationBuy = require('../models/NotificationBuy')

const fetchMyCourseView = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id, 'name category description youtubeLink objectives dp activeClass active price discount teacher countOfStudents note timeSlot reviews reviewLength rating').populate('reviews');
        console.log(course);
        res.status(200).json({ course });//student name rkhu ya nhi
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyCourses = async (req, res) => {
    const { userId } = req;
    try {
        const myCourses = await Teacher.findById(userId, 'courses').populate('courses', '_id name category price discount active rating review reviewLength countOfStudents');
        res.status(200).json({ myCourses });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchCourses = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
        if (filter == "*") {
            const courses = await Course.find({
                select: '_id name category price discount active rating review reviewLength teacher countOfStudents'
            }).populate('teacher', 'fullname');
            res.status(200).json({ courses });
        }
        else {
            const courses = await Course.find({ category: filter }, '_id name category price discount active rating review reviewLength teacher countOfStudents'
            ).populate('teacher', 'fullname');
            res.status(200).json({ courses });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchEnrollingCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, '_id name category price discount active rating review reviewLength teacher countOfStudents').sort({ countOfStudents: -1 }).limit(8).populate('teacher', 'fullname');
        res.status(200).json({ courses });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const searchCourses = async (req, res) => {
    const { filter, searchString } = req.params;
    console.log(filter, searchString);
    try {
        if (filter == "*") {
            const courses = await Course.find({ name: { $regex: new RegExp(searchString, "i") } }, '_id name category price discount active rating review reviewLength teacher countOfStudents').populate('teacher', 'fullname');
            console.log(courses);
            res.status(200).json({ courses });
        }
        else {
            const courses = await Course.find({ name: { $regex: new RegExp(searchString, "i") }, category: filter }, '_id name category price discount active rating review reviewLength teacher countOfStudents').populate('teacher', 'fullname');
            res.status(200).json({ courses });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const createCourse = async (req, res) => {
    const { userId, isTeacher } = req;
    const data = req.body;
    try {
        if (!isTeacher)
            throw "error"

        const newClass = new Class({
            name: "First Class " + data.name,
            note: "Hello Students !!",
            teacher: userId,
            timeSlot: data.timeSlot,
        })

        const newCourse = new Course({ ...data, teacher: userId, activeClasses: [newClass._id,], activeClass: newClass._id });

        newClass.set({
            course: newCourse._id,
            meetLink: ('/meet/' + newClass._id)
        })
        //new thing ^^^^^^^

        await newCourse.save();
        await newClass.save();

        await Teacher.findByIdAndUpdate(userId, { $push: { courses: newCourse._id } })

        res.status(201).send('Course Created');
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchCourseView = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        const course = await Course.findById(id, 'name category description youtubeLink objectives dp activeClass active price discount teacher countOfStudents note timeSlot reviews reviewLength rating').populate('teacher', 'fullname rating reviewLength email dp').populate('reviews', 'rating comment haveComment student');
        if (!isTeacher) {
            const wl = await Student.findById(userId, 'wishList')
            const inWishList = wl.wishList.includes(id)
            const arr = await Course.findById(id, 'students');
            const isSold = arr.students.includes(userId);
            res.status(200).json({ course, isSold, inWishList });
        }
        else {
            const wl = await Teacher.findById(userId, 'wishList')
            const inWishList = wl.wishList.includes(id)
            res.status(200).json({ course, inWishList });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchCourseViewWL = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id, 'name category description youtubeLink objectives dp activeClass active price discount teacher countOfStudents note timeSlot reviews reviewLength rating').populate('teacher', 'fullname rating reviewLength email dp').populate('reviews', 'rating comment haveComment student');
        res.status(200).json({ course });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const buyCourse = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        if (isTeacher)
            throw new Error("Teacher can't Buy a Course")
        const course = await Course.findOneAndUpdate({ _id: id, active: true }, { $push: { students: userId }, $inc: { countOfStudents: 1 } }, { select: 'name category price discount timeSlot active activeClass teacher countOfStudents' });
        if (course == null)
            throw new Error("Teacher can't Buy a Course")
        await Student.findByIdAndUpdate(userId, { $push: { activeClasses: course.activeClass } });

        const noti = new NotificationBuy({
            student: userId,
            course: id,
            price: course.price,
            class: course.activeClass
        })
        await noti.save();

        await Teacher.findByIdAndUpdate(course.teacher, { $push: { notificationBuy: noti._id } });

        await Class.findByIdAndUpdate(course.activeClass, { $push: { students: userId }, $inc: { countOfStudents: 1 } });

        res.status(200).json({ message: "sold" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const addToWishList = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        if (!isTeacher) {
            console.log(id);
            await Student.findByIdAndUpdate(userId, { $push: { wishList: id } })
            res.status(200).json({ message: "success" });
        }
        else {
            await Teacher.findByIdAndUpdate(userId, { $push: { wishList: id } })
            res.status(200).json({ message: "success" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const removeFromWishList = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        if (!isTeacher) {
            await Student.findByIdAndUpdate(userId, { $pull: { wishList: id } })
            res.status(200).json({ message: "success" });
        }
        else {
            await Teacher.findByIdAndUpdate(userId, { $pull: { wishList: id } })
            res.status(200).json({ message: "success" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const activateCourse = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        await Course.findByIdAndUpdate(id, { active: true })
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const deactivateCourse = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        console.log("shit2");
        await Course.findByIdAndUpdate(id, { active: false })
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
module.exports = { fetchEnrollingCourses, fetchMyCourses, createCourse, fetchMyCourseView, fetchCourseView, fetchCourses, buyCourse, removeFromWishList, addToWishList, fetchCourseViewWL, searchCourses, activateCourse, deactivateCourse }
