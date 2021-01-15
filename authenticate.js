const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken");
const bcrypt=require('bcrypt');
const User = require('./models/userSchema');
const tokenSecret = "top secret";
const router = express.Router();

//////////////Authorization////////////////
exports.auth = (req,res,next)=>{
    try{
        var token = req.headers['x-access-token'];
            if (token) {
                const verified = jwt.verify(token, tokenSecret);
                //console.log(verified);
                if(!verified){
                    return res.status(401).json({msg:'authorization failed'});
                }
                req.user=verified;
                next();
            }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
 exports.authHr = (req,res,next)=>{
    try{
        if (req.user.type == "HR"){
            next();
        }
        else{
            return res.status(401).json({msg:'You are not authorized to do this action'});
        }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
 exports.authAcademic = (req,res,next)=>{
    try{
        if (req.user.type != "HR"){
            next();
        }
        else{
            return res.status(401).json({msg:'You are not authorized to do this action'});
        }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
 exports.authHod = (req,res,next)=>{
    try{
        if (req.user.type == "HOD"){
            next();
        }
        else{
            return res.status(401).json({msg:'You are not authorized to do this action'});
        }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
 exports.authCoordinator = (req,res,next)=>{
    try{
        if (req.user.type == "Course Coordinator"){
            next();
        }
        else{
            return res.status(401).json({msg:'You are not authorized to do this action'});
        }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
 exports.authInstructor = (req,res,next)=>{
    try{
        if (req.user.type == "Course Instructor"){
            next();
        }
        else{
            return res.status(401).json({msg:'You are not authorized to do this action'});
        }
    }
    catch(error){
     res.status(500).json({error:error.message});
 
    }
 }
