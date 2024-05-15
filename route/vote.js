const express = require("express")
const router = express.Router()
const voteController = require("../controller/vote")
// const { authMiddleware } = require("../middleware/auth")

router.route("/").get(voteController.getVote).post(voteController.createVote)

module.exports = router
