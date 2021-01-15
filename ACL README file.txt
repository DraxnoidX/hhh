**********************************************************
		Academic Members
**********************************************************
Functionality: View a user's schedule
Route: /acmem/viewSchedule/:userID
Route example: /acmem/viewSchedule/123
Request type: GET
Parameters: userID: the ID of the user
Response: the schedule of the user
Response example: [["Saturday",null,null,null,null,null],["Sunday",null,null,null,null,null],["Monday",null,null,null,null,null],["Tuesday",null,null,null,null,null],["Wednesday",null,null,null,null,null],["Thursday",null,null,null,null,null]]
=======================================================================================================================
Functionality: Send a replacement request to another Academic member.
Route: /acmem/sendReplacementRequestToAcademicMember/:staffId&:day&:month&:year
Route example: /acmem/sendReplacementRequestToAcademicMember/123&25&12&2020
Request type: POST
Body: {"reason":"bleez switch man","replacementStaffId":"237"}
Parameters: staffId: the id of the academic member sending the request, day: the day of the replacement, month: the month of the replacement, year: the year of the replacement
Response: "Request sent"
=======================================================================================================================
Functionality: View replacement requests sent to you by other academic members
Route: /acmem/viewReplacementRequest/:staffId
Route example: /acmem/viewReplacementRequest/237
Request type: GET
Parameters: staffId: the id of the academic member viewing the requests
Response: Array of requests
Response example: One request: [
    {
        "reason": "bleez switch man",
        "acceptanceStatus": "pending",
        "repAcceptanceStatus": "pending",
        "documentLink": "",
        "_id": "5fe499797d266e3f64b717f4",
        "requestId": 1608817017102,
        "staffId": "123",
        "requestType": "replacement",
        "departmentId": "CSEN",
        "replacementStaffId": "237",
        "timestamp": "2020-12-24T13:36:57.102Z",
        "requestDay": "2020-12-27T00:00:00.000Z",
        "weekDay": "Thu",
        "__v": 0
    }
]
=======================================================================================================================
Functionality: (Academic member) Respond to a replacement request sent by another academic member
Route: /acmem/respondToReplacementRequestByAM/:requestId
Route example: /acmem/respondToReplacementRequestByAM/:1608817017102
Request type: PUT
Parameters: requestId: ID of the request being edited / replied to
Response: "Response recorded"
=======================================================================================================================
Functionality: Send a replacement request to HOD after a staff member replied to my replacement request
Route: /acmem/sendReplacementRequestToHodAfterStaffReply/:staffId&:requestId&:day&:month&:year
Route example: /acmem/sendReplacementRequestToHodAfterStaffReply/123&1608817017102&25&12&2020
Request type: POST
Body: {"reason":"man bleez let me go home!","departmentId":"CSEN"}
Parameters: staffId: the id of the academic member sending the request, requestId: ID of the request accepted by the replacement staff member, day: the day of the replacement, month: the month of the replacement, year: the year of the replacement
Response: "Request sent"
=======================================================================================================================
Functionality: Send a replacement request to HOD after not finding anyone to switch with
Route: /acmem/sendReplacementRequestToHodWithoutStaffReply/:staffId&:day&:month&:year
Route example: /acmem/sendReplacementRequestToHodWithoutStaffReply/123&25&12&2020
Request type: POST
Body:{
	"reason":"i'm very very bezzzyyyyy",
	"departmentId":"7amada"
}
Parameters: staffId: the id of the academic member sending the request, day: the day of the replacement, month: the month of the replacement, year: the year of the replacement
Response: "Request sent"
=======================================================================================================================
Functionality: Send a slot linking request to the course co-ordinator
Route: /acmem/sendSlotLinkingRequest/:staffId
Route example: /acmem/sendSlotLinkingRequest/123
Request type: POST
Body: {
	"courseID":"CSEN703",
	"roomNumber":"2",
	"tutorialNumber":"22",
	"day":"Tuesday",
	"slot":"1"
}
Parameters: staffId: the id of the academic member sending the request
Response: Slot linking request sent
=======================================================================================================================
Functionality: Send a change-day-off request to the HOD
Route: /acmem/sendChangeDayOffRequest/:staffId
Route example: /acmem/sendChangeDayOffRequest/123
Request type: POST
Body:{
	"courseId":"CSEN703",
	"reason":"3andy 7agz kora el yom da fa eslak ba2a",
	"newDayOff":"Monday"
}
Parameters: staffId: the id of the academic member sending the request
Response: Change-day-off request sent
=======================================================================================================================
Functionality: Send an accidental leave request to HOD
Route: /acmem/sendAccidentalLeaveRequest/:staffId&:day&:month&:year
Route example: /acmem/sendAccidentalLeaveRequest/123&24&12&2020
Request type: POST
Body:{
	"courseId":"CSEN703",
	"reason":"malish nefs yasta 3ayez anam",
	"departmentId":"7amada"
}
Parameters: staffId: the id of the academic member sending the request, day: the day of the accidental leave, month: the month of the accidental leave, year: the year of the accidental leave
Response: Accidental leave request sent
=======================================================================================================================
Functionality: Send a maternity leave request
Route: /acmem/sendMaternityLeaveRequest/:staffId
Route example: /acmem/sendMaternityLeaveRequest/:123
Request type: POST
Body:{
	"courseId":"CSEN703",
	"documentLink":"iamsopregnant.com",
	"departmentId":"7amada"
}
Parameters: staffId: the id of the academic member sending the request
Response: Maternity leave request sent
=======================================================================================================================
Functionality: Send a sick leave request
Route: /acmem/sendSickLeaveRequest/:staffId&:day&:month&:year
Route example: /acmem/sendSickLeaveRequest/123&24&12&2020
Request type: POST
Body:{
	"courseId":"CSEN703",
	"reason":"I am so sick",
	"documentLink":"iamsosick.com"
}
Parameters: staffId: the id of the academic member sending the request, day: the day of the sick leave, month: the month of the sick leave, year: the year of the sick leave
Response: Sick leave request sent
=======================================================================================================================
Functionality: Send a compensation leave request
Route: /acmem/sendCompensationLeaveRequest/:staffId&:day&:month&:year
Route example: /acmem/sendCompensationLeaveRequest/:staffId&:day&:month&:year
Request type: POST
Body:{
	"courseId":"CSEN703",
	"departmentId":"7amada",
	"reason":"am so sick man"
}
Parameters: staffId: the id of the academic member sending the request, day: the day of the compensation leave, month: the month of the compensation leave, year: the year of the compensation leave
Response: Compensation leave request sent
=======================================================================================================================
Functionality: View all requests submitted by this staff member
Route: /acmem/viewAllRequests/:staffId
Route example: /acmem/viewAllRequests/123
Request type: GET
Parameters: staffId: the id of the academic member viewing the requests
Response: Array of requests
Response example: One request:{
        "reason": "",
        "acceptanceStatus": "pending",
        "repAcceptanceStatus": "pending",
        "documentLink": "",
        "_id": "5fe5f1eb96c3f43e146c964c",
        "requestId": 1608905195052,
        "staffId": "123",
        "requestType": "slotLink",
        "courseID": "CSEN703",
        "roomNumber": "2",
        "tutorialNumber": 22,
        "day": "Tuesday",
        "slot": 1,
        "timestamp": "2020-12-25T14:06:35.052Z",
        "__v": 0
    }
