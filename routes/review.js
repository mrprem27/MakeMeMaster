const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/Auth');
const MyCourseAuth = require('../middleware/MyCourseAuth');
const isTeacher = require('../middleware/isTeacher');

const { checkMyReview, createReview } = require('../controllers/review');

router.get('/checkMyReview/:id', isAuth,checkMyReview);
router.post('/createReview',isAuth, createReview);

module.exports = router;