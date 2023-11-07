const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = mongoose.Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    submissions: [
        {
            student: { type: Schema.Types.ObjectId, ref: 'Student' },
            files: [{
                type: String
            }],
            tos: String,
            ontime: { type: Boolean, default: true },
            marks: { type: Number, default: 0 },
            status: { type: Boolean, default: false },
        }
    ],
    chats: [
        {
            student: { type: Schema.Types.ObjectId, ref: 'Student' },
            chat: [{
                isTeacher: { type: Boolean, default: false },
                message: String,
                time: String,
            }],
        }
    ],
    time: { type: String, default: '' },
    marks: { type: Number, default: 100 },
    status: { type: Boolean, default: true },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;