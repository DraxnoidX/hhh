const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cron = require('node-cron');
const cors = require('cors');

const Scheduled = require('./models/scheduledEventsSchema');
const User = require('./models/userSchema');
const Room = require('./models/classRoomSchema');
const Course = require('./models/courseSchema');
const Faculty = require('./models/facultySchema');
const Department = require('./models/departmentSchema');
const Request = require('./models/requestSchema');
const Location = require('./models/classRoomSchema');
const Sign = require('./models/signInSchema');
const tokenSecret = "top secret";

const Authenticate = require('./authenticate');

const userRouter = require('./routes/userRouter');
const hrRouter = require('./routes/hrRouter');
const courseCoourdinatorRouter = require('./routes/courseCoordinatorRoutes');
const courseInstructorRouter = require('./routes/courseInstructorRoutes');
const hodRouter = require('./routes/hodRoutes');
const academicMemberRoutes = require('./routes/academicMemberRoutes');
// const ID = require('./models/idSchema');
// let id = new ID({});
// id.save()
// .then()
// .then((doc) => { console.log(doc); })
// .catch((err) => { console.error(err) });


const app = express();
app.use(express.json());
app.use(cors());

app.use('/staff',userRouter);
app.use('/hr',hrRouter);
app.use('/instructor',courseInstructorRouter);
app.use('/coordinator',courseCoourdinatorRouter);
app.use('/hod',hodRouter);
app.use('/acmem',academicMemberRoutes);

// let start = async function(){
//     const salt =   await bcrypt.genSalt(10)
//     password =   await bcrypt.hash("1234", salt);
//     let user = new User({id:"02",email:"hr@gmail.com",
//     password:password,username:"Mohammed Hr",type:"HR",gender:"Male",notifications:["You have 5 requests"],
//     faculty:"",department:"",salary:10000,daysOff:["Friday","Sunday"],
//     missingDays:[],missingHours:0,extraHours:10});
//     user.save()
//     .then((doc) => {console.log(doc);})
//     .catch((err) => {console.error(err)});
// }
//start();



app.post('/signup', (req, res) => {
    if (!req.body.email) {
        return res.status(401).send('Email Required');
    }
    User.findOne({ email: req.body.email })
        .then(async (userOld) => {
            if (userOld != null)
                return res.send('Existing Already');

            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt);
            let user = new User({ email: req.body.email, password: req.body.password,type:req.body.type
            ,id:req.body.id,username:req.body.username , officeLocation : req.body.officeLocation });
            user.save()
                .then((doc) => { console.log(doc); })
                .catch((err) => { console.error(err) });
        })
        .catch((err) => res.send(err));
});
 
//login front end test
// app.use('/loginTest', (req, res) => {
//     res.send({
//       token: 'test123'
//     });  
// });
// //
//get user info 
app.get('/usersList/:id', async function(req, res) {
    const user =await User.findOne({ id: req.params.id});
    if(user!=null){
        res.send(user);
    }else{
        res.status(404).send("No user with this id");
    }
    
});
//get all signin
app.get('/AllSignIns', function(req, res) {
    Sign.find({}, function(err, signins) {
      var signinMap = [];
  
        signins.forEach(function(signin) {
        signinMap.push(signin);
      });
  
      res.send(signinMap);  
  });
});
//get all users
app.get('/usersList', function(req, res) {
    User.find({}, function(err, users) {
      var userMap = [];
  
      users.forEach(function(user) {
        userMap.push(user);
      });
  
      res.send(userMap);  
  });
});
//get all rooms 
app.get('/roomsList', function(req, res) {
    Room.find({}, function(err, rooms) {
      var roomMap = [];
  
      rooms.forEach(function(room) {
        roomMap.push(room) ;
      });
  
      res.send(roomMap);  
  });
});
//get all courses 
app.get('/coursesList', function(req, res) {
    Course.find({}, function(err, courses) {
      var courseMap = [];
  
      courses.forEach(function(course) {
        courseMap.push(course);
      });
  
      res.send(courseMap);  
  });
});
//get all faculties 
app.get('/facultiesList', function(req, res) {
    Faculty.find({}, function(err, faculties) {
      var facultyMap = [];
  
      faculties.forEach(function(faculty) {
        facultyMap.push(faculty);
      });
  
      res.send(facultyMap);  
  });
});

//get all departments 
app.get('/departmentsList', function(req, res) {
    Department.find({}, function(err, departments) {
      var departmentMap = [];
  
      departments.forEach(function(department) {
        departmentMap.push(department);
      });
  
      res.send(departmentMap);  
  });
});
//get all requests 
app.get('/requestsList', function(req, res) {
    Request.find({}, function(err, requests) {
      var requestMap = [];
  
      requests.forEach(function(request) {
        requestMap.push(request);
      });
  
      res.send(requestMap);  
  });
});


