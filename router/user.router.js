const express=require('express')
const { getLogin } = require('../controller/user.controller'); 
const userRouter=express.Router();


userRouter.post('/login',getLogin);

module.exports=userRouter