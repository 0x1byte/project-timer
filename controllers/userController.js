const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

// @desc    registerUser
// @route   POST /users/register
// @access  Public
const registerUser = asyncHandler(async (req,res) => {
    const{name,username,email,password} = req.body;
    if(!name || !username || !email || !password){
        res.status(400)
        throw new Error('Please fill all fields!')
    }
    // check if user exists
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400)
        throw new Error("User already exists")
    }
    // hashed Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    // create user
    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword
    })
    if(user){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
}) 

// @desc    loginUser
// @route   POST /users/login
// @access  Public
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body
    //check for user email
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

// @desc    getMe
// @route   POST /users/getme
// @access  Private
const getMe = asyncHandler(async (req,res) => {
    const {_id,name,username,email,profile} = await User.findById(req.user)
    res.status(200).json({
        id: _id,
        name,
        username,
        email,
        profile
    })
}) 

// @desc    uploadProfile
// @route   PUT /users/upload_profile
// @access  Private
const uploadProfile = asyncHandler(async (req,res) => {
    res.status(200).json({message: "uploadProfile"})
}) 

// @desc    changePassword
// @route   PUT /users/change_password
// @access  Private
const changePassword = asyncHandler(async (req,res) => {
    const {newPassword} = req.body
    const user = await User.findById(req.user)
    if(!newPassword){
        res.status(401)
        throw new Error('Please add a new password')
    }
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // hashed Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword,salt)
    const updatedUser = await User.findByIdAndUpdate(req.user,{password: hashedPassword},{new: true}).select('-password')
    res.status(200).json(updatedUser)
}) 


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    uploadProfile,
    changePassword
}