app.use('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(async (user) => {
            if (user != null) {
                const correctPassword = await bcrypt.compare(req.body.password, user.password);
                
                
                if (correctPassword) {
                    const token = jwt.sign({ id: user.id, type: user.type }, tokenSecret);
                    // res.setHeader("Content-Type", "application/json");
                    res.header('token', token).json({"token" : token , id :user.id });
                    //res.send();
                    // res.json(token);
                    // res.send({
                    //     token: token.text()
                    // }); 
                    console.log('Logged In');
                }
                else {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.send("Password incorrect");
                }
            }
            else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.send("Email not found");
            }
        })
        .catch((err) => { console.error(err); });
});

app.post('/logout', Authenticate.auth, (req, res) => {
    jwt.destroy(req.user);
    req.user = null;
    res.header('token', null);
    res.send("Logged Out");
    res.render('/');
})

cron.schedule('0 23 * * *',async function () {
    Scheduled.find({}).then(async(docs) => {
        console.log(docs);
        for (let i = 0; i < docs.length; i++) {
            console.log(docs.length);
            var d = new Date();
            docs[i].date.setHours(0, 0, 0, 0);
            d.setHours(0, 0, 0, 0);
            if (d.getDate() == docs[i].date.getDate() && d.getMonth() == docs[i].date.getMonth() && d.getYear() == docs[i].date.getYear()) {
                
                const r = await request.findOne({ requestId: docs[i].requestId });
                if (docs[i].typeOfAction == "compensationLeave") {
                    const u = await User.findOne({ id: r.staffId }).then(async(user) => {
                        var filter = user.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                        //user.missingHours += 8.4;
                        await User.findOneAndUpdate({ id: r.staffId }, { missingDays: filter });
                        await Scheduled.findOneAndDelete({requestId:r.requestId});
                    });
                }
                else{
                    if (docs[i].typeOfAction == "annualLeave") {
                        //console.log(r.staffId);
                        const u = await User.findOne({ id: r.staffId }).then(async(user) => {
                            var filter = user.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                            if(r.replacementStaffId != ""){
                                const u2 = await User.findOne({ id: r.replacementStaffId }).then(async(user2) => {
                                    for(let j = 0 ; j < 6 ; j++){
                                        if(r.weekDay == user.schedule[j][0].substring(0,3)){
                                            for(let k = 1 ; k < 6 ; k++){
                                                if(user2.schedule[j][k] != null && user2.schedule[j][k].temp == true){
                                                    user2.schedule[j][k] = null;
                                                }
                                            }
                                        }
                                    }
                                    await User.findOneAndUpdate({ id: r.replacementStaffId }, { schedule: user2.schedule});
                                    await User.findOneAndUpdate({ id: r.staffId }, { missingDays: filter });
                                    
                                });
                            }await Scheduled.findOneAndDelete({requestId:r.requestId});
                        });
                    }
                    else{
                        if(docs[i].typeOfAction == "maternityLeave"){
                            const u = await User.findOne({ id: r.staffId }).then(async(user) => {
                                if(user.maternityDaysLeft > 0){
                                    user.maternityDaysLeft--;
                                    var filter = user.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                                    await User.findOneAndUpdate({ id: r.staffId }, { missingDays: filter, maternityDaysLeft: user.maternityDaysLeft });
                                }
                                else{
                                    await Scheduled.findOneAndDelete({requestId:r.requestId});
                                }
                            })
                        }
                    }
                }
            }
        }
    })
});

cron.schedule('0 1 * * *',async function () {
    Scheduled.find({}).then(async(docs) => {
        for (let i = 0; i < docs.length; i++) {
            let d = new Date();
            docs[i].date.setHours(0, 0, 0, 0);
            d.setHours(0, 0, 0, 0);
            if (d.getDate() == docs[i].date.getDate() && d.getMonth() == docs[i].date.getMonth() && d.getYear() == docs[i].date.getYear()) {
                const r = await request.findOne({ requestId: docs[i].requestId });
                if (docs[i].typeOfAction == "compensationLeave") {
                    const u = await User.findOne({ id: r.staffId }).then(async(user) => {
                        //var filter = user.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                        user.missingHours += 8.4;
                        await User.findOneAndUpdate({ id: r.staffId }, { missingHours: user.missingHours });
                        //await Scheduled.findOneAndDelete({requestId:r.requestId});
                    });
                }
                else{
                    if (docs[i].typeOfAction == "annualLeave") {
                        const u = await User.findOne({ id: r.staffId }).then(async(user) => {
                            //var filter = user.missingDays.filter(date => date != (r.requestDay.getDay() + "-" + r.requestDay.getMonth() + "-" + r.requestDay.getYear()));
                            if(r.replacementStaffId != ""){
                                const u2 = await User.findOne({ id: r.replacementStaffId }).then(async(user2) => {
                                    for(let j = 0 ; j < 6 ; j++){
                                        if(r.weekDay == user[j][0].substring(0,3)){
                                            for(let k = 1 ; k < 6 ; k++){
                                                user2.schedule[j][k] = user.schedule[j][k];
                                                user2.schedule[j][k].temp = true;
                                            }
                                        }
                                    }
                                    await User.findOneAndUpdate({ id: r.replacementStaffId }, { schedule: user2.schedule});
                                });
                            }
                        });
                    }
                }
            }
        }
    })
});

