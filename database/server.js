require('dotenv').config();  
const express = require('express');
const cookieParser = require('cookie-parser');
const {restrictToLoggedinUserOnly}=require("./middleware/auth")

// const medicineRoutes = require('./routers/medicineRoutes');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routers/userRoutes');

const app = express();
const PORT = 5003;




 
app.use(express.json());
 

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true
}));
app.use(cookieParser());
 
connectDB();

 
app.use('/', userRoutes);

// app.use('/medicine', medicineRoutes);

 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
