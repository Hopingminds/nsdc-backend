const express=require('express')
const multer = require('multer');
const { createStudent , getStudents } = require('../controller/student.controller'); 
const authMiddleware =require('../middleware/auth.middleware')
const studentRouter=express.Router();


const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
studentRouter.post('/createStudent',upload.single('file'),createStudent);
studentRouter.get('/getStudents',getStudents);


module.exports=studentRouter