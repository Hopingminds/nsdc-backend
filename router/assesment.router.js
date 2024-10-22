const {createAssesment}=require("../controller/assesment.controller")
const express=require('express')
const assesmentRouter=express.Router();


assesmentRouter.get('/createAssesment',createAssesment);

module.exports=assesmentRouter