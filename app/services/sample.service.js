const Sample = require('../models/sample')
const Room = require('../models/room')
const Staff = require('../models/staff')

module.exports = mongoServices

function mongoServices() {
    return {
        getAll,
        getRooms,
        getStaff,
        insertOne
    }

    function getAll() {
        return Sample.find()
    }

    function getRooms() {
        return Room.find()
    }

    function getStaff() {
        return Staff.find()
    }

    function insertOne() {
        let sample = new Sample({ 'name': 'inserted', 'description': 'inserted too' })
        return sample.save()
    }

}