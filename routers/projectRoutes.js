const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {
    getProjects,
    updateProject,
    deleteProjects,
    setProject
} = require('../controllers/projectController')

router.get("/",protect,getProjects).post("/",protect,setProject)
router.put("/:project_id",protect,updateProject).delete("/:project_id",protect,deleteProjects)

module.exports = router