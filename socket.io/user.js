let users = [];

const addUser = ({ id, name, room }) => {
    console.log(id, '  ---  ', name, ' ', room);
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.id === id);
    if (existingUser)
        return { error: 'user is taken' };

    const user = { id, name, room };

    users.push(user);
    return { user };
}
const removeUser = ({ id }) => {
    users = users.filter((user) => user.id !== id);
    return true;
}
const getUser = (id) => { return users.find((user) => user.id == id) };


module.exports = { addUser, getUser, removeUser };