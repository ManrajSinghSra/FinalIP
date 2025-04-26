// routers/historyRoutes.js
const express = require('express');
const router = express.Router();
const History = require('../models/historyModel');
const { restrictToLoggedinUserOnly } = require('../middleware/auth');

// Get all history items for the logged-in user
router.get('/', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a medicine to history
router.post('/', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const { medicineName, medicineData } = req.body;
    
    // Upsert - update if exists, insert if doesn't
    const history = await History.findOneAndUpdate(
      { userId: req.user._id, medicineName: medicineName },
      { userId: req.user._id, medicineName, medicineData },
      { new: true, upsert: true }
    );
    
    res.status(201).json(history);
  } catch (error) {
    // Check if error is a duplicate key error
    if (error.code === 11000) {
      return res.status(200).json({ message: "Medicine already in history" });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a medicine from history
router.delete('/:medicineName', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const result = await History.findOneAndDelete({ 
      userId: req.user._id, 
      medicineName: req.params.medicineName 
    });
    
    if (!result) {
      return res.status(404).json({ message: "Medicine not found in history" });
    }
    
    res.json({ message: "Removed from history" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;