const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');

//register API
const register = async(req,res)=>{
    try{
        const {fullName,email,password} = req.body;

        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:'user already exists'})
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser= new User({
            fullName,
            email,
            password:hashedPassword
        });
        await newUser.save();
        res.status(201).json({msg:'Registration Succesful'});
    }
    catch(err){
        res.status(500).json({msg:"Server error"});
    }
}

//LOGIN API
const login=async(req,res)=>{
    try{
            const {email,password}=req.body;
            const user = await User.findOne({email});
            
            if(!user){
                return res.status(400).send({msg:'user not found'});
            }

            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).send({msg:'password is not valid'});
            }

            const token=jwt.sign(
                {id:user._id},
                process.env.JWT_SECRET,
                {expiresIn:'1d'}
            );

            res.status(200).json({
                msg:'login successful',
                token,
                user:{
                    id:user._id,
                    fullName:user.fullName,
                    email:user.email
                }
            })
    }
    catch (err) {
    console.log(err);
    res.status(500).json({msg: "Server error",error: err.message
  });
    }
};
module.exports={register,login};
