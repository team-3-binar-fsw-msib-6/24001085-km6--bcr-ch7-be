const express = require("express")
const router = express.Router()
const vote = require("./vote")

router.use("/vote", vote)

module.exports = router
