const router = require('express').Router()
const sampleController = require('../controllers/sample.controller')()

router.get('/sample', sampleController.getAll)
router.get('/rooms', sampleController.getRooms)
router.get('/staff', sampleController.getStaff)


module.exports = router