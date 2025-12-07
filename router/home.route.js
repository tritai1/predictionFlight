const express = require("express")
const router = express.Router()
const controller = require("../controller/home.controller")

router.get('/', controller.home)
router.get('/history', controller.history)
router.post('/clear-history', controller.clearHistory)
router.post('/predict', controller.predict)

module.exports = router