const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const request = require('../models/requestSchema');
const Course = require('../models/courseSchema');
const Scheduled = require('../models/scheduledEventsSchema');
const ClassRoom = require('../models/classRoomSchema');
const User = require('../models/userSchema');
const departments = require('../models/departmentSchema');
const instructorRouter = express.Router();
const Authenticate = require('../authenticate');
const userRouter = require('./userRouter');
//view courses
instructorRouter.route('/viewCourses/:id').get(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //working and complete
    const user =await User.findOne({ id: req.params.id});
    if(user.id == req.user.id){
        if(user!=null){
            res.send(user.courses);
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//view schedule
instructorRouter.route('/slotsAssignment/:id').get(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //working and complete
    const user =await User.findOne({ id: req.params.id});
    if(user.id == req.user.id){
        if(user!=null){
            res.send(user.schedule);
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
}); 
//view all staff in his/her department
instructorRouter.route('/staffInSameDepartment/:id').get(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //working 
    const user =await User.findOne({ id: req.params.id});
    if(user.id == req.user.id){
        if(user!=null){
            const departmentID = user.department;
            const department = await departments.findOne({id : departmentID});
            if(department!=null){
                const staff=department.staff;
                let staffMembers =[];
                for(let i=0;i<staff.length ;i++){
                    let temp =staff[i];
                    const staffMember = await User.findOne({id : temp});
                    staffMembers.push(staffMember)
                }
                res.send(staffMembers);
            }else{
                res.status(404).send("department not found");    
            }
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
   
//view all staff  per course
instructorRouter.route('/staffPercourse/:id').get(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //working 
    const user =await User.findOne({ id: req.params.id});
    if(user.id == req.user.id){
        if(user!=null){
            const courses = user.courses;
            if(courses.length!=0){
                let staffPerEachcourse = [];
                for(let i=0;i<courses.length;i++){
                    const courseID =courses[i];
                    const course = await Course.findOne({id : courseID});
                    const staffIncourse = course.staff;
                    let staffMembersPerCourse =[];
                    for(let i=0;i<staffIncourse.length ;i++){
                        let temp =staffIncourse[i];
                        const staffMember = await User.findOne({id : temp});
                        if(staffMember!==null)
                            staffMembersPerCourse.push(staffMember);
                    }
                    staffPerEachcourse.push({courseID,staffMembersPerCourse}); 
                }
                if(staffPerEachcourse.length!=0){
                    res.send(staffPerEachcourse);
                }else{
                    res.status(404).send("Courses don't have any users");
                }
            }else{
                res.status(404).send("The user is not assigned to any course");    
            }
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
 //Assign an academic member to an unassigned slots in course(s)
 instructorRouter.route('/assignAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:day&:slot&:tutorial')
                                                        .post(Authenticate.auth,Authenticate.authInstructor,async (req, res) => {  
    const courseInstructor =await User.findOne({ id: req.params.courseInstructorID});
    if(courseInstructor.id == req.user.id){
        if(courseInstructor!=null){
            const course = await Course.findOne({id : req.params.courseID});
            if(course!=null){
                if(courseInstructor.courses.includes(course.id)){
                    const courseStaffID =await User.findOne({ staffMember:req.params.acadmicMemberID});
                    if(course.staff.includes(req.params.acadmicMemberID)){
                        const room = await ClassRoom.findOne({roomId : req.params.roomID});
                        if(room!=null){
                            let acadmicMember =await User.findOne({id : req.params.acadmicMemberID});
                            for(let i = 0 ; i < 6 ;i++){
                                if(acadmicMember.schedule[i][0] == req.params.day){
                                    if(acadmicMember.schedule[i][req.params.slot] != null ){
                                        res.send("Acadmic member is busy in this slot");
                                    }else{
                                        acadmicMember.schedule[i][req.params.slot]={room:req.params.roomID,tutorial:req.params.tutorial,course:req.params.courseID};
                                        //await acadmicMember.save();
                                        await User.findOneAndUpdate({id : acadmicMember.id},{schedule : acadmicMember.schedule});
                                        course.schedule[i][req.params.slot].push({room:req.params.room,tutorial:req.params.tutorial,academicMember:acadmicMember.id});
                                        //await course.save();
                                        await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                        res.send("Schedule Updated");
                                    }
                                    break;
                                }
                            }
                        }else
                            res.status(404).send("Room is not found"); 
                    }else
                        res.status(404).send("Acadmic member is not assigned for this course"); 
                }else
                    res.status(404).send("User is not an instrucor for this course");
            }else
                res.status(404).send("Course not found");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
 //Update an academic member assignment in course(s)
 instructorRouter.route('/updateAssignmentAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:oldRoomID&:day&:slot&:oldDay&:slot&:tutorial&:oldTutorial')
                                                        .put(Authenticate.auth,Authenticate.authInstructor,async (req, res) => {  
    const courseInstructor =await User.findOne({ id: req.params.courseInstructorID});
    if(courseInstructor.id == req.user.id){
        if(courseInstructor!=null){
            const course = await Course.findOne({id : req.params.courseID});
            if(course!=null){
                if(courseInstructor.courses.includes(course.id)){
                    const courseStaffID =await User.findOne({ staffMember:req.params.acadmicMemberID});
                    if(course.staff.includes(req.params.acadmicMemberID)){
                        const room = await ClassRoom.findOne({roomId : req.params.roomIDID});
                        if(room!=null){
                            let acadmicMember =await User.findOne({id : req.params.acadmicMemberID});
                            for(let i = 0 ; i < 6 ;i++){
                                if(acadmicMember.schedule[i][0] == req.params.oldDay){
                                    if(acadmicMember.schedule[i][req.params.slot] != null ){
                                        res.send("Acadmic member is busy in this slot");
                                    }else{
                                        for(let k=0; k<course.schedule[i][req.params.slot].length;k++){
                                            if(course.schedule[i][req.params.slot][k].room===req.params.roomID){
                                                if(course.schedule[i][req.params.slot][k].room===req.params.oldTutorial){
                                                    if(course.schedule[i][req.params.slot][k].academicMember===academicMember.id){
                                                        acadmicMember.schedule[i][req.params.slot]=null;
                                                        await User.findOneAndUpdate({id : acadmicMember.id},{schedule : acadmicMember.schedule});
                                                        course.schedule[i][req.params.slot].splice(k,1);
                                                        await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                                        res.send("Schedule Updated");
                                                    }
                                                }    
                                            }
                                        }
                                        
                                    }
                                    if(acadmicMember.schedule[i][0] == req.params.day){
                                        if(acadmicMember.schedule[i][req.params.slot] != null ){
                                            res.send("Acadmic member is busy in this slot");
                                        }else{
                                            acadmicMember.schedule[i][req.params.slot]={room:req.params.roomID,tutorial:req.params.tutorial,course:req.params.courseID};
                                            //await acadmicMember.save();
                                            await User.findOneAndUpdate({id : acadmicMember.id},{schedule : acadmicMember.schedule});
                                            course.schedule[i][req.params.slot].push({room:req.params.room,tutorial:req.params.tutorial,academicMember:acadmicMember.id});
                                            //await course.save();
                                            await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                            res.send("Schedule Updated");
                                        }
                                        break;
                                    }
                                }
                            }
                        }else
                            res.status(404).send("Room is not found"); 
                    }else
                        res.status(404).send("Acadmic member is not assigned for this course"); 
                }else
                    res.status(404).send("User is not an instrucor for this course");
            }else
                res.status(404).send("Course not found");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//Delete an academic member assignment in course(s)
instructorRouter.route('/assignAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:day&:slot&:tutorial')
                                                        .delete(Authenticate.auth,Authenticate.authInstructor,async (req, res) => {  
    const courseInstructor =await User.findOne({ id: req.params.courseInstructorID});
    if(courseInstructor.id == req.user.id){
        if(courseInstructor!=null){
            const course = await Course.findOne({id : req.params.courseID});
            if(course!=null){
                if(courseInstructor.courses.includes(course.id)){
                    const courseStaffID =await User.findOne({ staffMember:req.params.acadmicMemberID});
                    if(course.staff.includes(req.params.acadmicMemberID)){
                        const room = await ClassRoom.findOne({roomId : req.params.roomID});
                        if(room!=null){
                            let acadmicMember =await User.findOne({id : req.params.acadmicMemberID});
                            for(let i = 0 ; i < 6 ;i++){
                                if(acadmicMember.schedule[i][0] == req.params.day){
                                    acadmicMember.schedule[i][req.params.slot]=null;
                                        //await acadmicMember.save();
                                        await User.findOneAndUpdate({id : acadmicMember.id},{schedule : acadmicMember.schedule});
                                        for(let k=0; k<course.schedule[i][req.params.slot].length;k++){
                                            if(course.schedule[i][req.params.slot][k].room===req.params.roomID){
                                                if(course.schedule[i][req.params.slot][k].room===req.params.oldTutorial){
                                                    if(course.schedule[i][req.params.slot][k].academicMember===academicMember.id){
                                                        course.schedule[i][req.params.slot].splice(k,1);
                                                        await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                                        res.send("Schedule Updated");
                                                    }
                                                }    
                                            }
                                        }
                                        course.schedule[i][req.params.slot].push({room:req.params.room,tutorial:req.params.tutorial,academicMember:acadmicMember.id});
                                        //await course.save();
                                        await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                        res.send("Schedule Updated");
                                    
                                }
                            }
                        }else
                            res.status(404).send("Room is not found"); 
                    }else
                        res.status(404).send("Acadmic member is not assigned for this course"); 
                }else
                    res.status(404).send("User is not an instrucor for this course");
            }else
                res.status(404).send("Course not found");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//Remove an assigned academic member in course(s)
instructorRouter.route('/removeAcademicMemberFromACourse/:instructorID&:academicMemberID&:courseID').delete(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //loading and no response :(
    const instructor =await User.findOne({ id: req.params.instructorID});
    const acadmicMember =await User.findOne({ id: req.params.academicMemberID});
    const course =await Course.findOne({ id: req.params.courseID});
    
    if(instructor.id == req.user.id){
        if(instructor!=null){
            if(acadmicMember!=null){
                if(course!=null){
                    //console.log(acadmicMember.courses);
                    //console.log(course.staff);
                    //console.log(course.staff.includes(acadmicMember.id));
                    if(course.staff.includes(acadmicMember.id)){
                        for(let i=0;i<course.staff.length;i++){
                            //console.log(course.staff[i]==acadmicMember.id);
                            if(course.staff[i]==acadmicMember.id){
                                course.staff.splice(i,1);
                                await Course.findOneAndUpdate({id : course.id},{staff : course.staff});
                                //console.log("el mafrood staff deleted");
                                //await course.save();
                            }
                        }
                        for(let i=0;i<acadmicMember.courses.length;i++){
                            if(acadmicMember.courses[i]==course.id){
                                acadmicMember.courses.splice(i,1);
                                await User.findOneAndUpdate({id : acadmicMember.id},{courses : acadmicMember.courses});
                                //console.log("el mafrood course deleted");
                                //await academicMember.save();
                            }
                        }
                        for(let i = 0 ; i < 6 ;i++){
                            for(let j=1; j<6 ;j++ ){
                                acadmicMember.schedule[i][j]=null;
                                await User.findOneAndUpdate({id : acadmicMember.id},{schedule : acadmicMember.schedule});
                                for(let k=0; k<course.schedule[i][j].length;k++){
                                    if(course.schedule[i][j][k].academicMember==acadmicMember.id){
                                        course.schedule[i][j].splice(k,1);
                                        await Course.findOneAndUpdate({id : course.id},{schedule : course.schedule});
                                    }
                                }
                            }   
                        }
                        res.send("schedules Updated");
                    }else
                        res.status(404).send("Academic member is not assigned to this course");
                }else
                    res.status(404).send("Course not found");
            }else
                res.status(404).send("No Academic member  with this id"); 
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
    
});

//Assign an academic member in each of his/her course(s) to be a course coordinator.
instructorRouter.route('/assignCourseCoordinator/:courseInstructorID/:acadmicMemberID/:courseID').put(Authenticate.auth,Authenticate.authInstructor,async (req, res) => { //working
    const instructor =await User.findOne({ id: req.params.courseInstructorID});
    const acadmicMember =await User.findOne({ id: req.params.acadmicMemberID});
    const course =await Course.findOne({ id: req.params.courseID});
    if(instructor.id == req.user.id){
        if(instructor!=null){
            if(acadmicMember!=null){
                if(course!=null){
                    if(course.staff.includes(acadmicMember.id)){
                        acadmicMember.type="Course Coordinator";
                        await User.findOneAndUpdate({id : acadmicMember.id},{type : acadmicMember.type});
                        course.courseCoordinatorID = acadmicMember.id;
                        await Course.findOneAndUpdate({id : course.id},{courseCoordinatorID : course.courseCoordinatorID});
                        res.send("Academic Member has been assigned as a course coordinator");
                    }else
                        res.status(404).send("Academic member is not assigned to this course");
                }else
                    res.status(404).send("Course not found");
            }else
                res.status(404).send("No Academic member  with this id"); 
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});

    module.exports = instructorRouter;