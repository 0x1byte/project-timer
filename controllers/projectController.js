const asyncHandler = require('express-async-handler')
const Projects = require('../model/projectModel')
const User = require('../model/userModel')

// @desc    getprojects
// @route   GET /projects/
// @access  Private
const getProjects = asyncHandler(async (req,res) => {
    const projects = await Projects.find({user: req.user})
    res.status(200).json(projects)
})

// @desc    setProject
// @route   POST /projects/
// @access  Private
const setProject = asyncHandler(async (req,res) => {
    const {name} = req.body
    if(!name){
        res.status(400)
        throw new Error("Please add a name")
    }
    const projects = await Projects.create({
        name: name,
        user: req.user
    })
    res.status(200).json(projects)
})

// @desc    updateProject
// @route   PUT /projects/:project_id
// @access  Private
const updateProject = asyncHandler(async (req,res) => {
    const projects = await Projects.findById(req.params.project_id)
    const user = await User.findById(req.user)
    if(!user){
      res.status(401)
      throw new Error('User not found')
    }
    if(!projects){
      res.status(400)
      throw new Error('Project not found')
    }
    if(projects.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized!')
    }
    const updatedProject = await Projects.findByIdAndUpdate(req.params.project_id,req.body,{new: true})
    res.status(200).json(updatedProject)
})

// @desc    deleteProjects
// @route   DELETE /projects/:project_id
// @access  Private
const deleteProjects = asyncHandler(async (req,res) => {
    const projects = await Projects.findById(req.params.project_id)
    const user = await User.findById(req.user)
    if(!user){
      res.status(401)
      throw new Error('User not found')
    }
    if(!projects){
      res.status(400)
      throw new Error('Project not found')
    }
    if(projects.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized!')
    }
    await projects.remove()
    res.status(200).json({id:req.params.postId})
})



module.exports = {
    getProjects,
    updateProject,
    deleteProjects,
    setProject
}