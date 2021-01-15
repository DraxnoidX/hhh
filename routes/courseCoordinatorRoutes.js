const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const request = require('../models/requestSchema');
const Course = require('../models/courseSchema');
const ClassRoom = require('../models/classRoomSchema');
const User = require('../models/userSchema');
const coordRouter = express.Router();
const Authenticate = require('../authenticate');
const userRouter = require('./userRouter');


coordRouter.route('/viewSlotLinkingRequests/:courseID').get(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => { //working
    await Course.findOne({ id: req.params.courseID }).then(async (result) => {
        if (result.courseCoordinatorID == req.user.id) {
            await request.find({ courseID: req.params.courseID, requestType: 'slotLink' }).then((results) => res.json({ "Requests": results }));
        }
        else {
            res.status(401).json({ msg: 'authorization failed' });
        }
    });

});

coordRouter.route('/viewSlotLinkingRequests/accept/:requestId').put(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => {
    try {
        var t = -1;
        var userFlag = false;
        let id = req.params.requestId;
        const r = await request.findOne({ requestId: req.params.requestId });
        //console.log(r);
        if (r != null) {
            await Course.findOne({ id: r.courseID }).then(async (result) => {
                if (result.courseCoordinatorID == req.user.id) {
                    const u = await User.findOne({ id: r.staffId }).then(async (user) => {
                        //console.log(user);
                        for (i = 0; i < 6; i++) {
                            if (user.schedule[i][0] == r.day) {
                                if (user.schedule[i][r.slot] == null) {
                                    user.schedule[i][r.slot] = { courseID: r.courseID, tutorial: r.tutorialNumber, roomNumber: r.roomNumber, temp: false };
                                    userFlag = true;
                                    await User.findOneAndUpdate({ id: r.staffId }, { schedule: user.schedule });
                                    t = i;
                                }
                                else {
                                    res.send("Academic member already has a slot. Conflict appeared.")
                                }
                            }
                        }
                    });
                    if (userFlag) {
                        //console.log("i am here");
                        const c = await Course.findOne({ id: r.courseID }).then(async (result) => {
                            //console.log(t);
                            for (let j = 0; j < result.schedule[t][r.slot].length; j++) {
                                if (result.schedule[t][r.slot][j].tutorial == r.tutorialNumber) {
                                    result.schedule[t][r.slot][j].academic = r.staffId;
                                    //console.log(result.schedule[t][r.slot][j]);
                                    await Course.findOneAndUpdate({ id: r.courseID }, { schedule: result.schedule, totalSlotsTaken: (result.totalSlotsTaken + 1) });
                                }
                            }
                        });
                        const y = await request.findOne({ requestId: req.params.requestId }).then(async (R) => {
                            R.acceptanceStatus = "accepted";
                            await request.findOneAndUpdate({ requestId: req.params.requestId }, { acceptanceStatus: R.acceptanceStatus });
                            let t = await User.findOne({ id: R.staffId });
                            await t.notifications.push("Your request of ID: " + R.requestId + " has been " + R.acceptanceStatus);
                            await t.save();
                            res.send("Schedule Updated and Request accepted");
                        })
                    }
                }
                else {
                    res.status(401).json({ msg: 'authorization failed' });
                }
            });

        }


    }
    catch (error) { res.status(500).json({ error: error.message }); }
});




// await request.findOneAndUpdate({ requestId: req.params.requestId, request: 'slotLink' }, { acceptance: "accepted" })
//     .then((request) => await User.findOne({ id: request.staffId }))
//     .then((user) => {
//         for (let i = 0; i < 6; i++) {
//             if (user.schedule[i][0] == results.day) {
//                 if(user.schedule[i][results.slot] == null){
//                     user.schedule[i][results.slot] = [{ courseId: results.courseId, tutorial: results.tutorialNumber, roomNumber: results.roomNumber }];
//                     await userRouter.findOneAndUpdate({ id: request.staffId },{schedule:user.schedule});
//                     res.json({ "acceptance": results.acceptance });
//                     res.json({ "Schedule": user.schedule });
//                 }
//                 else{
//                     res.send("Academic member already has a slot. Conflict appeared.")
//                 }
//             }
//         }
//     });


// app.get('/viewSlotLinkingRequests/reject/:requestId',async(req,res)=>{
//     await request.find({requestId:req.params.requestId})
//     .then((request) => res.json({"acceptance":request.requestId}));
// });

coordRouter.route('/viewSlotLinkingRequests/reject/:requestId').put(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => {
    try {
        let id = req.params.requestId;
        const r = await request.findOne({ requestId: req.params.requestId });
        await Course.findOne({ id: r.courseID }).then(async (result) => {
            if (result.courseCoordinatorID == req.user.id) {
                r.acceptanceStatus = "rejected";
                res.send("Request rejected");
                await request.findOneAndUpdate({ requestId: req.params.requestId }, { acceptanceStatus: R.acceptanceStatus });

                console.log(r.staffId);
                let t = await User.findOne({ id: r.staffId });
                await t.notifications.push("Your request of ID: " + r.requestId + " has been " + r.acceptanceStatus);
                await t.save();

            }
            else {
                res.status(401).json({ msg: 'authorization failed' });
            }
        });

    }
    catch (error) { res.status(500).json({ error: error.message }); }
});

