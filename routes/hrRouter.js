const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken");
const bcrypt=require('bcrypt');
const User = require('../models/userSchema');
const Sign = require('../models/signInSchema');
const Location = require('../models/classRoomSchema');
const Authenticate = require('../authenticate');
const Course = require('../models/courseSchema');
const Faculty = require('../models/facultySchema');
const Department = require('../models/departmentSchema');
const ID = require('../models/idSchema');
const e = require('express');
const hrRouter = express.Router();

//Add a new Location (Classroom, Lecture Hall, Office)
hrRouter.route('/location')
.post(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Location.findOne({roomId:req.body.roomId})
    .then((loc)=>{
        if (loc==null){
            let location=new Location({maxCapacity:req.body.maxCapacity,roomId:req.body.roomId,type:req.body.type});
            location.save()
            .then((doc) => {res.json(doc);})
            .catch((err) => {console.error(err)}); 
        }
        else{
            console.log("Location Already Saved");
        }
    })
    .catch((err)=>{console.error(err)});
})
.get(Authenticate.auth, Authenticate.authHr,(req,res)=>{    //Get all the office Location
    Location.find({})
    .then((loc)=>{
        res.json(loc);
    })
    .catch((err)=>{console.error(err)});
})

//Delete a certain Room using its ID
hrRouter.route('/location/:roomId')
.delete(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Location.findOneAndRemove({roomId:req.params.roomId})
    .then((response)=>{
        res.json(response);
    })
    .catch((err)=>{console.error(err)});
})

