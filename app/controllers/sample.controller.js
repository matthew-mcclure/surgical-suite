const sampleServices = require('../services/sample.service')()
module.exports = sampleController

function sampleController() {
    return {
        getAll,
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