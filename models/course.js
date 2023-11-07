const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    objectives: [{ type: String }],
    dp: String,
    activeClass: { type: Schema.Types.ObjectId, ref: 'Class', default: null },
    active: { type: Boolean, default: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    discount: { type: Number, required: true },
    activeClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    completedClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    reviewLength: { type: Number, default: 0 },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    countOfStudents: { type: Number, default: 0 },
    note: { type: String, default: "This Course can make you Master" },
    timeSlot: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    rating: { type: Number, default: 0 },
})


const Course = mongoose.model('Course', courseSchema);
module.exports = Course;