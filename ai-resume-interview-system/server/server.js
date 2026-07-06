require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');

const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const interviewRoutes = require("./routes/interviewRoutes");
const optimizationRoutes =
require("./routes/optimizationRoutes");
const resumeBuilderRoutes = require("./routes/resumeBuilderRoutes");
const resumeCenterRoutes = require("./routes/resumeCenterRoutes");
const reportRoutes = require("./routes/reportRoutes");


const app=express();
app.use(cors());
app.use(express.json());

app.use('/',authRoutes);
app.use('/',userRoutes);


app.use("/interview", interviewRoutes);
app.use("/api/optimization",optimizationRoutes);
app.use("/resume-builder", resumeBuilderRoutes);
app.use("/resume-center", resumeCenterRoutes);
app.use("/reports", reportRoutes);


mongoose.connect(process.env.MONGO_URI)
   .then(()=>console.log('database connected'))
   .catch(err=>console.log(err));

app.listen(5000,()=>{
    console.log('server running on the port 5000');
})