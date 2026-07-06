const mongoose = require('mongoose');
const OptimizationSchema = new mongoose.Schema(
{
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    jobRole:{
        type:String,
        required:true
    },
    jdScore:{
        type:Number,
        default:0
    },
    matchedSkills:[String],
    missingSkills:[String],
    strengths:[String],
    weakness:[String],
    recommendations:[String]
},
{
    timestamps:true
}
)
module.exports = mongoose.model('Optimization',OptimizationSchema)