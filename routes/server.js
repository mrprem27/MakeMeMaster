const exprss = require('express');
const router = exprss.Router();

const isAuth = require('../middleware/Auth');
const ClassAuth = require('../middleware/ClassAuth');
// const MyAuth = require('../middleware/MyAuth');

const { createServer, fetchMyServers, fetchServers, viewServer, addMeToServer, fetchAllServers } = require('../controllers/server');


router.post('/createserver', isAuth, createServer);
router.get(`/myservers`, isAuth, fetchMyServers);
router.get(`/fetchSubServers`, isAuth, fetchServers);
router.get(`/fetchAllservers`, isAuth, fetchAllServers );
router.put(`/addMeToServer`, isAuth, addMeToServer );
router.get('/server/:serverId', isAuth, viewServer);

module.exports = router;