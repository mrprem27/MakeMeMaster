const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const Task = require('../models/task');

const createPost = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params
    console.log(req.body.isTask);
    try {
        if (req.files.length > 0 && req.body.isTask == 'off') {
            const newPost = new Post({
                title: req.body.title,
                class: id,
                description: req.body.description,
                files: req.files.map((f) => f.filename),
                haveFile: true
            });
            await newPost.save();
            await Class.findByIdAndUpdate(id, { $push: { posts: newPost._id } })
            res.status(201).send('Course Created');
        }
        else if (req.files.length < 1 && req.body.isTask == 'off') {
            const newPost = new Post({
                title: req.body.title,
                class: id,
                description: req.body.description,
            });
            await newPost.save();
            await Class.findByIdAndUpdate(id, { $push: { posts: newPost._id } })
            res.status(201).send('Course Created');
        }
        else if (req.files.length < 1 && req.body.isTask == 'on') {
            const newTask = new Task({
                time: req.body.time,
                marks: req.body.marks,
                status: true
            })
            const newPost = new Post({
                title: req.body.title,
                class: id,
                description: req.body.description,
                isTask: true,
                task: newTask._id
            });
            newTask.set({ post: newPost._id })
            await newTask.save();
            await newPost.save();
            const students = await Class.findByIdAndUpdate(id, { $push: { posts: newPost._id } }, { select: 'students' });
            await Student.updateMany({ _id: { $in: students.students } }, { $push: { activeTasks: newPost._id } }, { multi: true });
            await Teacher.findByIdAndUpdate(userId, { $push: { activeTasks: newPost._id } });
            res.status(201).send('Course Created');
        }
        else {
            const newTask = new Task({
                time: req.body.time,
                marks: req.body.marks,
                status: true
            })
            const newPost = new Post({
                title: req.body.title,
                class: id,
                description: req.body.description,
                isTask: true,
                task: newTask._id,
                files: req.files.map((f) => f.filename),
                haveFile: true
            });
            newTask.set({ post: newPost._id })
            await newTask.save();
            await newPost.save();
            const students = await Class.findByIdAndUpdate(id, { $push: { posts: newPost._id } }, { select: 'students' });
            await Student.updateMany({ _id: { $in: students.students } }, { $push: { activeTasks: newPost._id } }, { multi: true });
            await Teacher.findByIdAndUpdate(userId, { $push: { activeTasks: newPost._id } });
            res.status(201).send('Course Created');
        }
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchPosts = async (req, res) => {
    const { id } = req.params
    try {
        const posts = await Class.findById(id, 'posts meetLink name note dp').populate('posts', 'title description haveFile isTask task')
        res.status(201).json({ posts: posts.posts, meetLink: posts.meetLink, class: { name: posts.name, note: posts.note } });
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const dowloadFile = async (req, res) => {
    const { file } = req.params
    try {
        res.download(`uploads/${file}`, (e) => console.log(e));
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchClassWork = async (req, res) => {
    const { id } = req.params
    try {
        console.log('123');
        const posts = await Class.findById(id, 'posts').populate('posts', 'title description haveFile isTask', { $or: [{ isTask: true }, { haveFile: true }] });
        console.log(posts, "vsdvsv");
        res.status(201).json({ classwork: posts.posts });
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchSinglePost = async (req, res) => {
    const { postId } = req.params
    try {
        const post = await Post.findById(postId)
        res.status(201).json({ post });
    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
module.exports = { createPost, fetchPosts, dowloadFile, fetchClassWork, fetchSinglePost }
