require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');  // Import bcryptjs for password hashing

// Initialize the Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the schema for the 'users' collection
const users = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodType: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  age: { type: Number, required: true },
});

// Create the model for the 'users' collection directly
const User = mongoose.model('users', users); // 'users' directly maps to the collection name

// API Route to handle user registration (signup)
app.post('/signup', async (req, res) => {
  console.log('📥 Incoming Data:', req.body);

  const { name, email, password, bloodType, weight, height, age } = req.body;

  if (!name || !email || !password || !bloodType || !weight || !height || !age) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists with this email' });
  }

  // Hash the password before saving the user
  const salt = await bcrypt.genSalt(10);  // Generate salt
  const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

  // Create new user with hashed password
  const newUser = new User({
    name,
    email,
    password: hashedPassword,  // Store the hashed password
    bloodType,
    weight,
    height,
    age,
  });

  try {
    const savedUser = await newUser.save();
    console.log('✅ Saved to DB:', savedUser);
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error('❌ Error saving:', err);
    res.status(500).send('Error registering user');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
