const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/Auth');
const MyCourseAuth = require('../middleware/MyCourseAuth');
const isTeacher = require('../middleware/isTeacher');

const { fetchMyCourses, fetchCourseViewWL, createCourse, fetchMyCourseView, fetchCourses, buyCourse, fetchCourseView, addToWishList, removeFromWishList, activateCourse, deactivateCourse,searchCourses,fetchEnrollingCourses } = require('../controllers/course');
//-->Enrolling Courses
router.get('/enrollingCourses', fetchEnrollingCourses)

router.get('/mycourses', isAuth, fetchMyCourses);
router.post('/createcourse', isAuth, createCourse);

router.get('/courses/:filter', fetchCourses)
router.get('/courses/:filter/:searchString', searchCourses);

router.get('/view/:id', isAuth, fetchCourseView);
router.get('/viewwl/:id', fetchCourseViewWL);
router.get('/buy/:id', isAuth, buyCourse)
router.get('/mycourses/view/:id', isAuth, MyCourseAuth, fetchMyCourseView)
router.put(`/addtowishlist/:id`, isAuth, addToWishList)
router.get('/activate/:id', isAuth, MyCourseAuth, activateCourse)
router.get('/deactivate/:id', isAuth, MyCourseAuth, deactivateCourse)
router.put(`/removefromwishlist/:id`, isAuth, removeFromWishList)

module.exports = router;