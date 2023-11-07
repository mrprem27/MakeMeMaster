const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');
const Notification = require('../models/Notification');


const fetchNotifications = async (req, res) => {
    const { userId, isTeacher } = req;
    try {
        if (isTeacher) {
            const notifications = await Teacher.findById(userId, 'notifications notificationsBuy').populate('notifications notificationsBuy');
            res.status(200).json({ notifications });
        } else {
            const notifications = await Student.findById(userId, 'notifications').populate('notifications', 'title post class seen isRelatedToTask isByTeacher type studentId');
            console.log(notifications);
            res.status(200).json({ notifications });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const deleteAllNotifications = async (req, res) => {
    const { userId, isTeacher } = req;
    const { which } = req.params;
    try {
        if (isTeacher) {
            if (which == 0) {
                const notifications = await Student.findByIdAndDelete(userId, 'notifications notificationsBuy')
            }
            else if (which == 1) {

            }
            res.status(200).json({ notifications });
        } else {
            const notis = await Student.findById(userId, 'notifications');
            await Notification.deleteMany({
                _id: { $in: notis.notifications }
            }, { multi: true });
            await Student.findByIdAndUpdate(userId, { notifications: [] }, '');
            res.status(200).json({ status: true, message: 'marked read successfully' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const deleteNotification = async (req, res) => {
    const { userId, isTeacher } = req;
    const { notiId } = req.params
    try {
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
const fetchNotificationsCount = async (req, res) => {
    const { userId, isTeacher } = req;
    try {
        if (isTeacher) {
            const notifications = await Teacher.findById(userId, 'notificationsCount')
            res.status(200).json({ count: notifications.notificationCount });
        } else {
            const notifications = await Student.findById(userId, 'notificationsCount')
            res.status(200).json({ count: notifications.notificationCount });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}
module.exports = { deleteNotification, deleteAllNotifications, fetchNotifications, fetchNotificationsCount }
