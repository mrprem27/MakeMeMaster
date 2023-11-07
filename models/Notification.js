const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema({
    title: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    seen: { type: Boolean, default: false },
    isRelatedToTask: { type: Boolean, default: false },
    isByTeacher: { type: Boolean, default: true },
    type: { type: String },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
},{ timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;