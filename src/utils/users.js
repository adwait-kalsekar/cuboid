const users = []

const addUser = ({ id, username, room, password }) => {
    //Validate the data
    if(!username || !room || !password) {
        return {
            error: "Cannot leave required fields empty!"
        }
    }

    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Check for password

    if(password !== '12345') {
        return {
            error: "Incorrect Password"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser) {
        return {
            error: "Username already taken!"
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}