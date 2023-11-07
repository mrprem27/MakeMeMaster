const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/Auth');

const { fetchNotifications, deleteNotification, deleteAllNotifications, fetchNotificationsCount } = require('../controllers/notification');

router.get('/fetchNotifications', isAuth, fetchNotifications);
router.get('/fetchNotificationsCount', isAuth, fetchNotificationsCount);
router.delete('/deleteNotification/:notiId', isAuth, deleteNotification);
router.delete('/deleteAllNotifications/:which', isAuth, deleteAllNotifications);

module.exports = router;