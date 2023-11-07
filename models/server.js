const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = mongoose.Schema({
    sender: { type: Schema.Types.ObjectId },
    message: String,
    isByTeacher: { type: Boolean, default: false },
    type: String,
    time: String,
    sendername: String
});
const serverSchema = mongoose.Schema({
    uniqueName: { type: String, unique: true, required: true, dropDups: true },
    ownerTeacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    category: { type: String, require: true },
    for: { type: String, require: true },
    dp: String,
    ownerStudent: { type: Schema.Types.ObjectId, ref: 'Student' },
    tags: [{ type: String }],
    isPrivate: { type: Boolean, deafult: false },
    pendingRequests: [{ type: Schema.Types.ObjectId }],
    subscribedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    subscribedInstructors: [{
        type: Schema.Types.ObjectId, ref: 'Teacher'
    }],
    chats: [{
        type: chatSchema
    }],
}, { timestamps: true })




const Server = mongoose.model('Server', serverSchema);
module.exports = Server;