const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/Auth');
const ClassAuth = require('../middleware/ClassAuth');
const upload = require('../middleware/upload')
const isTeacher = require('../middleware/isTeacher');

const { submitTask, deleteFile, fetchActiveTasksStudent, fetchActiveTasksTeacher, addCommentToChat, fetchCompletedTasksStudent, fetchCompletedTasksTeacher, activeTask, unActiveTask, fetchMySubmitedFile, doneTask, unDoneTask, fetchTaskSubmissions, fetchMyChats, initiateMyChat, initiateMyChatTeacher, fetchMyChatsTeacher, addCommentToChatTeacher } = require('../controllers/task');

router.post('/submitTask/:id/:taskId', isAuth, ClassAuth, upload.single('submission'), submitTask);
router.get('/deleteFile/:id/:taskId/:file', isAuth, ClassAuth, deleteFile);
router.get('/fetchmySubmitedFiles/:id/:taskId', isAuth, ClassAuth, fetchMySubmitedFile);
router.get('/doneTask/:id/:taskId', isAuth, ClassAuth, doneTask);
router.get('/unDoneTask/:id/:taskId', isAuth, ClassAuth, unDoneTask);
router.get('/activeTask/:id/:taskId', isAuth, ClassAuth, isTeacher, activeTask);
router.get('/unActiveTask/:id/:taskId', isAuth, ClassAuth, isTeacher, unActiveTask);
router.get('/fetchActiveTasksStudent', isAuth, fetchActiveTasksStudent);
router.get('/fetchCompletedTasksStudent', isAuth, fetchCompletedTasksStudent);
router.get('/fetchActiveTasksTeacher', isAuth, isTeacher, fetchActiveTasksTeacher);
router.get('/fetchCompletedTasksTeacher', isAuth, isTeacher, fetchCompletedTasksTeacher);
router.get('/taskSubmissions/:id/:taskId', isAuth, ClassAuth, isTeacher, fetchTaskSubmissions);
router.get('/fetchMyChats/:id/:taskId', isAuth, fetchMyChats);
router.get('/initiateMyChat/:id/:taskId', isAuth, initiateMyChat);
router.post('/addCommentToChat/:id/:taskId', isAuth, addCommentToChat);

router.get('/initiateMyChatTeacher/:id/:taskId/:studentId', isAuth, initiateMyChatTeacher)
router.get('/fetchMyChatsTeacher/:id/:taskId/:studentId', isAuth, fetchMyChatsTeacher)
router.post('/addCommentToChatTeacher/:id/:taskId/:studentId', isAuth, addCommentToChatTeacher)
module.exports = router;
//is my task middleware