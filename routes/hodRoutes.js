const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const request = require('../models/requestSchema');
//const Department = require('../models/requestSchema');
const Course = require('../models/courseSchema');
const Department = require('../models/departmentSchema');
const Scheduled = require('../models/scheduledEventsSchema');
const Location = require('../models/classRoomSchema');
const User = require('../models/userSchema');
const hodRouter = express.Router();
const Authenticate = require('../authenticate');



hodRouter.route('/viewLeaveRequests/:departmentId')
.get(Authenticate.auth,Authenticate.authHod,async (req, res) => {
    const b = await Department.findOne({id:req.params.departmentId});
    if(b.HOD == req.user.id){
        await request.find({ departmentId: req.params.departmentId })
        .then((results) => res.json({ "Requests": results }));
    }
    else{
        res.status(401).json({ msg: 'Authorization Failed' });
    }
});

hodRouter.route('/viewLeaveRequests/reject/:requestId').put(Authenticate.auth,Authenticate.authHod,async (req, res) => {
    const b = await Department.findOne({id:req.params.departmentId});
    if(b.HOD == req.user.id){
    try {
        let id = req.params.requestId;
        const r = await request.findOne({ requestId: req.params.requestId });
        r.acceptanceStatus = "rejected";
        await r.save();

        let t = await User.findOne({ id: r.staffId });
        await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
        await t.save();
        res.send("Request rejected");
    }
    catch (error) { res.status(500).json({ error: error.message }); }}
    else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});

hodRouter.route('/viewLeaveRequests/accept/:requestId').put(Authenticate.auth,Authenticate.authHod,async (req, res) => {
    const b = await Department.findOne({id:req.params.departmentId});
    if(b.HOD == req.user.id){
    try {
        let id = req.params.requestId;
        const r = await request.findOne({ requestId: req.params.requestId });
        const u = await User.findOne({ id: r.staffId });
        r.acceptanceStatus = "accepted";
        //await r.save();
        if (r.requestType == "accidentalLeave") {
            if (u.accidentalLeaves > 0 && u.annualLeaves >= 1) {
                var filter = u.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                u.accidentalLeaves--;
                u.annualLeaves--;
                await User.findOneAndUpdate({ id: r.staffId }, { missingDays: filter, accidentalLeaves: u.accidentalLeaves, annualLeaves: u.annualLeaves });
                r.acceptanceStatus = "accepted";
                await r.save();
                let t = await User.findOne({ id: r.staffId });
                await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                await t.save();
                res.send("Request accepted");
            }
            else {
                if (u.accidentalLeaves < 0 && u.annualLeaves < 1)
                    res.send("NO annual or accidental leaves left");
                else {
                    if (u.accidentalLeaves < 0)
                        res.send("NO accidental leaves left");
                    else {
                        res.send("NO annual leaves left");
                    }
                }
            }
        }
        else {
            if (r.requestType == "sickLeave") {
                var filter = u.missingDays.filter(date => date != r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear());
                await User.findOneAndUpdate({ id: r.staffId }, { missingDays: filter });
                r.acceptanceStatus = "accepted";
                await r.save();
                let t = await User.findOne({ id: r.staffId });
                await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                await t.save();
                res.send("Request accepted");
            }
            else {
                if (r.requestType == "maternityLeave") {
                    u.maternityDaysLeft = 365;
                    r.acceptanceStatus = "accepted";
                    let s = new Scheduled({
                        date: r.requestDay.setHours(0, 0, 0, 0),
                        typeOfAction: "maternityLeave",
                        requestId: r.requestId
                    });
                    await s.save();
                    await User.findOneAndUpdate({ id: r.staffId }, { maternityDaysLeft: u.maternityDaysLeft });
                    await r.save();
                    let t = await User.findOne({ id: r.staffId });
                    await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                    await t.save();
                    res.send("Request accepted");
                }
                else {
                    if (r.requestType == "compensationLeave") {
                        let s = new Scheduled({
                            date: r.requestDay.setHours(2, 0, 0, 0),
                            typeOfAction: "compensationLeave",
                            requestId: r.requestId
                        });
                        await s.save();
                        r.acceptanceStatus = "accepted";
                        await r.save();
                        let t = await User.findOne({ id: r.staffId });
                        await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                        await t.save();
                        res.send("Request accepted");
                    }
                    else {
                        if (r.requestType == "replacement") {
                            if (u.annualLeaves >= 1) {
                                let s = new Scheduled({
                                    date: r.requestDay.setHours(2, 0, 0, 0),
                                    typeOfAction: "annualLeave",
                                    requestId: r.requestId
                                });
                                await s.save();
                                r.acceptanceStatus = "accepted";
                                await r.save();
                                u.annualLeaves--;
                                await User.findOneAndUpdate({ id: r.staffId }, { annualLeaves: u.annualLeaves });
                                res.send("Request accepted");
                                await request.findOneAndUpdate({ requestId: req.params.requestId }, { acceptanceStatus: R.acceptanceStatus });
                                let t = await User.findOne({ id: r.staffId });
                                await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                                await t.save();
                            }
                            else {
                                res.send("Request denied. no annual leaves left");
                            }
                        }
                        else {
                            if (r.requestType == "changeDayOff") {
                                u.daysOff[1] = r.newDayOff;
                                r.acceptanceStatus = "accepted";
                                await r.save();
                                await User.findOneAndUpdate({ id: r.staffId }, { dayOff: u.daysOff });
                                let t = await User.findOne({ id: r.staffId });
                                await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                                await t.save();
                                res.send("Request accepted");
                            }
                        }
                    }
                }
            }
        }
    }
    catch (error) { res.status(500).json({ error: error.message }); }}
    else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});

