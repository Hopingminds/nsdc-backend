const express=require('express')
const multer = require('multer');
const { createStudent , getStudents } = require('../controller/cart.controller'); 
const authMiddleware =require('../middleware/auth.middleware')
const userCart=express.Router();


const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
userCart.post('/createStudent',upload.single('file'),createStudent);
userCart.get('/getStudents',getStudents);


module.exports=userCart