const express = require("express");
const router = express.Router();
const voteController = require("../controller/vote");

router.route("/").get(voteController.getVotes).post(voteController.addVote);

module.exports = router;
