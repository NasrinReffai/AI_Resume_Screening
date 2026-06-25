const express= require('express');
const router=express.Router();

const {register,login}= require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register',register);
router.post('/login',login);
router.get('/dashboard',(authMiddleware),(req,res)=>{
    res.json({
        msg:'Welcome to dashboard',
        user:req.user
    })
});
module.exports=router