cron.schedule('0 2 11 * *',async function () {
    const u = await User.find({}).then(async(user) => {
        for(let i = 0 ; i < user.length ; i++){
            let days = user[i].missingDays.length;
            let hours = Math.floor(user[i].missingHours);
            let minutes = user[i].missingHours - hours;
            user[i].monthPayOff = (user[i].salary-(days*(user[i].salary/60))-(hours*(user[i].salary/180))-(minutes*(user[i].salary/(180*60))));
            await User.findOneAndUpdate({ id: user[i].id }, { monthPayOff: user[i].monthPayOff});
        }
    });
});

cron.schedule('0 22 * * *',async function() {
    User.find({})
    .then((users)=>{
        for (var i=0;i<users.length;i++){
            var user = users[i];
            var id = user.id;
            var d = new Date();
            let day = d.getDate();
            let month = d.getMonth()+1;
            let year = d.getFullYear();
            let dateSignIn = ""+day+"-"+month+"-"+year;
            var hours = d.getHours(); 
            var minutes= d.getMinutes();
            var totalHours = 168;
            Sign.findOne({staffId:id})
            .then(async(sign)=>{
                var indexMonth = sign.currentMonth.indexOf(month);
                var index = sign.days[indexMonth].indexOf(dateSignIn);
                if( index == -1 ){
                    User.findOne({id:id}).then((p) => {
                        p.missingDays.push(dateSignIn);
                        User.findOneAndUpdate({id:id},{missingDays:p.missingDays});
                    });
                }
                else{
                    if (totalHours - sign.hours[indexMonth][index]>=0){
                        user.missingHours = totalHours - sign.hours[indexMonth][index];
                    }
                    else{
                        user.missingHours = 0;
                    }
                    if (totalHours - sign.hours[indexMonth][index]<=0){
                        user.extraHours = -totalHours + sign.hours[indexMonth][index];
                    }
                    else{
                        user.extraHours = 0;
                    }
                }
                user.save()
                .then((doc) => { console.log(doc); })
                .catch((err) => { console.error(err) });
            })
            .catch((err) => {console.error(err); });
        }
    })
    .catch((err) => {console.error(err); });
});

// app.route('/location')
// .post(Authenticate.auth, Authenticate.authHr,(req,res)=>{
//     Location.findOne({roomId:req.body.roomId})
//     .then((loc)=>{
//         if (loc==null){
//             let location=new Location({maxCapacity:req.body.maxCapacity,roomId:req.body.roomId,type:req.body.type});
//             location.save()
//             .then((doc) => {res.json(doc);})
//             .catch((err) => {console.error(err)}); 
//         }
//         else{
//             console.log("Location Already Saved");
//         }
//     })
//     .catch((err)=>{console.error(err)});
// })
// .get(Authenticate.auth, Authenticate.authHr,(req,res)=>{
//     Location.find({})
//     .then((loc)=>{
//         res.json(loc);
//     })
//     .catch((err)=>{console.error(err)});
// })

// app.route('/user')
// .post( async (req,res)=>{
//     if (!req.body.email) {
//         return res.status(401).send('Email Required');
//     }
//     User.findOne({ email: req.body.email })
//     .then(async (userOld) => {
//         if (userOld != null)
//             return res.send('Existing Already');
//         Location.findOne({roomId:req.body.officeLocation})
//         .then(async(location)=>{
//             if (location.maxCapacity>0){
//                 location.maxCapacity = location.maxCapacity-1;
//                 const salt = await bcrypt.genSalt(10)
//                 const pass= await bcrypt.hash("123456", salt);
//                 ID.findOne({id:1})
//                 .then((id)=>{
//                     if (req.body.type=="HR"){
//                         id.hrId=id.hrId +1;
//                         let user = new User({ id:"hr-"+id.hrId,email: req.body.email,type:req.body.type,password:pass,
//                         username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
//                         user.save()
//                         .then((doc) => { console.log(doc); })
//                         .catch((err) => { console.error(err) });
//                     }
//                     else{
//                         id.staffId=id.staffId +1;
//                         if (req.body.type!=null){
//                             let user = new User({ id:"ac-"+id.staffId,email: req.body.email,type:req.body.type,password:pass,
//                             username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
//                             user.save()
//                             .then((doc) => { console.log(doc); })
//                             .catch((err) => { console.error(err) });
//                         }
//                         else{
//                             let user = new User({ id:"ac-"+id.staffId,email: req.body.email,password:pass,
//                             username:req.body.username,salary:req.body.salary,officeLocation:req.body.officeLocation});
//                             user.save()
//                             .then((doc) => { console.log(doc); })
//                             .catch((err) => { console.error(err) });
//                         }
//                     }
//                     id.save()
//                     .then((doc) => { console.log(doc); })
//                     .catch((err) => { console.error(err) });
//                 })
//                 location.save()
//                 .then((doc) => { console.log(doc); })
//                 .catch((err) => { console.error(err) });
               
                
//             }
//         })
        
//     })
//     .catch((err) => res.send(err));
// });

module.exports = app;

