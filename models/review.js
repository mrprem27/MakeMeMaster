const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    rating: { type: Number, minItem: 1, maxItem: 4 },
    comment: { type: String },
    haveComment: { type: Boolean, default: false },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true })



const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;