// app.put('/courseSchedule/addSlot/:courseId&:slot&:tutorial&:day&:room',(req,res)=>{
//     Course.findOne({id:req.params.courseId}).then((results) => {
//         for(let i = 0 ; i < 6 ;i++){
//             if(results.schedule[i][0] == req.params.day){
//                 var tutFound = false;
//                 for(let j = 0 ; j < results.schedule[i][slot].lenght() && !tutFound ; j++){
//                     if(results.schedule[i][slot][j].tutorial == req.params.tutorial){
//                         tutFound = true;
//                         res.json({"Error":"Tutorial already has a slot in this timing"});
//                     }
//                 }
//                 if(!tutFound){
//                     results.schedule[i][req.params.slot].push({room:req.params.room,tutorial:req.params.tutorial});
//                     Course.findOneAndUpdate({id:req.params.courseId},{schedule:results.schedule}).then((updatedValue) => res.json({"Course Updated":updatedValue}));
//                 }
//             }
//         }//res.send("7amada");
//     }
//     );
// });
coordRouter.route('/courseSchedule/addSlot/:courseID&:slot&:tutorial&:day&:room').put(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => {
    try {
        await Course.findOne({ id: req.params.courseID }).then(async (result) => {
            if (result.courseCoordinatorID == req.user.id) {
                let cid = req.params.courseID;
                const r = await Course.findOne({ id: cid }).then(async (result) => {
                    for (let i = 0; i < 6; i++) {
                        if (result.schedule[i][0] == req.params.day) {
                            var tutFound = false;
                            console.log(result.schedule);
                            console.log(result.schedule[i][req.params.slot].length);
                            for (let j = 0; j < result.schedule[i][req.params.slot].length && !tutFound; j++) {
                                if (result.schedule[i][req.params.slot][j].tutorial == req.params.tutorial) {
                                    tutFound = true;
                                    res.json({ "Error": "Tutorial already has a slot in this timing" });
                                }
                            }
                            if (!tutFound) {
                                await ClassRoom.findOne({ roomId: req.params.room }).then(async (room) => {
                                    if (room.schedule[i][req.params.slot] == null) {
                                        result.schedule[i][req.params.slot].push({ room: req.params.room, tutorial: req.params.tutorial, academic: "" });
                                        room.schedule[i][req.params.slot] = { courseID: req.params.courseID, tutorial: req.params.tutorial };
                                        console.log(result.schedule);
                                        await Course.findOneAndUpdate({ id: cid }, { schedule: result.schedule, totalSlots: result.totalSlots + 1 });
                                        await ClassRoom.findOneAndUpdate({ roomId: req.params.room }, { schedule: room.schedule });
                                        res.send("Schedule Updated");
                                    }
                                    else {
                                        res.send("Room busy at this slot and day");
                                    }
                                })

                            }
                        }
                    }
                });
                if (r != null) {
                    console.log(r.schedule);
                }
                else {
                    res.send("Course not found");
                }
            }
            else {
                res.status(401).json({ msg: 'authorization failed' });
            }
        });

    }
    catch (error) { res.status(500).json({ error: error.message }); }
});

coordRouter.route('/courseSchedule/deleteSlot/:courseID&:slot&:tutorial&:day&:room').delete(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => {
    try {
        await Course.findOne({ id: req.params.courseID }).then(async (result) => {
            if (result.courseCoordinatorID == req.user.id) {
                let cid = req.params.courseID;
                const r = await Course.findOne({ id: cid }).then(async (result) => {
                    for (let i = 0; i < 6; i++) {
                        if (result.schedule[i][0] == req.params.day) {
                            var tutFound = false;
                            for (let j = 0; j < result.schedule[i][req.params.slot].length && !tutFound; j++) {
                                if (result.schedule[i][req.params.slot][j].tutorial == req.params.tutorial
                                    && result.schedule[i][req.params.slot][j].room == req.params.room) {
                                    tutFound = true;

                                    await ClassRoom.findOne({ roomId: req.params.room }).then(async (room) => {
                                        if (result.schedule[i][req.params.slot][j].academic == "") {
                                            result.schedule[i][req.params.slot].splice(j, 1);
                                            room.schedule[i][req.params.slot] = null;
                                            console.log(result.schedule);
                                            await Course.findOneAndUpdate({ id: cid }, { schedule: result.schedule, totalSlots: result.totalSlots + 1 });
                                            await ClassRoom.findOneAndUpdate({ roomId: req.params.room }, { schedule: room.schedule });
                                            res.send("Schedule Updated");
                                        }
                                        else {
                                            res.send("Cannot update because already assigned to an academic");
                                        }
                                    })
                                }
                            }
                            if (!tutFound) {
                                res.json({ "Error": "Tutorial not found" });
                            }
                        }
                    }
                });
                if (r != null) {
                    console.log(r.schedule);
                }
                else {
                    res.send("Course not found");
                }
            }
            else {
                res.status(401).json({ msg: 'authorization failed' });
            }
        });

    }
    catch (error) { res.status(500).json({ error: error.message }); }
});

