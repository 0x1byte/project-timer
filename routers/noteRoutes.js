const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {
    getNotes,
    setNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController')

router.get("/:project_id",protect,getNotes).post("/:project_id",protect,setNote)
router.put("/:note_id",protect,updateNote).delete("/:note_id",protect,deleteNote)

module.exports = router