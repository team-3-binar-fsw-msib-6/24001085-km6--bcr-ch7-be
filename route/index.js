const express = require("express");
const router = express.Router();
const auth = require("./auth");

// /students
router.use("/auth", auth);

module.exports = router;
