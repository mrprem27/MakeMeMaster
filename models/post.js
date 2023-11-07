const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    description: { type: String, required: true },
    files: [{ type: String, required: true }],
    isTask: { type: Boolean, default: false },
    haveFile: { type: Boolean, default: false },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
}, { timestamps: true })



const Post = mongoose.model('Post', postSchema);
module.exports = Post;