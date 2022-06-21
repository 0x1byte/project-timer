const asyncHandler = require('express-async-handler')
const Note = require('../model/noteModel')
const User = require('../model/userModel')
const Projects = require('../model/projectModel')
const mongoose = require('mongoose')

// @desc getNotes
// @route GET /notes/:project_id
// @access Private
const getNotes = asyncHandler(async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.project_id)){
        res.status(400)
        throw new Error('Plesae add a true id')
    }
    const projects = await Projects.findById(req.params.project_id)
    if(!projects){
      res.status(400)
      throw new Error('Project not found')
    }
    const notes = await Note.find({project: req.params.project_id})
    if(!notes){
        res.status(400)
        throw new Error('Note not found')
    }
    res.status(200).json(notes)
})

// @desc setNote
// @route POST /notes/:project_id
// @access Private
const setNote = asyncHandler(async (req,res) => {
    const {text} = req.body
    if(!text){
        res.status(400)
        throw new Error("Please add a text")
    }
    const notes = await Note.create({
        text: text,
        user: req.user,
        project: req.params.project_id
    })
    res.status(200).json(notes)
})

// @desc updateNote
// @route PUT /notes/:note_id
// @access Private
const updateNote = asyncHandler(async (req,res) => {
    const notes = await Note.findById(req.params.note_id)
    const user = await User.findById(req.user)
    const {text} = req.body
    if(!user){
      res.status(401)
      throw new Error('User not found')
    }
    if(!notes){
      res.status(400)
      throw new Error('Note not found')
    }
    if(notes.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized!')
    }
    if(!text){
        res.status(400)
        throw new Error('Please add a text')
    }
    const updatedNote = await Note.findByIdAndUpdate(req.params.note_id,{text:text},{new: true})
    res.status(200).json(updatedNote)
})

// @desc deleteNote
// @route DELETE /notes/:note_id
// @access Private
const deleteNote = asyncHandler(async (req,res) => {
    const notes = await Note.findById(req.params.note_id)
    const user = await User.findById(req.user)
    if(!user){
      res.status(401)
      throw new Error('User not found')
    }
    if(!notes){
      res.status(400)
      throw new Error('Note not found')
    }
    if(notes.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized!')
    }
    await notes.remove()
    res.status(200).json({id:req.params.note_id})
})

module.exports = {
    getNotes,
    setNote,
    updateNote,
    deleteNote
}