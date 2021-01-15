const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken");
const bcrypt=require('bcrypt');
const User = require('../models/userSchema');
const Sign = require('../models/signInSchema');
const Authenticate = require('../authenticate');
const userRouter = express.Router();
var signInStamp = 0;




userRouter.route('/updateEmail')
.put(Authenticate.auth,(req,res)=>{
    console.log(req.user.id)
    User.findOneAndUpdate({id:req.user.id},
    {email: req.body.email},  
    {new: true})
    .then((user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);

    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({Error:err});  
    });
});
////Email of token doesn't change

userRouter.route('/updatepassword')
.put(Authenticate.auth,async(req,res)=>{
    const salt =   await bcrypt.genSalt(10);
    var mail=await req.user.id;
    console.log(mail);
    req.body.password =   await bcrypt.hash(req.body.password, salt);
    await User.findOneAndUpdate({id:mail},
    { password: req.body.password },  
    { new: true })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({password:user.password}); 
     })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({Error:err});  
    });
});

userRouter.route('/signin')
.post(Authenticate.auth,(req,res)=>{
    Sign.findOne({staffId:req.user.id})
    .then((sign)=>{
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let dateSignIn = ""+day+"-"+month+"-"+year;
        var hours = d.getHours(); 
        var minutes= d.getMinutes();
        if (hours>=7 && hours<19){
            if(!sign.currentMonth.includes(""+month)){
                sign.currentMonth.push(""+month);
            }
            let index=sign.currentMonth.indexOf(month);
            if (!sign.days[index].includes(dateSignIn)){
                sign.days[index].push(dateSignIn);
            }
            //sign.signInOut[index][sign.days[index].indexOf(dateSignIn)].push("Sign In");
            
            sign.signInStamp = [hours,minutes];
            res.send("Signed In");
            // user.timeStamp[index][sign.days[index].indexOf(dateSignIn)].push(arr);
        }
        else{
            res.render("You can't sign in now");
        }
    })
    .catch((err) => {console.error(err); });
});

function findLastIndex(array, key) {
    var index = array.slice().reverse().indexOf(key);
    var count = array.length - 1
    var finalIndex = index >= 0 ? count - index : index;
    console.log(finalIndex)
    return finalIndex;
}
  
userRouter.route('/signout')
.post(Authenticate.auth,(req,res)=>{
    Sign.findOne({staffId:req.user.id})
    .then((sign)=>{
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let dateSignIn = ""+day+"-"+month+"-"+year;
        var hours = d.getHours() 
        var minutes= d.getMinutes();
        if (hours>7 && hours<=19){
            let index=sign.currentMonth.indexOf(month);
            var signIn = sign.signInStamp;
            if (signIn[0] !== 0 && signIn[1]!==0)
            {   
                var currentHours = user.hours[index][sign.days[index].indexOf(dateSignIn)];
                var diffMin = (60-signIn[1])+minutes;
                var diffHours = (hours - signIn[0])+diffMin/60;
                sign.hours[index][sign.days[index].indexOf(dateSignIn)] = currentHours + diffHours;
                sign.signInStamp = [0,0];
            }
            else{
                //res.render("Invalid Sign out without Signing In");
            }
        }
        else{
            sign.signInStamp = [0,0];
            //res.render("You can't sign out now");
        }
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/attendance')
.get(Authenticate.auth,(req,res)=>{
    Sign.findOne({staffId:req.user.id})
    .then((sign)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json"); 
        res.json(sign.days);
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/missingdays')
.get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Missing Days: "+user.missingDays); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/extrahours').get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Extra Hours: "+user.extraHours); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/missinghours').get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Missing Hours: "+user.missingHours); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/schedule').get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Schedule: "+user.schedule); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/salary')
.get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Salary: "+user.salary); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/department')
.get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Department: "+user.department); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/faculty')
.get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Faculty: "+user.faculty); 
    })
    .catch((err) => {console.error(err); });
});

userRouter.route('/notifications')
.get(Authenticate.auth,(req,res)=>{
    User.findOne({id:req.user.id})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send("Notifications: "+user.notifications); 
    })
    .catch((err) => {console.error(err); });
});

module.exports = userRouter;