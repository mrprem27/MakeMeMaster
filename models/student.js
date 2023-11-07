const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const Notification = require('./Notification')

const studentSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true, dropDups: true },
    username: { type: String, unique: true, required: true, dropDups: true },
    dp: { type: String, default: '' },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    cellno: { type: String, required: true },
    wishList: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    activeClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    completedClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
    activeTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // missingTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    completedTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    activeCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    notifications: [{ _type: Schema.Types.ObjectId }],
    notificationCount: { type: Number, default: 0 },
    myServers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
});

studentSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(this.password, salt);
        this.password = hashedPass;
        next();
    } catch (error) {
        console.log(error.message);
    }
})

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;