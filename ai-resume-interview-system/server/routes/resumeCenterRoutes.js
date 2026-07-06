const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');
const {getResumeCenter} = require('../controllers/resumeCenterController');

router.get("/",authMiddleware,getResumeCenter);

module.exports=router;
