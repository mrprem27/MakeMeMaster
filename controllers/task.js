const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const Task = require('../models/task');
const { populate } = require('../models/task');

const submitTask = async (req, res) => {
    const { userId, isTeacher } = req;
    const { taskId } = req.params;
    try {
        console.log("shit")
        const tos = new Date();
        const task = await Task.findById(taskId, 'time post status').select({ submissions: { $elemMatch: { student: userId } } });
        console.log(task);
        if (task.status) {
            if (task.submissions.length == 0) {
                const submission = {
                    student: userId,
                    files: req.file.filename,
                    tos: (tos.getFullYear() + "-" + (tos.getMonth() + 1) + '-' + (tos.getDate() < 10 ? ("0" + tos.getDate()) : tos.getDate()) + "T" + tos.toTimeString().substring(0, 5)),
                    ontime: (tos <= task.time),
                    marks: 0,
                    status: false
                }
                await Task.findByIdAndUpdate(taskId, { $push: { submissions: submission } });
            }
            else {
                if (task.submissions[0].files.length > 4)
                    throw new Error("files limit exceed")
                await Task.findOneAndUpdate({ _id: taskId, "submissions.student": userId }, { $push: { "submissions.$.files": req.file.filename } });
            }
        }
        else
            throw new Error("Unactive TAsk")

        res.status(200).json({ file: req.file.filename });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const deleteFile = async (req, res) => {
    const { userId, isTeacher } = req;
    const { taskId, file } = req.params;
    try {
        console.log("nnnn");
        await Task.findOneAndUpdate({ _id: taskId, "submissions.student": userId, status: true }, { $pull: { "submissions.$.files": file } });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMySubmitedFile = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId, 'status').select({ submissions: { $elemMatch: { student: userId } } });
        res.status(200).json({ files: task.submissions[0] ? task.submissions[0].files : [], status: task.submissions[0] ? task.submissions[0].status : false, taskStatus: task.status });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const doneTask = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    try {
        const tos = new Date();
        const task = await Task.findById(taskId, 'time post status').select({ submissions: { $elemMatch: { student: userId } } });
        if (task.status) {
            if (task.submissions.length == 0) {
                const submission = {
                    student: userId,
                    files: [],
                    tos: (tos.getFullYear() + "-" + (tos.getMonth() + 1) + '-' + (tos.getDate() < 10 ? ("0" + tos.getDate()) : tos.getDate()) + "T" + tos.toTimeString().substring(0, 5)),
                    ontime: (tos <= task.time),
                    marks: 0,
                    status: true
                }
                await Task.findByIdAndUpdate(taskId, { $push: { submissions: submission } });
                console.log(task);
                await Student.findByIdAndUpdate(userId, { $push: { completedTasks: task.post } });
                await Student.findByIdAndUpdate(userId, { $pull: { activeTasks: task.post } });
            }
            else {
                const task = await Task.findOneAndUpdate({ _id: taskId, "submissions.student": userId }, { "submissions.$.status": true }, { select: 'post' });
                console.log(task);
                await Student.findByIdAndUpdate(userId, { $push: { completedTasks: task.post } });
                await Student.findByIdAndUpdate(userId, { $pull: { activeTasks: task.post } });
            }
        }
        else
            throw new Error("Unactive TAsk")
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const unDoneTask = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    try {
        const task = await Task.findOneAndUpdate({ _id: taskId, "submissions.student": userId }, { "submissions.$.status": false }, { select: 'post' });
        await Student.findByIdAndUpdate(userId, { $pull: { completedTasks: task.post } });
        await Student.findByIdAndUpdate(userId, { $push: { activeTasks: task.post } });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const activeTask = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    try {
        const task = await Task.findByIdAndUpdate(taskId, { status: true }, { select: 'post' });
        await Teacher.findByIdAndUpdate(userId, { $pull: { completedTasks: task.post } });
        await Teacher.findByIdAndUpdate(userId, { $push: { activeTasks: task.post } });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const unActiveTask = async (req, res) => {
    const { userId } = req;
    const { taskId } = req.params;
    try {
        const task = await Task.findByIdAndUpdate(taskId, { status: false }, { select: 'post' });
        await Teacher.findByIdAndUpdate(userId, { $push: { completedTasks: task.post } });
        await Teacher.findByIdAndUpdate(userId, { $pull: { activeTasks: task.post } });
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchActiveTasksStudent = async (req, res) => {
    const { userId } = req;
    try {
        const tasks = await Student.findById(userId, 'activeTasks').populate({
            path: 'activeTasks', select: 'title class task', populate: [{
                path: 'class',
                select: 'name course',
                populate: {
                    path: 'course',
                    select: 'name'
                }
            }
                , {
                path: 'task',
                select: 'time'
            }]
        })
        res.status(200).json({ activeTasks: tasks.activeTasks });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchCompletedTasksStudent = async (req, res) => {
    const { userId } = req;
    try {
        const tasks = await Student.findById(userId, 'completedTasks').populate({
            path: 'completedTasks', select: 'title class', populate: {
                path: 'class',
                select: 'name course',
                populate: {
                    path: 'course',
                    select: 'name'
                }
            }
        })
        res.status(200).json({ completedTasks: tasks.completedTasks, });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchActiveTasksTeacher = async (req, res) => {
    const { userId } = req;
    try {
        const tasks = await Teacher.findById(userId, 'activeTasks').populate({
            path: 'activeTasks', select: 'title class task', populate: [{
                path: 'class',
                select: 'name course',
                populate: {
                    path: 'course',
                    select: 'name'
                }
            }
                , {
                path: 'task',
                select: 'time'
            }]
        })
        res.status(200).json({ activeTasks: tasks.activeTasks, });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchCompletedTasksTeacher = async (req, res) => {
    const { userId } = req;
    try {
        const tasks = await Teacher.findById(userId, 'completedTasks').populate({
            path: 'completedTasks', select: 'title class', populate: {
                path: 'class',
                select: 'name course',
                populate: {
                    path: 'course',
                    select: 'name'
                }
            }
        })
        res.status(200).json({ completedTasks: tasks.completedTasks, });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchTaskSubmissions = async (req, res) => {
    const { userId } = req;
    const { id, taskId } = req.params
    try {
        const tasks = await Task.findById(taskId, 'time marks status').select({ submissions: { $elemMatch: { status: true } } });
        console.log(tasks);
        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const initiateMyChat = async (req, res) => {
    const { userId } = req;
    const { id, taskId } = req.params
    try {
        const task = await Task.findById(taskId, 'chats').select({ chats: { $elemMatch: { student: userId } } });
        if (task.chats.length == 0) {
            const chat = {
                student: userId,
                chat: [],
            }
            await Task.findByIdAndUpdate(taskId, { $push: { chats: chat } });
            res.status(200).json({ message: "success" });
        }
        else
            throw new Error("Already Student's Chat exist")
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyChats = async (req, res) => {
    const { userId } = req;
    const { id, taskId } = req.params
    try {
        const task = await Task.findById(taskId).select({ chats: { $elemMatch: { student: userId } } });
        if (task.chats.length > 0)
            res.status(200).json({ messages: task.chats[0].chat });
        else
            res.status(200).json({ messages: null });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const addCommentToChat = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, taskId } = req.params
    try {
        const date = new Date();
        const chat = {
            isTeacher,
            message: req.body.message,
            time: date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
        }
        await Task.findOneAndUpdate({ _id: taskId, "chats.student": userId }, { $push: { "chats.$.chat": chat } });
        res.status(200).json({ message: chat })
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const initiateMyChatTeacher = async (req, res) => {
    const { userId } = req;
    const { id, taskId, studentId } = req.params
    try {
        const task = await Task.findById(taskId, 'chats').select({ chats: { $elemMatch: { student: studentId } } });
        if (task.chats.length == 0) {
            const chat = {
                student: studentId,
                chat: [],
            }
            await Task.findByIdAndUpdate(taskId, { $push: { chats: chat } });
            res.status(200).json({ message: "success" });
        }
        else
            throw new Error("Already Student's Chat exist")
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchMyChatsTeacher = async (req, res) => {
    const { userId } = req;
    const { id, taskId, studentId } = req.params
    try {
        const task = await Task.findById(taskId).select({ chats: { $elemMatch: { student: studentId } }, submissions: { $elemMatch: { student: studentId } } });
        console.log(task);
        if (task.chats.length > 0)
            res.status(200).json({ messages: task.chats[0].chat, files: task.submissions.length > 0 ? task.submissions[0].files : [] });
        else
            res.status(200).json({ messages: null });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const addCommentToChatTeacher = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id, taskId, studentId } = req.params
    try {
        const date = new Date();
        const chat = {
            isTeacher,
            message: req.body.message,
            time: date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
        }
        console.log(chat);
        await Task.findOneAndUpdate({ _id: taskId, "chats.student": studentId }, { $push: { "chats.$.chat": chat } });
        res.status(200).json({ message: chat })
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    submitTask, deleteFile, fetchActiveTasksStudent, fetchActiveTasksTeacher, fetchCompletedTasksStudent, fetchCompletedTasksTeacher, activeTask, unActiveTask, fetchMySubmitedFile, doneTask, unDoneTask, fetchTaskSubmissions, initiateMyChat, fetchMyChats, addCommentToChat, initiateMyChatTeacher, fetchMyChatsTeacher, addCommentToChatTeacher
}