hodRouter.route('/viewCourseCoverage/:courseId').get(Authenticate.auth,Authenticate.authHod,async (req, res) => {
    const b = await Department.findOne({id:req.params.departmentId});
    if(b.HOD == req.user.id){
        await Course.findOne({ id: req.params.courseId }).then((result) => res.send({ "Coverage": ((result.totalSlotsTaken / result.totalSlots) * 100) + "%" }));
    }
    else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//obaya's routes
//Assign a course instructor for each course in his department.
hodRouter.route('/AssignCourseInstructor/:hodID&:academicMemberID&:courseID').post(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    
    const hod = await User.findOne({id : req.params.hodID});
    const academicMember = await User.findOne({id : req.params.academicMemberID});
    const course = await Course.findOne({id : req.params.courseID});
    const b = await Department.findOne({id:course.department});
    if(b.HOD == req.user.id){
    
        
        if(hod!=null){
            if(academicMember!=null){
                if(course!=null){
                    academicMember.type="Course Instructor";
                    await User.findOneAndUpdate({id : acadmicMember.id},{type : acadmicMember.type});
                    res.send('assigned successfully');
                }else
                    res.status(404).send("course not found");
            }else
                res.status(404).send("No academic member with this id");
        }else{
            res.status(404).send("No user with this id");
        }
    }
    else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//Update a course instructor for each course in his department.
hodRouter.route('/UpdateCourseInstructor/:hodID&:academicMemberID&:courseID').put(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    const academicMember = await User.findOne({id : req.params.academicMemberID});
    const course = await Course.findOne({id : req.params.courseID});
    const b = await Department.findOne({id:course.department});
    if(b.HOD == req.user.id){
        if(hod!=null){
            if(academicMember!=null){
                if(course!=null){
                    academicMember.type="Course Instructor";
                    await User.findOneAndUpdate({id : acadmicMember.id},{type : acadmicMember.type});
                    res.send('update successfully');
                }else
                    res.status(404).send("course not found");
            }else
                res.status(404).send("No academic member with this id");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//demote a course instructor for each course in his department.
hodRouter.route('/deleteCourseInstructor/:hodID&:academicMemberID&:courseID').delete(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    const academicMember = await User.findOne({id : req.params.academicMemberID});
    const course = await Course.findOne({id : req.params.courseID});
    const b = await Department.findOne({id:course.department});
    if(b.HOD == req.user.id){
        if(hod!=null){
            if(academicMember!=null){
                if(course!=null){
                    if(academicMember)
                    academicMember.type="Staff Member";
                    await User.findOneAndUpdate({id : acadmicMember.id},{type : acadmicMember.type});
                    res.send('demoted successfully');
                }else
                    res.status(404).send("course not found");
            }else
                res.status(404).send("No academic member with this id");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//View all the staff in his/her department
hodRouter.route('/viewAllStaffInMyDepartment/:hodID').get(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    if(hod.id == req.user.id){
        if(hod!=null){
            const departmentID = hod.department;
            const department = await Department.findOne({id : departmentID});

            let displayStaff =[];
            for(let i=0; i<department.courses.length;i++){
                const course = await Course.findOne({id : department.courses[i]});
                console.log(department);
                //res.json(course);
                let displayStaffPerCourse =[];
                if(course.staff!=null){ 
                    for(let j=0;j<course.staff.length;j++){
                        console.log(course);
                        const staffMember = await User.findOne({id : course.staff[j]});
                        //console.log(staffMember);
                        displayStaffPerCourse.push(staffMember);
                    }
                }
                displayStaff.push({course:course.id , staff : displayStaffPerCourse});
            }
            console.log(displayStaff);
            res.json(displayStaff);
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//View all the staff in his/her department per course
hodRouter.route('/viewAllStaffPerCourse/:hodID').get(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    if(hod.id == req.user.id){
        if(hod!=null){
            const departmentID = hod.department;
            const department = await Department.findOne({id : departmentID});
            
            let displayStaff =[];
            for(let i=0; i<department.courses.length;i++){
                if(department.courses[i]!==null){
                    const course = await Course.findOne({id : department.courses[i]});
                    console.log(course);
                    let displayStaffPerCourse =[];
                    for(let j=0;j<course.staff.length;j++){
                        if(course.staff[j]!==null){
                            const staffMember = await User.findOne({id : course.staff[j]});
                            console.log(staffMember);
                            if(staffMember!==null)
                                displayStaffPerCourse.push(staffMember);
                        }
                    }
                    displayStaff.push({course:course.id , staff : displayStaffPerCourse});
                }
            }
            res.send(displayStaffPerCourse);
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//view the day off of all the staff members
hodRouter.route('/dayoffOfStaffMembers/:hodID').get(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    if(hod.id == req.user.id){
        if(hod!=null){
            const departmentID = hod.Department;
            const department = await Department.findOne({id : departmentID});
            let displayDayOffs =[];
            for(let i=0; i<department.staff;i++){
                const staffMember = await User.findOne({id : department.staff[i]});
                displayDayOffs.push({staffMember:staffMember.id  , dayOffs:staffMember.daysOff});
            }
            res.send(displayDayOffs);
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//view the day off of a the staff member
hodRouter.route('/dayoffOfStaffMember/:hodID/:staffID').get(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    const staffMember = await User.findOne({id : req.params.staffID});
    if(hod.id == req.user.id){
        if(hod!=null){
            if(staffMember!=null){
                if(hod.department==staffMember.department)
                    res.send({staffMember:staffMember.id  , dayOffs:staffMember.daysOff});
                else
                    res.status(404).send("staff member doesn't share same department");
            }else
                res.status(404).send("staff member is not found");
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
//view the schedule of a the staff member
hodRouter.route('/scheduleOfStaffMember/:hodID/:staffID').get(Authenticate.auth,Authenticate.authHod,async (req,res)=>{
    const hod = await User.findOne({id : req.params.hodID});
    const staffMember = await User.findOne({id : req.params.staffID});
    if(hod.id == req.user.id){
        if(hod!=null){
            if(staffMember!=null){
                if(hod.department==staffMember.department)
                    res.send({staffMember:staffMember.id  , schedule:staffMember.schedule});
                else
                    res.status(404).send("staff member doesn't share same department");
            }else{
                res.status(404).send("staff member is not found");
            }
                
        }else{
            res.status(404).send("No user with this id");
        }
    }else{
        res.status(401).json({ msg: 'authorization failed' });
    }
});
module.exports = hodRouter;