const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const request = require('../models/requestSchema');
const Course = require('../models/courseSchema');
const ClassRoom = require('../models/classRoomSchema');
const User = require('../models/userSchema');
const acmemRouter = express.Router();
const Authenticate = require('../authenticate');
const userRouter = require('./userRouter');


acmemRouter.route('/viewSchedule/:userID').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
    if(req.params.userID == req.user.id){

    let userid = req.params.userID;
    let u = await User.findOne({id:userid})
    res.send(u.schedule);
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
}
catch(error){
    res.status(500).json({error:error.message});
}
});
//Send a replacement request to another Academic member TESTED & working
acmemRouter.route('/sendReplacementRequestToAcademicMember/:staffId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
    if(req.params.staffId == req.user.id){

    const body= req.body;
    let now = new Date;
    let r = new request({
        requestId: Date.now(),
        staffId: req.params.staffId,
        requestType: "replacement",
        reason: body.reason,
        replacementStaffId: body.replacementStaffId,
        acceptanceStatus: "pending",
        repAcceptanceStatus: "pending",
        timestamp: now,
        requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2),
        weekDay:now.toString().substring(0,3)
    });
    let sender = await User.findOne({id:req.params.staffId});
    let receiver = await User.findOne({id:req.body.replacementStaffId});
    let sch1 = sender.schedule;
    let sch2 = receiver.schedule;
    let canSwitch = true;
    bigloop:for(let i = 0; i<6; i++){
        if(!(sch1[i][0].substring(0,3))==r.weekDay)continue;
        for(let j = 1; j<6; j++){
            if(!(sch1[i][j]==null || sch2[i][j]==null)){
                canSwitch = false;
                break bigloop;
            }
        }
    }

    if(r.requestDay.getDate()<=r.timestamp.getDate()){
        res.send("You can only submit a replacement request before the requested day.");
    }
    else if(!canSwitch){
        res.send("There's a conflict between both schedules and thus this staff member can't be a replacement.");
    }
    else{
        await r.save();
        res.send("Request sent");
    }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//View replacement requests sent to you by other academic members TESTED & working
acmemRouter.route('/viewReplacementRequest/:staffId').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;
        let requestsList = await request.find({replacementStaffId:id, requestType:"replacement"});
        res.send(requestsList);
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//(Academic member) Respond to a replacement request sent by another academic member TESTED & working
acmemRouter.route('/respondToReplacementRequestByAM/:requestId').put(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{

        let id = req.params.requestId;
        let now = new Date;
        const r = await request.findOne({requestId:id});
        r.repAcceptanceStatus = req.body.repAcceptanceStatus;
        if(r.repAcceptanceStatus!= "accepted" && r.repAcceptanceStatus!= "rejected"){
            res.send("Please provide a proper response");
        }
        else if(now<r.timestamp){
            res.send("Request time has passed and thus expired.");
        }
        else{
            let u = await User.findOne({id:r.staffId});
            await u.notifications.push("Your request of ID: " + r.requestId + " has been " + r.repAcceptanceStatus);
            await u.save();
            await r.save();
            res.send("Response recorded");
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

//Send a replacement request to HOD after a staff member replied to my replacement request TESTED & working
acmemRouter.route('/sendReplacementRequestToHodAfterStaffReply/:staffId&:requestId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        let oldr = await request.findOne({requestId:req.params.requestId});
        if(oldr.repAcceptanceStatus != "accepted"){
            res.send("The replacement staff did not accept your replacement request.");
        }
        else{
            let now = new Date;
            const body= req.body;
            let r = new request({
                requestId: Date.now(),
                staffId: req.params.staffId,
                requestType: "replacement",
                reason: body.reason,
                departmentId: body.departmentId,
                replacementStaffId: oldr.replacementStaffId,
                acceptanceStatus: "pending",
                repAcceptanceStatus: "accepted",
                timestamp:now,
                requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2),
                weekDay:now.toString().substring(0,3)
            });
            if(r.requestDay.getDate()<=r.timestamp.getDate()){
                res.send("You can only submit a replacement request before the requested day.");
            }
            else{
                await r.save();
                res.send("Request sent");
            }
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a replacement request to HOD after not finding anyone to switch with... TESTED & working
acmemRouter.route('/sendReplacementRequestToHodWithoutStaffReply/:staffId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        const body= req.body;
        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "replacement",
            departmentId: body.departmentId,
            reason: body.reason,
            acceptanceStatus: "pending",
            timestamp:now,
            requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2),
            weekDay:now.toString().substring(0,3)
        });
        if(r.requestDay.getDate()<=r.timestamp.getDate()){
            res.send("You can only submit a replacement request before the requested day.");
        }
        else{
            await r.save();
            res.send("Request sent");
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a slot linking request to the course co-ordinator TESTED & working
acmemRouter.route('/sendSlotLinkingRequest/:staffId').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){
        
        const body = req.body;
        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "slotLink",
            courseID: body.courseID,
            acceptanceStatus: "pending",
            roomNumber:body.roomNumber,
            tutorialNumber:body.tutorialNumber,
            day:body.day,
            slot:body.slot,
            timestamp:now
        })
        await r.save();
        res.send("Slot linking request sent");
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a change-day-off request to the HOD TESTED & working
acmemRouter.route('/sendChangeDayOffRequest/:staffId').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        const body = req.body;
        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "changeDayOff",
            reason: body.reason,
            departmentId: body.departmentId,
            courseID: body.courseID, 
            acceptanceStatus: "pending",
            newDayOff: body.newDayOff,
            timestamp:now
        })
        if(body.newDayOff=="Friday"){
            res.send("Friday is always a holiday, so you already have it as a day off.");
        }
        else{
            await r.save();
            res.send("Change-day-off request sent");
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send an accidental leave request to HOD TESTED & working
//4. No accidental leaves can be sent if the annual balance is zero.
//can only be sent after the specidifed day
acmemRouter.route('/sendAccidentalLeaveRequest/:staffId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;            
        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "accidentalLeave",
            courseID: req.body.courseID,
            reason: req.body.reason,
            departmentId: req.body.departmentId,
            timestamp:now,
            requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2)
        })
        if(r.timestamp<=r.requestDay){
            res.send("You can't send an accidental leave request for a day that hasn't passed yet.");
        }
        else{
            await r.save();
            res.send("Accidental leave request sent");
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a maternity leave request TESTED & working
acmemRouter.route('/sendMaternityLeaveRequest/:staffId').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        let u = await User.findOne({id:req.params.staffId});
        if(u.gender != "female"){
            res.send("Maternity leaves requests can only be issued by female staff members only.");
        }
        else{
            let now = new Date;
            let r = new request({
                requestId: Date.now(),
                staffId: req.params.staffId,
                requestType: "maternityLeave",
                courseID: req.body.courseID,
                departmentId: req.body.departmentId,
                acceptanceStatus: "pending",
                documentLink:req.body.documentLink,
                timestamp:now
            })
            if(r.documentLink == ""){
                res.send("Please provide the proper documents' link.");
            }
            else{
                await r.save();
                res.send("Maternity leave request sent");
            }
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a sick leave request TESTED
acmemRouter.route('/sendSickLeaveRequest/:staffId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "sickLeave",
            courseID: req.body.courseID,
            reason: req.body.reason,
            departmentId: req.body.departmentId,
            acceptanceStatus: "pending",
            documentLink:req.body.documentLink,
            timestamp:now,
            requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2)
        })
        if(r.documentLink == ""){
            res.send("Please provide the proper documents' link.");
        }
        
        else if((now.getDate()-r.requestDay.getDate()>3 || now.getDate()-r.requestDay.getDate()<0)){
            res.send("Sick leaves can only be submitted by maximum three days after the sick day.");
        }
        else{
            await r.save();
            res.send("Sick leave request sent");
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Send a compensation leave request TESTED
acmemRouter.route('/sendCompensationLeaveRequest/:staffId&:day&:month&:year').post(Authenticate.auth,Authenticate.authAcademic,async function(req,res){ 
    try{
        if(req.params.staffId == req.user.id){

        let now = new Date;
        let r = new request({
            requestId: Date.now(),
            staffId: req.params.staffId,
            requestType: "compensationLeave",
            courseID: req.body.courseID,
            reason: req.body.reason,
            departmentId: req.body.departmentId,
            acceptanceStatus: "pending",
            timestamp:now,
            requestDay: new Date(req.params.year, (req.params.month)-1, (req.params.day),2)
        })
        if(r.requestDay<=r.timestamp){
            res.send("Please enter an appropriate day.");
        }
        else if(req.body.reason == ""){
            res.send("Please provide a proper reason for your request.");
        }
        else{
            await r.save();
            res.send("Compensation leave request sent");
        }
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//View all requests submitted by this staff member TESTED
acmemRouter.route('/viewAllRequests/:staffId').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;
        let requestsList = await request.find({staffId:id});
        res.send(requestsList);
    }
        else{
            return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//View pending requests submitted by this staff member TESTED
acmemRouter.route('/viewPendingRequests/:staffId').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;
        let requestsList = await request.find({staffId:id});
        res.send(requestsList);
        }
        else{
            return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//View accepted requests submitted by this staff member TESTED
acmemRouter.route('/viewAcceptedRequests/:staffId').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;
        let requestsList = await request.find({staffId:id, $or:[{acceptanceStatus:"accepted"},{repAcceptanceStatus:"accepted"}]});
        res.send(requestsList);
        }
        else{
            return res.status(401).json({msg:'authorization failed'});
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//View rejected requests submitted by this staff member TESTED
acmemRouter.route('/viewRejectedRequests/:staffId').get(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){

        let id = req.params.staffId;
        let requestsList = await request.find({staffId:id, $or:[{acceptanceStatus:"rejected"},{repAcceptanceStatus:"rejected"}]});
        res.send(requestsList);
    }
    else{
        return res.status(401).json({msg:'authorization failed'});
    }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//Delete a request that is still pending TESTED
acmemRouter.route('/cancelRequest/:staffId/:requestId').delete(Authenticate.auth,Authenticate.authAcademic,async function(req,res){
    try{
        if(req.params.staffId == req.user.id){
        let id= req.params.requestId;
        let now = new Date;
        let r = await request.findOne({requestId:id});
        if(r.acceptanceStatus != "pending"){
            res.send("You can't cancel a request that isn't pending.");
        }
        else if((now.getDate()-r.timestamp.getDate()<=3 && r.requestType=="sickLeave")){
            request.deleteOne({requestId:id}).then(function(){ 
                res.send("Request cancelled");
            }).catch(function(error){
                res.status(500).json({error:error.message});
            });
        }
        else if(r.staffId != req.params.staffId){
            res.send("You can't cancel a request that you didn't submit.")
        }
        else{
            request.deleteOne({requestId:id}).then(function(){ 
                res.send("Request cancelled");
            }).catch(function(error){
                res.status(500).json({error:error.message});
            });
        }
        }
        else{
            return res.status(401).json({msg:'authorization failed'});
        }
    }
    
    catch(error){
        res.status(500).json({error:error.message});
    }
    
})
module.exports = acmemRouter;
