const sampleServices = require('../services/sample.service')()
module.exports = sampleController

function sampleController() {
    return {
        getAll,
        getRooms,
        getStaff,
        insertOne
    }

    function getAll(req, res) {
        sampleServices.getAll()
            .then((response) => {
                res.json(response)
            })
            .catch(reason => {
                console.log(reason)
            })
    }

    function getRooms(req, res) {
        sampleServices.getRooms()
            .then((response) => {
                res.json(response)
            })
            .catch((response) => {
                console.log(response)
            })
    }

    function getStaff(req, res) {
        sampleServices.getStaff()
            .then((response) => {
                res.json(response)
            })
            .catch((response) => {
                console.log(response)
            })
    }

    function insertOne(req, res) {
        return sampleServices.insertOne()
            .then((response) => {
                res.json(response)
            })
            .catch(reason => {
                console.log(reason)
            })
    }

}