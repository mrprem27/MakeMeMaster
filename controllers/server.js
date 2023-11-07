const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Server = require('../models/server');
const Notification = require('../models/Notification');
const DOMAIN_URL = process.env.DOMAIN_URL;

const createServer = async (req, res) => {
    const { userId, isTeacher } = req;
    const data = req.body;
    // console.log(data);
    try {
        // let id;
        if (isTeacher) {
            const newServer = new Server({
                ...data, ownerTeacher: userId, subscribedInstructors: [userId]
            })

            // console.log(newServer);
            await newServer.save();
            await Teacher.findByIdAndUpdate(userId, { $push: { myServers: newServer._id, servers: newServer._id } });
            res.status(201).json({ message: 'success', status: true, serverId: newServer._id });
        } else {
            const newServer = new Server({
                ...data, ownerStudent: userId, subscribedStudents: [userId]
            })
            // console.log(newServer);
            await newServer.save();
            await Student.findByIdAndUpdate(userId, { $push: { myServers: newServer._id, servers: newServer._id } });
            res.status(201).json({ message: 'success', status: true, serverId: newServer._id });
        }

        // console.log(newServer);

    } catch (error) {
        console.log(error.message);
        res.status(409).json({ message: error.message })
    }
}
const fetchMyServers = async (req, res) => {
    const { userId, isTeacher } = req;
    const { id } = req.params;
    try {
        if (isTeacher) {
            const servers = await Teacher.findById(userId, 'myServers').populate('myServers',
                'uniqueName for category'
            );
            res.status(200).json({ servers });
        }
        else {
            const servers = await Student.findById(userId, 'myServers').populate('myServers',
                'uniqueName for category'
            );

            res.status(200).json({ servers });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchServers = async (req, res) => {
    const { userId, isTeacher } = req;
    console.log("fdfvfvfv");
    const { id } = req.params;
    try {
        if (isTeacher) {
            const servers = await Teacher.findById(userId, 'uniqueName ownerStudent for category').populate({
                path: 'servers',
                select: 'uniqueName ownerStudent ownerTeacher for category',
                populate: [{
                    path: 'ownerStudent',
                    select: 'username fullname',
                    model: 'Student'
                },
                {
                    path: 'ownerTeacher',
                    select: 'username fullname',
                    model: 'Teacher'
                }]
            });
            res.status(200).json({ servers });
        }
        else {
            const servers = await Student.findById(userId, 'servers').populate({
                path: 'servers',
                select: 'uniqueName ownerStudent ownerTeacher for category',
                populate: [{
                    path: 'ownerStudent',
                    model: 'Student',
                    select: 'username fullname',
                },
                {
                    path: 'ownerTeacher',
                    select: 'username fullname',
                    model: 'Teacher'
                }]
            });
            console.log(servers);
            res.status(200).json({ servers });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const addMeToServer = async (req, res) => {
    const { userId, isTeacher, username } = req;
    const { serverId } = req.body;
    console.log(req.body);
    try {
        console.log("hi");
        let isValid = false;
        if (isTeacher) {
            const ss = await Teacher.find({
                _id: userId, servers: { $in: serverId }
            }, 'servers')
            console.log(ss, serverId);
            if (ss.length) {
                isValid = true;
            }
        } else {
            const ss = await Student.find({
                _id: userId, servers: { $in: serverId }
            }, 'servers')
            console.log(ss, serverId);
            if (ss.length) {
                isValid = true;
            }
        }
        if (!isValid) {
            console.log("dfvdfxxxxxxxxxxxxxxxxxxxxx");
            if (isTeacher) {
                await Teacher.findByIdAndUpdate(userId, { $push: { servers: serverId } });
                const server = await Server.findByIdAndUpdate(serverId, { $push: { subscribedInstructors: userId } }, { select: 'uniqueName for ownerStudent ownerTeacher category' }).populate('ownerTeacher ownerStudent', 'username fullname');
                res.status(200).json({ server, serverId, self: { _id: userId, username } });
            }
            else {
                await Student.findByIdAndUpdate(userId, { $push: { servers: serverId } });
                const server = await Server.findByIdAndUpdate(serverId, { $push: { subscribedInstructors: userId } }, { select: 'uniqueName for ownerStudent ownerTeacher category' }).populate('ownerTeacher ownerStudent', 'username fullname');
                res.status(200).json({ server, serverId, self: { _id: userId, username } });
            }
        }
        else
            res.status(200).json({ isValid: false });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const viewServer = async (req, res) => {
    const { userId, isTeacher, username } = req;
    const { serverId } = req.params;
    try {

        let isValid = false;
        if (isTeacher) {
            const ss = await Teacher.find({
                _id: userId, servers: { $in: serverId }
            }, 'servers')
            console.log(ss, serverId);
            if (ss.length) {
                isValid = true;
            }
        } else {
            const ss = await Student.find({
                _id: userId, servers: { $in: serverId }
            }, 'servers')
            console.log(ss, serverId);
            if (ss.length) {
                isValid = true;
            }
        }
        console.log(isValid);
        if (isValid) {
            const server = await Server.findById(serverId, 'uniqueName for chats');
            res.status(200).json({ server, serverId, self: { _id: userId, username } });
        } else {
            const server = await Server.findById(serverId, 'uniqueName for ownerStudent ownerTeacher category').populate('ownerTeacher ownerStudent', 'username fullname');
            res.status(200).json({ isValid: false, server });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchAllServers = async (req, res) => {
    const { userId, isTeacher } = req;
    try {
        const servers = await Server.find().populate(
            'ownerStudent', 'username fullname').populate('ownerTeacher', 'username fullname').select('uniqueName ownerStudent for category ownerTeacher');
        res.status(200).json({ allServers: servers });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
module.exports = { fetchAllServers, addMeToServer, createServer, fetchMyServers, fetchServers, viewServer }
