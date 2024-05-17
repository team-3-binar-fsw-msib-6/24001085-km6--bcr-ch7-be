const express = require("express");
const router = express.Router();
const auth = require("./auth");
const vote = require("./vote")

router.use("/auth", auth);
router.use("/vote", vote)


module.exports = router;
