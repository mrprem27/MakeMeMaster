const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/Auth');
const ClassAuth = require('../middleware/ClassAuth');
const MyCourseAuth = require('../middleware/MyCourseAuth');

const { createClass, fetchMyCourseClasses, fetchMyClassStudents, fetchMyActiveClasses,fetchMyCompletedClasses, openClass, closeClass, makeItActiveClass } = require('../controllers/class');

router.post('/createclass', isAuth, MyCourseAuth, createClass);
router.get(`/mycourseclasses/:id`, isAuth, MyCourseAuth, fetchMyCourseClasses);
router.get(`/mycourseclasses/students/:id`, isAuth, ClassAuth, fetchMyClassStudents);
router.get('/active/myclasses', isAuth, fetchMyActiveClasses)
router.get('/completed/myclasses', isAuth, fetchMyCompletedClasses)
router.get('/openClass/:id/:classId', isAuth, MyCourseAuth, openClass);
router.get('/closeClass/:id/:classId', isAuth, MyCourseAuth, closeClass);
router.get('/makeItActiveClass/:id/:classId', isAuth, MyCourseAuth, makeItActiveClass);

module.exports = router;