//Change the Room Capacity of a certain Room
hrRouter.route('/location/:roomId/maxcapacity')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Location.findOneAndUpdate({roomId:req.params.roomId},
        {maxCapacity:req.body.maxCapacity},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change the Room Type (ex: From Lecture Hall to Office) 
hrRouter.route('/location/:roomId/type')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Location.findOneAndUpdate({roomId:req.params.roomId}
        ,{type:req.body.type},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change the Room Schedule 
hrRouter.route('/location/:roomId/schedule')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Location.findOneAndUpdate({roomId:req.params.roomId},{schedule:req.body.schedule},{new:true})
    .then((doc)=>{
        console.log(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Add a new Faculty 
hrRouter.route('/faculty')
.post(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOne({id:req.body.id})
    .then((fac)=>{
        if (fac == null){
            let faculty = new Faculty ({id:req.body.id,name:req.body.name,departments:req.body.departments}); //Faculy should be added with departments array Empty
            faculty.save()
            .then((doc)=>{res.json(doc)})
            .catch((err)=>console.error(err));
        }
        else{
            console.log('Faculty already Exists');
        }
    })
    .catch((err)=>{
        console.error(error);
    })
});

//Delete a certain Faculty 
hrRouter.route('/faculty/:id')
.delete(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOneAndRemove({id:req.params.id})
    .then((response)=>{
        res.json(response);
    })
    .catch((err)=>{console.error(err)});
})
//Get a certain faculty
.get(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOne({id:req.params.id})
    .then((fac)=>{
        res.json(fac);
    })
    .catch((err)=>{console.error(err)});
});


//Chaneg Faculty Name
hrRouter.route('/faculty/:id/name')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOneAndUpdate({id:req.params.id},
        {name:req.body.name},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change Departments of a Faculty
hrRouter.route('/faculty/:id/departments')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOneAndUpdate({id:req.params.id},
        {departments:req.body.departments},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Add a Department 
hrRouter.route('/department')
.post(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Faculty.findOne({name:req.body.facultyName})
    .then((faculty)=>{
        let department = new Department({name:req.body.name,HOD:req.body.HOD,courses:req.body.courses,staff:req.body.staff,id:req.body.id,facultyName:req.body.facultyName});
        faculty.departments.push(""+department.id);     //Depending on faculty name the department id is added to the array of departments of this faculty
        //Dont't add a faculty with its Departments
        faculty.save()
        .then((doc)=>{res.json(doc);})
        .catch((err)=>{console.error(err);});
        department.save()
        .then((doc)=>{res.json(doc);})
        .catch((err)=>{console.error(err);});
    })
    .catch((err)=>{console.error(err)});
})
//Get the Department
.get(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.find({})
    .then((depart)=>{
        res.json(depart);
    })
    .catch((err)=>{console.error(err)});
});

///////////////////////////

//Change the Department
hrRouter.route('/department/:departmentId/name')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOneAndUpdate({id:req.params.departmentId},
    {name:req.body.name},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change departments Head
hrRouter.route('/department/:departmentId/hod')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOneAndUpdate({id:req.params.departmentId},
    {HOD:req.body.HOD},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change Department's Courses
hrRouter.route('/department/:departmentId/courses')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOneAndUpdate({id:req.params.departmentId},
    {courses:req.body.courses},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change the Departments Staff
hrRouter.route('/department/:departmentId/staff')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOneAndUpdate({id:req.params.departmentId},
    {staff:req.body.staff},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Delete a specific department
hrRouter.route('/department/:departmentId')
.delete(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOneAndRemove({id:req.params.departmentId})
    .then((department)=>{
        Faculty.findOne({name:department.facultyName})
        .then((faculty)=>{
            var index = faculty.departments.indexOf(req.params.departmentId);   //Delete this Department from the Faculty department's array
            console.log(index);    
            if (index>-1){
                faculty.departments.splice(index,1);
            }
            faculty.save()
            .then((doc)=>{res.json(doc);})
            .catch((err)=>{console.error(err);});
        })
        .catch((err)=>{console.error(err)});
    })
    .catch((err)=>{console.error(err)});
});

//Add a course 
hrRouter.route('/course')
.post(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Department.findOne({name:req.body.department})
    .then((department)=>{
        let course = new Course({name:req.body.name,id:req.body.id,staff:req.body.staff,department:req.body.department});
        course.save()   //Save the Course
        .then((doc)=>{res.json(doc);})
        .catch((err)=>{console.error(err);});
        department.courses.push(course.id);     // Add the course to the Department's course array
        department.save()   
        .then((doc)=>{res.json(doc);})
        .catch((err)=>{console.error(err);});
    })
    .catch((err)=>{console.error(err)});
});

//  Change Course name
hrRouter.route('/course/:courseId/name')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Course.findOneAndUpdate({id:req.params.courseId},
    {name:req.body.name},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change Course staff
hrRouter.route('/course/:courseId/staff')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Course.findOneAndUpdate({id:req.params.courseId},
    {staff:req.body.staff},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

// Change the Course Schedule
hrRouter.route('/course/:courseId/schedule')
.put(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Course.findOneAndUpdate({id:req.params.courseId},
    {schedule:req.body.schedule},{new:true})
    .then((doc)=>{
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
});

//Change this Course's department
hrRouter.route('/course/:courseId/department')
.put(Authenticate.auth, Authenticate.authHr,async(req,res)=>{
    await Course.findOne({id:req.params.courseId})
    .then(async (course)=>{
        console.log(course);
        await Department.findOne({name:course.department})
        .then((department)=>{
            var index = department.courses.indexOf(course.id);
            if (index>-1){
                department.courses.splice(index,1);
            }
            console.log(department);
            department.save()           //Remove this course from the array of courses of the old department
            .then((doc)=>{res.json(doc);})
            .catch((err)=>{console.error(err);});
        })
        .catch((err)=>{console.error(err)});
    })
    .catch((err)=>{console.error(err)});
   
    await Course.findOneAndUpdate({id:req.params.courseId},
    {deparment:req.body.department},{new:true})
    .then(async(doc)=>{
        await Department.findOne({id:req.body.department})
        .then((department)=>{
            department.courses.push(doc.id);    //Add this course to the array of courses of the new department
            department.save()
            .then((doc)=>{res.json(doc);})
            .catch((err)=>{console.error(err);});
        })
        .catch((err)=>{console.error(err)});
        res.json(doc);
    })
    .catch((err)=>{console.error(err)});
    
});



// Delete this Course
hrRouter.route('/course/:courseId')
.delete(Authenticate.auth, Authenticate.authHr,(req,res)=>{
    Course.findOneAndRemove({id:req.params.courseId})
    .then((course)=>{
        Department.findOne({name:course.department})
        .then((department)=>{
            var index = department.courses.indexOf(course.id);
            if (index>-1){
                department.courses.splice(index,1);     //Remove the course from the array of departments
            }
            res.json(department);
            department.save()
            .then((doc)=>{res.json(doc);})
            .catch((err)=>{console.error(err);});

        })
        .catch((err)=>{console.error(err)});
    })
    .catch((err)=>{console.error(err)});
});

// Add User specifying their type, email, password (gets hashed automatically), office Location,  
hrRouter.route('/user')
.post(Authenticate.auth, Authenticate.authHr, async (req,res)=>{
    if (!req.body.email) {
        return res.status(401).send('Email Required');
    }
    User.findOne({ email: req.body.email })
    .then(async (userOld) => {
        if (userOld != null)
            return res.send('Existing Already');
        Location.findOne({roomId:req.body.officeLocation})
        .then(async(location)=>{
            if (location.maxCapacity>0){
                location.maxCapacity = location.maxCapacity-1;  //Decreases max Capacity of the office by 
                const salt = await bcrypt.genSalt(10)
                const pass= await bcrypt.hash("123456", salt);
                ID.findOne({id:1})      //ID Schema stores last number of id and uses it to automate the enterance of the id
                .then((id)=>{
                    if (req.body.type=="HR"){
                        id.hrId=id.hrId +1;     // Add the last stored id by 1
                        let user = new User({ id:"hr-"+id.hrId,email: req.body.email,type:req.body.type,password:pass,
                        username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
                        user.save()     
                        .then((doc) => { console.log(doc); })
                        .catch((err) => { console.error(err) });
                        let sign =  new Sign({staffId:user.id});
                        console.log(sign);
                        sign.save()
                        .then((doc) => {console.log(doc);})
                        .catch((err) => {console.error(err)}); 
                    }
                    else{
                        id.staffId=id.staffId +1;
                        if (req.body.type!=null){
                            let user = new User({ id:"ac-"+id.staffId,email: req.body.email,type:req.body.type,password:pass,
                            username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
                            user.save()
                            .then((doc) => { console.log(doc); })
                            .catch((err) => { console.error(err) });
                            let sign =  new Sign({staffId:user.id});
                            console.log(sign);
                            sign.save()
                            .then((doc) => {console.log(doc);})
                            .catch((err) => {console.error(err)}); 
                        }
                        else{
                            let user = new User({ id:"ac-"+id.staffId,email: req.body.email,password:pass,
                            username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
                            user.save()
                            .then((doc) => { console.log(doc); })
                            .catch((err) => { console.error(err) });
                            let sign =  new Sign({staffId:user.id});
                            console.log(sign);
                            sign.save()
                            .then((doc) => {console.log(doc);})
                            .catch((err) => {console.error(err)}); 
                        }
                    }
                    id.save()
                    .then((doc) => { console.log(doc); })
                    .catch((err) => { console.error(err) });
                })
                location.save()
                .then((doc) => { console.log(doc); })
                .catch((err) => { console.error(err) });    
            }
        })
        
    })
    .catch((err) => res.send(err));
});


// Delete a specific user
hrRouter.route('/user/:id')
.delete(Authenticate.auth, Authenticate.authHr, async (req,res)=>{
    User.findOneAndRemove({id:req.params.id})
    .then((response)=>{
        res.json(response);
        Location.findOne({roomId:response.officeLocation})
        .then((location)=>{
            location.maxCapacity=location.maxCapacity+1;    //Add Location max Capacity by one for the office
            location.save()
            .then((doc) => { console.log(doc); })
            .catch((err) => { console.error(err) });
        })
    })
    .catch((err)=>{console.error(err)});
})

//Update an already existing staffMember

//Update salary
hrRouter.route('/user/:userId/salary')
.put(Authenticate.auth,(req,res)=>{
    User.findOneAndUpdate({id:req.params.userId},
        {salary:req.body.salary},{new:true})
    .then((user)=>{
        res.send("User Updated Successfully");
        console.log(user);
    })
    .catch((err) => {console.error(err); });
});

//Update department
hrRouter.route('/user/:userId/department')
.put(Authenticate.auth,(req,res)=>{
    User.findOneAndUpdate({id:req.params.userId},
        {department:req.body.department},{new:true})
    .then((user)=>{
        res.send("User Updated Successfully");
        console.log(user);
    })
    .catch((err) => {console.error(err); });
});

//Update users Faculty
hrRouter.route('/user/:userId/faculty')
.put(Authenticate.auth,(req,res)=>{
    User.findOneAndUpdate({id:req.params.userId},
        {faculty:req.body.faculty},{new:true})
    .then((user)=>{
        res.send("User Updated Successfully");
        console.log(user);
    })
    .catch((err) => {console.error(err); });
});


//Update Users Type (HR,HOD,Course Coordinator, Course Instructor) or none of the above which is a regular staff 
hrRouter.route('/user/:userId/type')
.put(Authenticate.auth,(req,res)=>{
    User.findOneAndUpdate({id:req.params.userId},
        {type:req.body.type},{new:true})
    .then((user)=>{
        res.send("User Updated Successfully");
        console.log(user);
    })
    .catch((err) => {console.error(err); });
});

//Get this Users Attendance
hrRouter.route('/user/:userId/attendance')
.get(Authenticate.auth,(req,res)=>{
    Sign.findOne({staffId:req.params.userId})
    .then((sign)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json"); 
        res.json(sign.days);
    })
    .catch((err) => {console.error(err); });
});

//Get this users missing attendance
hrRouter.route('/user/missingAttendance')
.get(Authenticate.auth,(req,res)=>{
    User.find({})
    .then((user)=>{
        var arrSolution=[]
        for(var i=0;i<user.length;i++){
            if (user[i].missingHours>0 || user[i].missingDays.length!=0){
                arrSolution.push(user[i].username);
            }
        }
        res.send(arrSolution);
    })
    .catch((err) => {console.error(err); });
});









module.exports = hrRouter;