const bcrypt = require('bcryptjs');
const User = require('../models/users');

const {v4:uuidv4}=require("uuid")
const {setUser}=require("../service/auth")

// Signup Controller Function
const signupUser = async (req, res) => {
  console.log('📥 Incoming Data:', req.body);

  const { name, email, password, bloodType, weight, height, age } = req.body;

  if (!name || !email || !password || !bloodType || !weight || !height || !age) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bloodType,
      weight,
      height,
      age,
    });

    const savedUser = await newUser.save();
    console.log('✅ Saved to DB:', savedUser);
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error('❌ Error saving:', err);
    res.status(500).send('Error registering user');
  }
};


const loginUser= async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    console.log(user)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const sessionId=uuidv4()

    setUser(sessionId,user);

    res.cookie("uid",sessionId)



    res.status(200).json({ msg: 'Login successful', user: { name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ msg: 'Server error ' });
  }
};

module.exports = {
  signupUser,loginUser
};
