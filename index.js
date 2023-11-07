const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

const userRoutes = require('./routes/user')
const classRoutes = require('./routes/class')
const reviewRoutes = require('./routes/review')
const courseRoutes = require('./routes/course')
const postRoutes = require('./routes/post')
const taskRoutes = require('./routes/task')
const serverRoutes = require('./routes/server')
const notificationRoutes = require('./routes/notification')

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:['GET','POST']
    }
});
const socketiofunction = require('./socket.io/index')
// const io = socketio(server);

socketiofunction(io);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb", extented: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extented: true }));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use('/uploads', express.static('uploads'))

app.use('/user', userRoutes);
app.use('/class', classRoutes);
app.use('/course', courseRoutes);
app.use('/review', reviewRoutes);
app.use('/post', postRoutes);
app.use('/task', taskRoutes);
app.use('/server', serverRoutes);
app.use('/notification', notificationRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT, () => console.log(`Server Running on Port:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