coordRouter.route('/courseSchedule/updateSlot/:courseID&:slot&:tutorial&:day&:room&:slotNew&:tutorialNew&:dayNew&:roomNew').put(Authenticate.auth, Authenticate.authCoordinator, async (req, res) => {
    try {
        await Course.findOne({ id: req.params.courseID }).then(async (result) => {
            if (result.courseCoordinatorID == req.user.id) {
                let cid = req.params.courseID;
                const r = await Course.findOne({ id: cid }).then(async (result) => {
                    for (let i = 0; i < 6; i++) {
                        if (result.schedule[i][0] == req.params.day) {
                            var tutFound = false;
                            for (let j = 0; j < result.schedule[i][req.params.slot].length && !tutFound; j++) {
                                if (result.schedule[i][req.params.slot][j].tutorial == req.params.tutorial
                                    && result.schedule[i][req.params.slot][j].room == req.params.room) {
                                    tutFound = true;

                                    await ClassRoom.findOne({ roomId: req.params.room }).then(async (room) => {
                                        if (result.schedule[i][req.params.slot][j].academic == "") {
                                            result.schedule[i][req.params.slot].splice(j, 1);
                                            room.schedule[i][req.params.slot] = null;
                                            //
                                            for (let i = 0; i < 6; i++) {
                                                if (result.schedule[i][0] == req.params.dayNew) {
                                                    var tutFound1 = false;
                                                    console.log(result.schedule);
                                                    console.log(result.schedule[i][req.params.slotNew].length);
                                                    for (let j = 0; j < result.schedule[i][req.params.slotNew].length && !tutFound1; j++) {
                                                        if (result.schedule[i][req.params.slot][j].tutorial == req.params.tutorialNew) {
                                                            tutFound1 = true;
                                                            res.json({ "Error": "Tutorial already has a slot in this timing" });
                                                        }
                                                    }
                                                    if (!tutFound1) {
                                                        if (req.params.room != req.params.roomNew) {
                                                            await ClassRoom.findOne({ roomId: req.params.roomNew }).then(async (room1) => {
                                                                if (room1.schedule[i][req.params.slotNew] == null) {
                                                                    result.schedule[i][req.params.slotNew].push({ room: req.params.roomNew, tutorial: req.params.tutorialNew, academic: "" });
                                                                    room1.schedule[i][req.params.slotNew] = { courseID: req.params.courseID, tutorial: req.params.tutorialNew };
                                                                    console.log(result.schedule);
                                                                    await Course.findOneAndUpdate({ id: cid }, { schedule: result.schedule });
                                                                    await ClassRoom.findOneAndUpdate({ roomId: req.params.room }, { schedule: room.schedule });
                                                                    await ClassRoom.findOneAndUpdate({ roomId: req.params.roomNew }, { schedule: room1.schedule });
                                                                    res.send("Schedule Updated");
                                                                }
                                                                else {
                                                                    res.send("New Room busy at this slot and day");
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            if (room.schedule[i][req.params.slotNew] == null) {
                                                                result.schedule[i][req.params.slotNew].push({ room: req.params.roomNew, tutorial: req.params.tutorialNew, academic: "" });
                                                                room.schedule[i][req.params.slotNew] = { courseID: req.params.courseID, tutorial: req.params.tutorialNew };
                                                                console.log(result.schedule);
                                                                await Course.findOneAndUpdate({ id: cid }, { schedule: result.schedule });
                                                                await ClassRoom.findOneAndUpdate({ roomId: req.params.room }, { schedule: room.schedule });
                                                                res.send("Schedule Updated");
                                                            }
                                                            else {
                                                                res.send("New Room busy at this slot and day");
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                            if (r != null) {
                                                console.log(r.schedule);
                                            }
                                            else {
                                                res.send("Course not found");
                                            }
                                            //

                                        }
                                        else {
                                            res.send("Cannot update because already assigned to an academic");
                                        }
                                    })
                                }
                            }
                            if (!tutFound) {
                                res.json({ "Error": "Tutorial not found" });
                                console.log(tutFound);
                            }
                        }
                    }
                });
                if (r != null) {
                    console.log(r.schedule);
                }
                else {
                    res.send("Course not found");
                }
            }
            else {
                res.status(401).json({ msg: 'authorization failed' });
            }
        });

    }
    catch (error) { res.status(500).json({ error: error.message }); }
});
module.exports = coordRouter;
