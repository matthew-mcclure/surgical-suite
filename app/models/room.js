const mongoose = require('mongoose')
const Schema = mongoose.Schema

const room = new Schema({
    name: {
        type: String,
        required: true
    },
    equipment: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Room', room)