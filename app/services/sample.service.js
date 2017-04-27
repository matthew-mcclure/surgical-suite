const Sample = require('../models/sample')

module.exports = mongoServices

function mongoServices() {
    return {
        getAll,
        insertOne
    }

    function getAll() {
        return Sample.find()
    }

    function insertOne() {
        let sample = new Sample({ 'name': 'inserted', 'description': 'inserted too' })
        return sample.save()
    }

}