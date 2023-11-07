const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/Auth');
const MyClassAuth = require('../middleware/MyClassAuth')
const ClassAuth = require('../middleware/ClassAuth')
const upload = require('../middleware/upload')

const { createPost, fetchPosts,dowloadFile,fetchClassWork,fetchSinglePost } = require('../controllers/post');

router.post('/createpost/:id', isAuth, MyClassAuth, upload.array('filesArray', 5), createPost);
router.get('/fetchposts/:id', isAuth, ClassAuth, fetchPosts);
router.get('/fetchclasswork/:id', isAuth, ClassAuth,fetchClassWork);
router.get('/filedownload/:id/:file', dowloadFile)
router.get('/fetchpost/:id/:postId',isAuth,ClassAuth,fetchSinglePost);

module.exports = router;