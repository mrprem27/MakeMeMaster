const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/Auth');
const classAuth = require('../middleware/ClassAuth');
const upload = require('../middleware/upload')


const { createUser, checkUser, editUser, checkLogin, userLogout, fetchUser } = require('../controllers/user');

router.post('/signup', createUser);
router.post('/login', checkUser);
router.get('/check', isAuth, checkLogin);
router.get('/logout', isAuth, userLogout);
router.get('/account', isAuth, fetchUser);
router.post('/edit', isAuth, upload.single('submission'),editUser);

router.get('/checkJoiner/:id', isAuth, classAuth, checkLogin);

router.put('/edit', isAuth, editUser);

module.exports = router;