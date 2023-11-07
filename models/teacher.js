const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const teacherSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, unique: true, required: true, dropDups: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true, dropDups: true },
    dp: String,
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    cellno: { type: String, required: true },
    activeTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // missingTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    completedTasks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    wishList: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    notificationsBuy: [{
        type: Schema.Types.ObjectId, ref: 'NotificationBuy'
    }],
    notifications: [{
        type: Schema.Types.ObjectId, ref: 'Notification'
    }],
    notificationCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewLength: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    myServers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
});

teacherSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(this.password, salt);
        this.password = hashedPass;
        next();
    } catch (error) {
        console.log(error.message);
    }
})

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;