=======================================================================================================================
Functionality: View pending requests submitted by this staff member
Route: /acmem/viewPendingRequests/:staffId
Route example: /acmem/viewPendingRequests/123
Request type: GET
Parameters: staffId: the id of the academic member viewing the requests
Response: Array of requests
Response example: One request{
        "reason": "malish nefs yasta 3ayez anam",
        "acceptanceStatus": "pending",
        "repAcceptanceStatus": "pending",
        "documentLink": "",
        "_id": "5fe5f28c96c3f43e146c964f",
        "requestId": 1608905356349,
        "staffId": "123",
        "requestType": "accidentalLeave",
        "departmentId": "7amada",
        "timestamp": "2020-12-25T14:09:16.349Z",
        "requestDay": "2020-12-24T00:00:00.000Z",
        "__v": 0
    }
=======================================================================================================================
Functionality: View accepted requests submitted by this staff member
Route: /acmem/viewAcceptedRequests/:staffId
Route example: /acmem/viewAcceptedRequests/123
Request type: GET
Parameters: staffId: the id of the academic member viewing the requests
Response: Array of requests
Response example: One request: {
        "reason": "man bleez let me go home!",
        "acceptanceStatus": "pending",
        "repAcceptanceStatus": "accepted",
        "documentLink": "",
        "_id": "5fe5f13e7303ff33202b4982",
        "requestId": 1608905022661,
        "staffId": "123",
        "requestType": "replacement",
        "departmentId": "CSEN",
        "replacementStaffId": "237",
        "timestamp": "2020-12-25T14:03:42.661Z",
        "requestDay": "2020-12-27T00:00:00.000Z",
        "weekDay": "Fri",
        "__v": 0
    }
=======================================================================================================================
Functionality: View rejected requests submitted by this staff member
Route: /acmem/viewRejectedRequests/:staffId
Route example: /acmem/viewRejectedRequests/123
Request type: GET
Parameters: staffId: the id of the academic member viewing the requests
Response: Array of requests
Response example: One request: {
        "reason": "malish nefs yasta 3ayez anam",
        "acceptanceStatus": "rejected",
        "repAcceptanceStatus": "pending",
        "documentLink": "",
        "_id": "5fe5f28c96c3f43e146c964f",
        "requestId": 1608905356349,
        "staffId": "123",
        "requestType": "accidentalLeave",
        "departmentId": "7amada",
        "timestamp": "2020-12-25T14:09:16.349Z",
        "requestDay": "2020-12-24T00:00:00.000Z",
        "__v": 0
    }
=======================================================================================================================
Functionality: Delete a request that is still pending
Route: /acmem/cancelRequest/:staffId/:requestId
Route example: /acmem/cancelRequest/123/1608905195052
Request type: DELETE
Body:{}
Parameters: staffId: the id of the academic member cacnelling the requests, requestId:
Response: Request cancelled
=======================================================================================================================
**********************************************************
		Coordinator & H.O.D Part 1
**********************************************************
Functionality: View “slot linking” request(s) from academic members linked to his/her course.
Route:/coordinator/viewSlotLinkingRequests/:courseID
Route example: /coordinator/viewSlotLinkingRequests/CSEN703
Request type: GET
Parameters: courseID = CSEN703
Response: [requests]
Response example: [{
        "reason": "",
        "acceptanceStatus": "pending",
        "repAcceptanceStatus": "pending",
        "documentLink": "",
        "_id": "5fe5f1eb96c3f43e146c964c",
        "requestId": 1608905195052,
        "staffId": "123",
        "requestType": "slotLink",
        "courseID": "CSEN703",
        "roomNumber": "2",
        "tutorialNumber": 22,
        "day": "Tuesday",
        "slot": 1,
        "timestamp": "2020-12-25T14:06:35.052Z",
        "__v": 0
    }]
