const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const {restrictToLoggedinUserOnly}=require("../middleware/auth")
const { signupUser ,loginUser } = require('../controllers/userController');

// Route using controller
router.post('/signup', signupUser);

router.post('/login',loginUser);

 router.get('/profile', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("REQ.USER:", req.user); // ADD THIS

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

 


module.exports = router;
