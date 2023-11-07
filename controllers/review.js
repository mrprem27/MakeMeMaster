const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const Task = require('../models/task');
const Review = require('../models/review');


const createReview = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, reviewDetails, reviewId } = req.body;
    try {
        if (reviewId !== undefined) {
            const data = await Review.findByIdAndUpdate(reviewId, { ...reviewDetails, haveComment: (reviewDetails.comment.length > 0), student: userId }, { select: 'rating' });
            const course = await Course.findById(id, 'reviewLength rating teacher')
            
            const teach = await Teacher.findById(course.teacher, 'rating reviewLength');
            const newRatingTeach = ((teach.rating * teach.reviewLength) + reviewDetails.rating - data.rating) / teach.reviewLength;
            await Teacher.findByIdAndUpdate(course.teacher, { rating: newRatingTeach.toFixed(2) });

            const newRating = ((course.rating * course.reviewLength) + reviewDetails.rating - data.rating) / course.reviewLength;
            
            await Course.findByIdAndUpdate(id, { rating: newRating.toFixed(2) });
            res.status(201).json({ reviewId, newRating: (newRating.toFixed(2) - newRating.toFixed(2) == 0 ? newRating : newRating.toFixed(2))});
        }
        else {
            const saveDetails = new Review({ ...reviewDetails, haveComment: (reviewDetails.comment.length > 0), student: userId })
            saveDetails.save();
            const course = await Course.findById(id, 'reviewLength rating teacher');

            const teach = await Teacher.findById(course.teacher, 'rating reviewLength');
            const newRatingTeach = ((teach.rating * teach.reviewLength) + reviewDetails.rating) / (teach.reviewLength + 1);
            await Teacher.findByIdAndUpdate(course.teacher, { rating: newRatingTeach.toFixed(2), $inc: { reviewLength: 1 } });

            const newRating = ((course.rating * course.reviewLength) + reviewDetails.rating) / (course.reviewLength + 1);
            await Course.findByIdAndUpdate(id, { $push: { reviews: saveDetails._id }, rating: newRating.toFixed(2), $inc: { reviewLength: 1 } });
            res.status(201).json({reviewId:saveDetails._id,newRating:newRating.toFixed(2)});
        }
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const checkMyReview = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;
    try {
        const data = await Review.findOne({ course: id, student: userId });
        res.status(201).json({ data });
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
module.exports = { createReview, checkMyReview }