=======================================================================================================================
Functionality: Accept “slot linking” requests from academic members linked to his/her course.
Note that once a “slot linking” request is accepted, it should be automatically added to
the sender’s schedule.
Route:/coordinator/viewSlotLinkingRequests/accept/:requestId
Route example: /coordinator/viewSlotLinkingRequests/accept/1608905195052
Request type: PUT
Parameters: :requestId = 1608905195052
Response: Request accepted
Response example: Request accepted
					{
					"reason": "",
					"acceptanceStatus": "accepted",
					"repAcceptanceStatus": "pending",
					"documentLink": "",
					"_id": "5fe5f1eb96c3f43e146c964c",
					"requestId": 1608905195052,
					"staffId": "123",
					"requestType": "slotLink",
					"courseID": "CSEN703",
					"roomNumber": "2",
					"tutorialNumber": 22,
					"day": "Tuesday",
					"slot": 1,
					"timestamp": "2020-12-25T14:06:35.052Z",
					"__v": 0
					}
					
					user schedule:
					[['Saturday',null,null,null,null,null],['Sunday',null,null,null,null,null],
					['Monday',null,null,null,null,null],['Tuesday',{tutorial:22,room:2},null,null,null,null],
					['Wednesday',null,null,null,null,null],['Thursday',null,null,null,null,null]]
					
					course schedule:
					[['Saturday',[],[],[],[],[]],['Sunday',[],[],[],[],[]],
					['Monday',[],[],[],[],[]],['Tuesday',[{tutorial:22,room:2,academic:"123"}],[],[],[],[]],
					['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]
					
					user schedule:
					[['Saturday',null,null,null,null,null],['Sunday',null,null,null,null,null],
					['Monday',null,null,null,null,null],['Tuesday',{tutorial:22,courseID:"CSEN703"},null,null,null,null],
					['Wednesday',null,null,null,null,null],['Thursday',null,null,null,null,null]]
=======================================================================================================================
Functionality: reject “slot linking” requests from academic members linked to his/her course.
Route:/coordinator/viewSlotLinkingRequests/reject/:requestId
Route example: /coordinator/viewSlotLinkingRequests/reject/1608905195052
Request type: PUT
Parameters: :requestId = 1608905195052
Response: Request rejected
Response example: Request rejected
					{
					"reason": "",
					"acceptanceStatus": "rejected",
					"repAcceptanceStatus": "pending",
					"documentLink": "",
					"_id": "5fe5f1eb96c3f43e146c964c",
					"requestId": 1608905195052,
					"staffId": "123",
					"requestType": "slotLink",
					"courseID": "CSEN703",
					"roomNumber": "2",
					"tutorialNumber": 22,
					"day": "Tuesday",
					"slot": 1,
					"timestamp": "2020-12-25T14:06:35.052Z",
					"__v": 0
					}
=======================================================================================================================
Functionality: Add course slot(s) in his/her course
Route:/coordinator/courseSchedule/addSlot/:courseID&:slot&:tutorial&:day&:room
Route example: /coordinator/courseSchedule/addSlot/CSEN703&1&1&Saturday&1
Request type: PUT
Parameters: :courseID = CSEN703 & :slot = 1& :tutorial = 1 & :day = Saturday & :room = 1
Response: Schedule Updated
Response example:	course schedule:
					[['Saturday',[{tutorial:1,room:1,academic:""}],[],[],[],[]],['Sunday',[],[],[],[],[]],
					['Monday',[],[],[],[],[]],['Tuesday',[],[],[],[],[]],
					['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]
=======================================================================================================================
Functionality: delete course slot(s) in his/her course
Route: /coordinator/courseSchedule/deleteSlot/:courseID&:slot&:tutorial&:day&:room
Route example: /coordinator/courseSchedule/deleteSlot/CSEN703&1&1&Saturday&1
Request type: PUT
Parameters: :courseID = CSEN703 & :slot = 1& :tutorial = 1 & :day = Saturday & :room = 1
Response: Schedule Updated
Response example:	course schedule:
					[['Saturday',[],[],[],[],[]],['Sunday',[],[],[],[],[]],
					['Monday',[],[],[],[],[]],['Tuesday',[],[],[],[],[]],
					['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]
=======================================================================================================================
Functionality: update course slot(s) in his/her course
Route:/coordinator/courseSchedule/updateSlot/:courseID&:slot&:tutorial&:day&:room&:slotNew&:tutorialNew&:dayNew&:roomNew
Route example: /coordinator/courseSchedule/updateSlot/CSEN703&1&1&Saturday&1&2&1&Saturday&1
Request type: PUT
Parameters: :courseID = CSEN703 & :slot = 1& :tutorial = 1 & :day = Saturday & :room = 1 & :slotNew = 2 & :tutorial = 1 & :day = Saturday & :room = 1
Response: Schedule Updated
Response example:	
					course schedule before:
					[['Saturday',[{tutorial:1,room:1,academic:""}],[],[],[],[]],['Sunday',[],[],[],[],[]],
					['Monday',[],[],[],[],[]],['Tuesday',[],[],[],[],[]],
					['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]

					course schedule after:
					[['Saturday',[],[{tutorial:1,room:1,academic:""}],[],[],[]],['Sunday',[],[],[],[],[]],
					['Monday',[],[],[],[],[]],['Tuesday',[],[],[],[],[]],
					['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]
=======================================================================================================================
Functionality:	Accept a request. if a request is accepted, appropriate logic should be executed to handle
this request
Route:	/hod/viewLeaveRequests/accept/:requestId
Route example: /viewLeaveRequests/accept/1608905356349
Request type: PUT
Parameters: :requestId = 1608905356349
Response: request accepted
Response example:
					1) {
						"reason": "malish nefs yasta 3ayez anam",
						"acceptanceStatus": "accepted",
						"repAcceptanceStatus": "accepted",
						"documentLink": "",
						"_id": "5fe5f28c96c3f43e146c964f",
						"requestId": 1608905356349,
						"staffId": "123",
						"requestType": "replacement",
						"departmentId": "7amada",
						"timestamp": "2020-12-25T14:09:16.349Z",
						"requestDay": "2020-12-24T00:00:00.000Z",
						"__v": 0
					}
					
					{
						toBeDeleted:"false",
						requestId:1608905356349,
						date:"2020-12-24T00:00:00.000Z",
						typeOfAction:"annualLeave"
					}
					2) {
						"reason": "malish nefs yasta 3ayez anam",
						"acceptanceStatus": "accepted",
						"repAcceptanceStatus": "pending",
						"documentLink": "",
						"_id": "5fe5f28c96c3f43e146c964f",
						"requestId": 1608905356349,
						"staffId": "123",
						"requestType": "compensationLeave",
						"departmentId": "7amada",
						"timestamp": "2020-12-25T14:09:16.349Z",
						"requestDay": "2020-12-24T00:00:00.000Z",
						"__v": 0
					}
					
					{
						toBeDeleted:"false",
						requestId:1608905356349,
						date:"2020-12-24T00:00:00.000Z",
						typeOfAction:"compensationLeave"
					}
=======================================================================================================================
Functionality: Reject a request, and optionally leave a comment as to why this request was rejected.
Route: /hod/viewLeaveRequests/reject/:requestId
Route example: /viewLeaveRequests/reject/1608905356349
Request type: PUT
Parameters: :requestId = 1608905356349
Response: request rejected
Response example:
					{
						"reason": "malish nefs yasta 3ayez anam",
						"acceptanceStatus": "rejected",
						"repAcceptanceStatus": "pending",
						"documentLink": "",
						"_id": "5fe5f28c96c3f43e146c964f",
						"requestId": 1608905356349,
						"staffId": "123",
						"requestType": "accidentalLeave",
						"departmentId": "7amada",
						"timestamp": "2020-12-25T14:09:16.349Z",
						"requestDay": "2020-12-24T00:00:00.000Z",
						"__v": 0
					}
=======================================================================================================================
Functionality:View all the requests “change day off/leave” sent by staff members in his/her department.
Route:/hod/viewLeaveRequests/:departmentId
Route example: /hod/viewLeaveRequests/7amada
Request type: GET
Parameters: :departmentId = 7amada
Response: [Requests]
Response example:
				[
					{
						"reason": "malish nefs yasta 3ayez anam",
						"acceptanceStatus": "rejected",
						"repAcceptanceStatus": "pending",
						"documentLink": "",
						"_id": "5fe5f28c96c3f43e146c964f",
						"requestId": 1608905356349,
						"staffId": "123",
						"requestType": "accidentalLeave",
						"departmentId": "7amada",
						"timestamp": "2020-12-25T14:09:16.349Z",
						"requestDay": "2020-12-24T00:00:00.000Z",
						"__v": 0
					}
				]
=======================================================================================================================
Functionality:View the coverage of each course in his/her department.
Route:/hod/viewCourseCoverage/:courseId
Route example: /hod/viewCourseCoverage/CSEN703
Request type: GET
Parameters: :courseId = CSEN703
Response: ...%
Response example: 50%
=======================================================================================================================
**********************************************************
		       H.O.D Part 2
**********************************************************
//1
Functionality:Assign an academic member as a course instructor to a specific course
Route:	/hod/AssignCourseInstructor/:hodID&:academicMemberID&:courseID
Route example: /AssignCourseInstructor/123&237&CSEN703
Request type: post
Parameters: {hodID ,academicMemberID ,courseID } 
Response Example: assigned successfully or course not found or No academic member with this id
			or No user with this id
=======================================================================================================================
//2
Functionality:Update an academic member type to a specific course
Route:	/hod/UpdateCourseInstructor/:hodID&:academicMemberID&:courseID
Route example:/UpdateCourseInstructor/123&237&CSEN703
Request type: put
Parameters: {hodID ,academicMemberID ,courseID } 
Response Example: updated successfully or course not found or No academic member with this id
			or No user with this id
=======================================================================================================================
//3
Functionality:demote academic member from being a course instructor
Route:	/hod/deleteCourseInstructor/:hodID&:academicMemberID&:courseID
Route example:/deleteCourseInstructor/123&237&CSEN703
Request type: delete
Parameters: {hodID ,academicMemberID ,courseID } 
Response Example: demoted successfully or course not found or No academic member with this id
			or No user with this id
=======================================================================================================================
//4
Functionality:View all the staff in his/her department
Route: /hod/viewAllStaffInMyDepartment/:hodID
Route example: /viewAllStaffInMyDepartment/123
Request type: get
Parameters: {hodID}
Response: array of all staffmembers in the hod's department 
Response example:[{"id":"7amada",
		"email":"7amada",
		"password":"7amada",
		"username":"7amada",
		"courses":[],
		"schedule":[[]],
		"accidentalLeaves":6,
		"annualLeaves":2.5,
		"daysOff":["Friday",null],
		"extraHours":0,
		"maternityDaysLeft":0,
		"missingDays":[],
		"missingHours":0,
		"notifications":[],
		"type":"Course Coordinator"},
		{"id":"7amada",
		"email":"7amada",
		"password":"7amada",
		"username":"7amada",
		"courses":[],
		"schedule":[[]],
		"accidentalLeaves":6,
		"annualLeaves":2.5,
		"daysOff":["Friday",null],
		"extraHours":0,
		"maternityDaysLeft":0,
		"missingDays":[],
		"missingHours":0,
		"notifications":[],
		"type":"Course Coordinator"}
	]
=======================================================================================================================
//5
Functionality:View all the staff in his/her department per course
Route: /hod/viewAllStaffPerCourse/:hodID
Route example: /viewAllStaffInMyDepartment/123
Request type: get
Parameters: {hodID}
Response: array of all staffmembers in the hod's department 
Response example:[{course:CSEN703,	
			[{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"},
			{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"}]},
		{course:CSEN704,	
			[{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"},
			{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"}]}]

=======================================================================================================================
//6
Functionality:view the dayoffs of all the staff members
Route:/hod/dayoffOfStaffMembers/:hodID
Route example: /dayoffOfStaffMembers/123
Request type: get
Parameters: {hodID} 
Response: an array of staff members ids for each id there is an array for the dayoffs
Response example:[{id:123 , dayOffs : ["Friday","Sunday"]},
			{id:237 , dayOffs : ["Friday","Saturday"]}]
=======================================================================================================================
//7					
Functionality:view the schedule for a staff member
Route:/hod/scheduleOfStaffMember/:hodID/:staffID
Route example: /scheduleOfStaffMember/123/237
Request type: get
Parameters: {hodID ,staffID} 
Response:an object containg the staff member id and and array for his/her dayoffs
Response example:{id:237 , dayOffs : ["Friday","Saturday"]}
=======================================================================================================================
//8
Functionality:view the schedule of a staff member
Route:/hod/scheduleOfStaffMember/:hodID/:staffID
Route example: /scheduleOfStaffMember/123/237
Request type: get
Parameters: {hodID ,staffID} 
Response: object containg the staff member id and and a his/her schedule
Response example:{id:237 , schedule: [['Saturday',slot,slot,slot,slot,slot],['Sunday',slot,slot,slot,slot,slot],
        				['Monday',slot,slot,slot,slot,slot],	['Tuesday',slot,slot,slot,slot,slot],
        				['Wednesday',slot,slot,slot,slot,slot],['Thursday',slot,slot,slot,slot,slot]]}
=======================================================================================================================
**********************************************************
                                              HR Part 1
**********************************************************
Functionality: Update User ID
Route:/user/:userId
Type: PUT
Request body:{“userId”:1234}
Response: User updated successfully
Example:{“UserId”:1234}
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Functionality: Delete User
Route:/user/:userId
Type: DELETE
Parameters: userID: Id to be deleted
Response: User was deleted successfully
Example: User was deleted successfully
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Functionality: Register a new User
Route: /user
Type: POST
Request body:
{“email:yzidan@gmail.com, “password”:yuyugtyugy1235gghrkwwlortueheyeh, “name”:zidan, “ID”:1234w4r, “Officelocation”:B3303}
Example:{new user[{“email:yzidan@gmail.com, “password”:yuyugtyugy1235gghrkwwlortueheyeh,
 “name”:zidan,
 “ID”:1234w4r,
 “Officelocation”:B3303}]
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Functionality: Update salary
Route: /User/:salary
Type: PUT
Request body:{”Usersalary”:7000”}
Example: {“UserId”: 1234}
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Functionality: Login
Route:/signin
Type: POST
Request body: Please sign in
Example: {Logged in}
=======================================================================================================================
**********************************************************
		      HR Part 2 & General
**********************************************************
Functionality:Login to the System
Route:/login
type:POST
Request body:{“email” :  “hr@gmail.com”, “password”:  “1234”}
Response:Token of the user  
Example of a token:	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyIiwidHlwZSI6IkhSIiwiaWF0IjoxNjA4ODg4ODQxfQ.FpSuO0Nt-dujsYq_rOCmyzg5IEuAGrfTc3kBtEtg4dM
=======================================================================================================================
Functionality:Update Email
Route:/staff/updateemail
type:PUT
Request body:{“email” :  “hr1@gmail.com”}
Response: User Data with Email uPDATED
Example:{"type":"HR","notifications":["You have 5 requests"],"courses":[],"daysOff":["Friday","Sunday"],"missingDays":[],"extraHours":10,"missingHours":0,"schedule":[["Saturday",null,null,null,null,null],["Sunday",null,null,null,null,null],["Monday",null,null,null,null,null],["Tuesday",null,null,null,null,null],["Wednesday",null,null,null,null,null],["Thursday",null,null,null,null,null]],"_id":"5fe0775efc4708344c8c5b0b","id":"02","email":"hr1@gmail.com","password":"$2b$10$Kb5vpA0J7.0OxlWDN02BOO5tikJiWiQ5EUFZCHxFCisoM/zF2SjEq","username":"Mohammed Hr","gender":"Male","faculty":"","department":"","salary":10000,"__v":0}
=======================================================================================================================
Functionality: Update Password
Route:/staff/updatepassword
type:PUT
Request body:{“password” : “111”}
Response: Updated Hashed Password
Example: {"password":"$2b$10$jiG0ZfH1UZcSNCaqngi.leDT9y8IGj8qfzCprVj8QtFa1cEfoiwTW"}
=======================================================================================================================
Functionality: Get Attendance
Route:/staff/attendance
type:GET
Response: Array of dates of attended Days in each Month
Example:[["18-12-2020","19-12-2020"],["1-1-2021","2-1-2021"]]
=======================================================================================================================
Functionality: Get Attendance by the Month
Route:/staff/attendance/:month
type:GET
Parameters: month: Month of Attendance 
Response: Array of attended days in a Month
Example: ["18-12-2020","19-12-2020"]
=======================================================================================================================
Functionality: Get Missing Days
Route:/staff/missingdays
type: GET 
Response: Array of Missing Days
Example: ["17-11-2020","15-12-2020"]
=======================================================================================================================
Functionality: Get Missing Hours
Route:/staff/missingHours
type:GET 
Response: Number of Missing Hours
Example: Missing Hours: 5.6
=======================================================================================================================
Functionality: Get Extra Hours
Route:/staff/extrahours
type:GET 
Response: Number of Extra Hours
Example: Extra Hours: 3
=======================================================================================================================
Functionality: Get Schedule
Route:/staff/schedule
type:GET 
Response: Schedule of staff Member
Example: Schedule: Saturday,
,
,
,
,
,Sunday,
,
,
,
,
,Monday,
,
,
,
,
,Tuesday,
,
,
,
,
,Wednesday,
,
,
,
,
,Thursday,
,
,
,
,
=======================================================================================================================
Functionality: Get Salary
Route:/staff/salary
type:GET
Response: Salary of staff member
Example: Salary: 7000
=======================================================================================================================
Functionality: Get Department
Route:/staff/department
type:GET
Response: Staff Member Department
Example: Department: MET
=======================================================================================================================
Functionality: Get Faculty
Route:/staff/faculty
type:GET
Response: Staff Member Faculty
Example: Faculty: Engineering
=======================================================================================================================
Functionality: Get Notifications
Route:/staff/notifications
type:GET
Response: Staff Member Notifications
Example: Notifications: []
=======================================================================================================================
Functionality: Add Location
Route:/hr/location
type:POST
Request body:{"maxCapacity":25,"roomId":"C7201","type":"Tutorial Room"}
Response: Attributes of Room Added
Example: {
    "schedule": [
        [
            "Saturday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Sunday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Monday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Tuesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Wednesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Thursday",
            null,
            null,
            null,
            null,
            null
        ]
    ],
    "_id": "5fe5c3edcf4e5d15e02cb5d9",
    "maxCapacity": 25,
    "roomId": "C7201",
    "type": "Tutorial Room",
    "__v": 0
}
=======================================================================================================================
Functionality: Get Locations
Route:/hr/location
type:GET
Response: Attributes of All Rooms
Example: {
    "schedule": [
        [
            "Saturday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Sunday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Monday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Tuesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Wednesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Thursday",
            null,
            null,
            null,
            null,
            null
        ]
    ],
    "_id": "5fe5c3edcf4e5d15e02cb5d9",
    "maxCapacity": 25,
    "roomId": "C7201",
    "type": "Tutorial Room",
    "__v": 0
}
=======================================================================================================================
Functionality: Edit Location Max Capacity
Route:/hr/location/:roomId/maxcapacity
type:PUT
Request body:{"maxCapacity":30}
Parameters: roomId: Id of the room to be changed
Response: New Location Max Capacity
Example: Max Capacity: 30
=======================================================================================================================
Functionality: Edit Location Type
Route:/hr/location/:roomId/type
type:PUT
Request body:{"type":"Lecture Hall"}
Parameters: roomId: Id of the room to be changed
Response: New Room Type
Example: Type: Lecture Hall
=======================================================================================================================
Functionality: Edit Location Schedule
Route:/hr/location/:roomId/schedule
type:PUT
Request body:{"schedule":[
        [
            "Saturday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Sunday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Monday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Tuesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Wednesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Thursday",
            null,
            null,
            null,
            null,
            null
        ]
    ]}
Parameters: roomId: Id of the room to be changed
Response: New Room Schedule
Example: Schedule: [
        [
            "Saturday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Sunday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Monday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Tuesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Wednesday",
            null,
            null,
            null,
            null,
            null
        ],
        [
            "Thursday",
            null,
            null,
            null,
            null,
            null
        ]
    ]
=======================================================================================================================
Functionality: Edit Location Type
Route:/hr/location/:roomId
type:DELETE
Parameters: roomId: Id of the room to be Deleted
Response: Deleted Room Id
Example: Room C7201 Deleted
=======================================================================================================================
Functionality: Add A Faculty
Rotue:/hr/faculty
type: POST
Request Body: {"id":"4","name":"Faculty 4","departments":["Depart 4.1","Depart 4.2"]}
Response: Added Faculty
Example: {"departments":["Depart 4.1","Depart 4.2"],"_id":"5fe5caca549b9945b0e19581","id":4,"name":"Faculty 4","__v":0}
=======================================================================================================================
Functionality: Edit A Faculty Name
Rotue:/hr/faculty/:id/name
type: PUT
Request Body: {"name":"Faculty 5"}
Parameters: id: Id of the Faculty to be Edited
Response: New Name
Example: Name: Faculty 5
=======================================================================================================================
Functionality: Edit A Faculty Departments
Rotue:/hr/faculty/:id/departments
type: PUT
Request Body: {"departments":["Depart 5.1","Depart 5.2"]}
Parameters: id: Id of the Faculty to be Edited
Response: New Departments
Example: Departments: ["Depart 5.1","Depart 5.2"]
=======================================================================================================================
Functionality: Delet A Faculty 
Rotue:/hr/faculty/:id
type: DELETE
Parameters: id: Id of the Faculty to be Deleted
Response: Deleted Faculty
Example: {"departments":["Depart 4.1","Depart 4.2"],"_id":"5fe5caca549b9945b0e19581","id":4,"name":"Faculty 4","__v":0}
=======================================================================================================================
Functionality: Add A Department
Rotue:/hr/department
type: POST
Request Body: {"id":"4","name":"Depart 4.1","HOD":"Slim","courses":["Course 4.1","Course 4.2"],"staff":["Slim","Bassem"],"facultyName":"Faculty 4"}
Response: Added Department
Example: {"courses":["Course 4.1","Course 4.2"],"staff":["Slim","Bassem"],"_id":"5fe5cd68549b9945b0e19582","name":"Depart 4.1","HOD":"Slim","id":"4","__v":0}
=======================================================================================================================
Functionality: Edit A Department Name
Rotue:/hr/department/:departmentId/name
type: PUT
Request Body: {"name":"Department 5"}
Parameters: departmentId: ID of Department to be changed
Response: New Name
Example: Name: Department 5
=======================================================================================================================
Functionality: Edit A Department HOD
Rotue:/hr/department/:departmentId/hod
type: PUT
Request Body: {"HOD":"Dr. Slim"}
Parameters: departmentId: ID of Department to be changed
Response: New HOD
Example: HOD: DR. Slim
=======================================================================================================================
Functionality: Edit A Department Courses
Rotue:/hr/department/:departmentId/courses
type: PUT
Request Body: {"courses":["Course 5.1","Course 5.2"]}
Parameters: departmentId: ID of Department to be changed
Response: New Courses
Example: Courses: ["Course 5.1","Course 5.2"]
=======================================================================================================================
Functionality: Edit A Department Staff
Rotue:/hr/department/:departmentId/staff
type: PUT
Request Body: {"staff":["Dr. Slim","Bassem","Osama"]}
Parameters: departmentId: ID of Department to be changed
Response: New Staff
Example: Staff: ["Dr. Slim","Bassem","Osama"]
=======================================================================================================================
Functionality: Delet A Department 
Rotue:/hr/department/:departmentId
type: DELETE
Parameters: departmentId: ID of Department to be Deleted
Response: Deleted Department
Example: Department 4 Deleted
=======================================================================================================================
Functionality: Add A Course
Rotue:/hr/course
type: POST
Request Body: {"id":"4","name":"Course 4.1","staff":["Slim"],"department":"Depart 4"}
Response: Added Course
Example:{"staff":["Slim"],"schedule":[["Saturday",null,null,null,null,null],["Sunday",null,null,null,null,null],["Monday",null,null,null,null,null],["Tuesday",null,null,null,null,null],["Wednesday",null,null,null,null,null],["Thursday",null,null,null,null,null]],"_id":"5fe5d087549b9945b0e19583","name":"Course 4.1","id":"4","department":"Depart 4","__v":0}
=======================================================================================================================
Functionality: Edit A Course Name
Rotue:/hr/course/:courseId/name
type: PUT
Request Body: {"name":"Course 5.1"}
Parameters: courseId: Id of course to be edited
Response: New Name
Example: Name: Course 5.1
=======================================================================================================================
Functionality: Edit A Course Staff
Rotue:/hr/course/:courseId/staff
type: PUT
Request Body: {"staff":["Dr. Slim","Osama"]}
Parameters: courseId: Id of course to be edited
Response: New Staff
Example: Staff: ["Dr. Slim","Osama"]
=======================================================================================================================
Functionality: Edit A Course Schedule
Rotue:/hr/course/:courseId/schedule
type: PUT
Request Body: {"schedule":[["Saturday",null,null,null,null,null],["Sunday",null,null,null,null,null],["Monday",null,null,null,null,null],["Tuesday",null,null,null,null,null],["Wednesday",null,null,null,null,null],["Thursday",null,null,null,null,null]]}
Parameters: courseId: Id of course to be edited
Response: New Schedule
Example: 
Schedule: [["Saturday",null,null,null,null,null],
		  ["Sunday",null,null,null,null,null],
["Monday",null,null,null,null,null],
["Tuesday",null,null,null,null,null],
["Wednesday",null,null,null,null,null],
["Thursday",null,null,null,null,null]]
=======================================================================================================================
Functionality: Edit A Course Department 
Rotue:/hr/course/:courseId/department
type: PUT
Request Body: {"department":"Depart 5"}
Parameters: courseId: Id of course to be edited
Response: New Department
Example: Department: Depart 5
=======================================================================================================================
Functionality: Delete A Course 
Rotue:/hr/course/:courseId
type: DELETE
Parameters: courseId: Id of course to be Deleted
Response: Deleted Course
Example: {"staff":["Slim"],"schedule":[["Saturday",null,null,null,null,null],["Sunday",null,null,null,null,null],["Monday",null,null,null,null,null],["Tuesday",null,null,null,null,null],
["Wednesday",null,null,null,null,null],["Thursday",null,null,null,null,null]],"_id":"5fe5d087549b9945b0e19583","name":"Course 4.1","id":"4","department":"Depart 4","__v":0}
=======================================================================================================================
Functionality: Sign in
Route:/signin
type:POST
Response: Confirmation of signing in
Example: Signed In
=======================================================================================================================
Functionality: Sign Out
Route:/signout
type:POST
Response: Confirmation of signing in
Example: Signed Out
=======================================================================================================================
Functionality:Logout of the system
Route:/logout
type:POST
Response: Confirmation of Logging Out
Example: Logged Out
=======================================================================================================================
**********************************************************
		           Instructor
**********************************************************
//1
Functionality:view all courses for a user
Route:/instructor/viewCourses/:id
Route example: /instructor/viewCourses/123
Request type: get
Parameters:{id} 
Response: array of courses
Response example:["CSEN701","CSEN702","CSEN703","CSEN704"]
=======================================================================================================================
//2
Functionality:view a schedule for a user
Route:/instructor/slotsAssignment/:id
Route example: /instructor/slotsAssignment/123
Request type: get
Parameters:{id} 
Response: the schedule of the user
Response example: ['Saturday',slot,slot,slot,slot,slot],['Sunday',slot,slot,slot,slot,slot],
        		['Monday',slot,slot,slot,slot,slot],['Tuesday',slot,slot,slot,slot,slot],
        		['Wednesday',slot,slot,slot,slot,slot],['Thursday',slot,slot,slot,slot,slot]
=======================================================================================================================
//3
Functionality:view all staff in his/her department
Route:/instructor/staffInSameDepartment/:id
Route example: /instructor/staffInSameDepartment/123
Request type: get
Parameters:{id} 
Response: an array of staff members
Response example:[{"id":"7amada",
		"email":"7amada",
		"password":"7amada",
		"username":"7amada",
		"courses":[],
		"schedule":[[]],
		"accidentalLeaves":6,
		"annualLeaves":2.5,
		"daysOff":["Friday",null],
		"extraHours":0,
		"maternityDaysLeft":0,
		"missingDays":[],
		"missingHours":0,
		"notifications":[],
		"type":"Course Coordinator"},
		{"id":"7amada",
		"email":"7amada",
		"password":"7amada",
		"username":"7amada",
		"courses":[],
		"schedule":[[]],
		"accidentalLeaves":6,
		"annualLeaves":2.5,
		"daysOff":["Friday",null],
		"extraHours":0,
		"maternityDaysLeft":0,
		"missingDays":[],
		"missingHours":0,
		"notifications":[],
		"type":"Course Coordinator"}
	]
=======================================================================================================================
//4
Functionality:view all staff  per course
Route:/instructor/staffPercourse/:id
Route example: /instructor/staffPercourse/123
Request type: get
Parameters:{id} 
Response: array of all staffmembers in the instructors's department 
Response example:[{course:CSEN703,	
			[{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"},
			{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"}]},
		{course:CSEN704,	
			[{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"},
			{"id":"7amada",
			"email":"7amada",
			"password":"7amada",
			"username":"7amada",
			"courses":[],
			"schedule":[[]],
			"accidentalLeaves":6,
			"annualLeaves":2.5,
			"daysOff":["Friday",null],
			"extraHours":0,
			"maternityDaysLeft":0,
			"missingDays":[],
			"missingHours":0,
			"notifications":[],
			"type":"Course Coordinator"}]}]
=======================================================================================================================
//5
Functionality:Assign an academic member to an unassigned slots in course(s)
Route:
/instructor/assignAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:day&:slot&:tutorial
Route example: /assignAcadmicMemberToCourseSlot/237&CSEN703&123&H11&Saturday&3&T24
Request type: post
Parameters: {courseInstructorID,courseID,acadmicMemberID,roomID,day,slot,tutorial}
Response: Status of the respond
Response example: Schedule Updated or No user with this id or Course not found
=======================================================================================================================
//6
Functionality:Update an academic member assignment in course(s)
Route:
/instructor/updateAssignmentAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:oldRoomID&:day&:slot&:oldDay&:slot&:tutorial&:oldTutorial
Route example: /updateAssignmentAcadmicMemberToCourseSlot/237&CSEN703&123&:roomID&H11&Saturday&3&Saturday&4&T24&T22
Request type: post
Parameters: {courseInstructorID,courseID,acadmicMemberID,roomID,oldRoomID,day,slot,oldDay,slot,tutorial,oldTutorial}
Response: Status of the respond
Response example: Schedule Updated or No user with this id or Course not found
=======================================================================================================================
//7
Functionality:Delete an academic member assignment in course(s)
Route:
/instructor/assignAcadmicMemberToCourseSlot/:courseInstructorID&:courseID&:acadmicMemberID&:roomID&:day&:slot&:tutorial
Route example: /instructor/assignAcadmicMemberToCourseSlot/237&CSEN703&123&H11&Saturday&4&T24
Request type: delete
Parameters: {courseInstructorID,courseID,acadmicMemberID,roomID,day,slot,tutorial}
Response: Status of the respond
Response example: Assignment removes or No user with this id or Course not found
=======================================================================================================================
//8
Functionality:Remove an assigned academic member in course(s)
Route:
/instructor/removeAcademicMemberFromACourse/:instructorID&:academicMemberID&:courseID
Route example: /instructor/removeAcademicMemberFromACourse/237&123&CSEN703
Request type: delete
Parameters: {instructorID,academicMemberID,courseID}
Response: Status of the respond
Response example: Schedule Updated or No user with this id or Course not found
=======================================================================================================================
//9
Functionality:Assign an academic member in each of his/her course(s) to be a course coordinator.
Route:
/instructor/assignCourseCoordinator/:courseInstructorID/:acadmicMemberID/:courseID
Route example: /instructor/assignCourseCoordinator/237/123/CSEN703
Request type: put
Parameters: {courseInstructorID,acadmicMemberID,courseID}
Response: Status of the respond
Response example: "Academic Member has been assigned as a course coordinator" or No user with this id or Course not found

