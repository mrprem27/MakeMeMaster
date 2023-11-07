const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = mongoose.Schema({
    name: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' ,required:true},
    note: { type: String, required: true },
    meetLink: { type: String, default:'' },
    dp: String,
    activeTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    missingTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    completedTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true},
    students: [{ type: Schema.Types.ObjectId, ref: 'Student'}],
    countOfStudents: { type: Number, required: true, default: 0 },
    timeSlot: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})


const Class = mongoose.model('Class', ClassSchema);
module.exports = Class;