const moment = require('moment')

const generateMessage = (username, text) => {
    const createdAt = new Date().getTime()
    return {
        username,
        text,
        createdAt: moment(createdAt).format('h:ma ddd, D MMM yyyy')
    }
}

const generateLocationMessage = (username, url) => {
    const createdAt = new Date().getTime()
    return {
        username,
        url,
        createdAt: moment(createdAt).format('h:ma ddd, D MMM yyyy')
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}