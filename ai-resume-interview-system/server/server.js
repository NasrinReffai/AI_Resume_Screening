require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');

const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const interviewRoutes = require("./routes/interviewRoutes");
const optimizationRoutes =
require("./routes/optimizationRoutes");

const app=express();
app.use(cors());
app.use(express.json());

app.use('/',authRoutes);
app.use('/',userRoutes);


app.use("/interview", interviewRoutes);
app.use("/api/optimization",optimizationRoutes);

mongoose.connect(process.env.MONGO_URI)
   .then(()=>console.log('database connected'))
   .catch(err=>console.log(err));

app.listen(5000,()=>{
    console.log('server running on the port 5000');
})