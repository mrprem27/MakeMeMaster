const users = {};
const socketToRoom = {};
const Server = require('../models/server');
const { addUser, getUser, removeUser } = require('./user');
const socketiofunction = (io) => {
    io.on('connection', socket => {
        console.log("user connected");
        socket.on("join room", ({ roomID, isTeacher, username, directVideo }) => {
            if (socketToRoom[socket.id]) {
                console.log("user is aleady in a meeting");
                return
            }
            if (users[roomID]) {
                const length = users[roomID].length;
                console.log(length + " users before joining by " + username);
                if (length === 4) {
                    console.log("full");
                    socket.emit("room full");
                    return;
                }
                users[roomID].push({ id: socket.id, isTeacher, username, type: directVideo });
            } else {
                console.log("0 users before joining by " + username);
                users[roomID] = [{ id: socket.id, isTeacher, username, type: directVideo }];
            }
            socketToRoom[socket.id] = roomID;
            socket.join(roomID)
            const usersInThisRoom = users[roomID].filter(u => u.id !== socket.id);
            const isTeacherPresent = users[roomID].find(u => u.isTeacher == true) == undefined ? false : true;
            socket.emit("all users", usersInThisRoom, isTeacherPresent);
        });
        socket.on("sending signal", payload => {
            const roomID = socketToRoom[socket.id];
            if (users[roomID]) {
                const isTeacherPresent = users[roomID].find(u => u.id == socket.id && u.isTeacher == true);
                console.log(payload.callerUsername);
                if (isTeacherPresent == undefined)
                    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, callerUsername: payload.callerUsername, type: payload.type });
                else {
                    socket.broadcast.to(roomID).emit('teacher joined', { signal: payload.signal, callerID: payload.callerID, type: payload.type });
                }
            }
        });
        socket.on("returning signal", payload => {
            // console.log("reciveing",payload);
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });
        socket.on("toggle camera", (isMeTeacher) => {
            const roomID = socketToRoom[socket.id];
            users[roomID] = users[roomID].map((u) => {
                if (u.id == socket.id)
                    return { ...u, type: !u.type }
                return u;
            })
            if (isMeTeacher) {
                socket.broadcast.to(roomID).emit("toggle camera view", socket.id);
            }
            else {
                const isTeacherPresent = users[roomID].find(u => u.isTeacher == true);
                if (isTeacherPresent != undefined)
                    io.to(isTeacherPresent.id).emit("toggle camera view", socket.id);
            }
        })
        socket.on("send message", (messg) => {
            const roomID = socketToRoom[socket.id]
            try {
                socket.broadcast.to(roomID).emit("receive message", messg);
                socket.emit("message sent", messg)
            } catch (error) {
                console.log(error.messgage);
            }
        })
        socket.on('disTeacher', () => {
            console.log("user disconnected Teacher");
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                console.log(users[roomID].length + " users before leaving");
                room = room.filter(u => u.id !== socket.id);
                users[roomID] = room;
                socket.broadcast.to(roomID).emit('teacher leaves');
            }
        });
        socket.on('disStudent', () => {
            console.log("user disconnected Student");

            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                console.log(users[roomID].length + " users users before leaving");
                room = room.filter(u => u.id !== socket.id);
                users[roomID] = room;
                socket.broadcast.to(roomID).emit('student leaves', socket.id);
            }
        });
        socket.on("disconnect", () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                console.log(users[roomID].length + " users before leaving");
                const val = users[roomID].find(u => u.id == socket.id);
                if (val === undefined)
                    return;
                const isMeTeacher = val.isTeacher;
                room = room.filter(u => u.id !== socket.id);
                users[roomID] = room;
                if (isMeTeacher) {
                    console.log("user disconnected Teacher");
                    socket.broadcast.to(roomID).emit('teacher leaves');
                } else {
                    console.log("user disconnected Student");
                    socket.broadcast.to(roomID).emit('student leaves', socket.id);
                }
            }
            const user = removeUser(socket.id);
            if (user) {
                console.log("user disconnected");
            }
        })

        socket.on('join server', ({ name, room }, callback) => {
            // console.log(name, room);
            const { error, user } = addUser({ id: socket.id, name, room });
            if (error)
                return callback(error);

            // socket.emit('message', { user: 'admin', text: `${user.name},Welcome to ${user.room}` })
            // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has Joined` });

            socket.join(user.room);

            // io.to(user.room).emit('roomData', { room: room, users: getUserInRoom(user.room) })
            // if(error)
            // callback({error:'error'})
            callback();
        })
        socket.on('sendMessage', async (message, callback) => {
            try {
                const user = await getUser(socket.id);
                await Server.findByIdAndUpdate(user.room, {
                    $push: {
                        chats: message
                    }
                });
                socket.broadcast.to(user.room).emit('message', message);
            } catch (error) {
                console.log(error);
            }
            callback();
        });
        socket.on('typing', async () => {
            try {
                const user = await getUser(socket.id);
                socket.broadcast.to(user.room).emit('setTyping');
            } catch (error) {
                console.log(error.message);
            }
        });
        socket.on('notTyping', async () => {
            try {
                const user = await getUser(socket.id);
                socket.broadcast.to(user.room).emit('setNotTyping');
            } catch (error) {
                console.log(error.message);
            }
        });
    });
}

module.exports = socketiofunction;
