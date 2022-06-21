const express = require('express')
const passport = require('passport')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {
    registerUser,
    loginUser,
    getMe,
    uploadProfile,
    changePassword
} = require('../controllers/userController')


router.post("/register",registerUser).post("/login",loginUser).get("/getme",protect,getMe)
router.put("/upload_profile",protect,uploadProfile).put("/change_password",protect,changePassword)

// @desc Login Auth with Google
// @route   GET /users/google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }))

// @desc Google Callback
// @route   GET /users/google/callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
      res.redirect('/')
    }
  )


module.exports = router