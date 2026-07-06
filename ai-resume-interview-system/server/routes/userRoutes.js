const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');
const {getProfile,updateProfile, uploadResume ,analyzeResume,generateATSResume,getAnalysisHistory} =require('../controllers/userController');
const upload = require('../middleware/upload');


router.get('/profile',authMiddleware,getProfile);
router.put(
    '/profile',
    authMiddleware,
    upload.single('profile_images'),
    updateProfile
);
router.put(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);
router.post('/resume/analyze',authMiddleware,analyzeResume);
router.get(
  "/analysis-history",
  authMiddleware,
  getAnalysisHistory
);
router.post(
  "/resume/generate-ats",
  authMiddleware,
  generateATSResume
);
router.post("/analysis-history",authMiddleware,getAnalysisHistory);
module.exports=router;
