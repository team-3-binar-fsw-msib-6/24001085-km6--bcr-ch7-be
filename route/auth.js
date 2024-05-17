const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  googleLogin,
  userVote,
} = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/profile", profile);
router.post("/user-vote", userVote);

module.exports = router;
