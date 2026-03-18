const Leave = require("../model/leave");
const User = require("../model/user");
const Profile = require("../model/profile");
const moment = require("moment");
const { becameSubstituteTeacher } = require("../mail/templates/becameSubstituteTeacher");
const mailSender = require("../utils/mailSender");
// TODO: Ensure you have this import for Cloudinary!
// const { uploadFileToCloudinary } = require("../utils/imageUploader");

exports.createLeave = async (req, res) => {
    try {
        const { subject, body, category, substituteTeachers } = req.body;
        const startDate = moment(req.body.startDate, "YYYY-MM-DD");
        const endDate = moment(req.body.endDate, "YYYY-MM-DD");
        
        if (
            !subject ||
            !body ||
            !startDate ||
            !endDate ||
            !category ||
            !substituteTeachers
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Checking if dates are valid and if End date is before Start date
        if (
            !startDate.isValid() ||
            !endDate.isValid() ||
            startDate.isAfter(endDate)
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid leave period." });
        }
        
        const user = req.user;

        // Checking if Leave count are available at the backend
        const profile = await User.findById(user.id).populate({
            path: "additionalDetails",
            populate: {
                path: "leaves",
            },
        });
        const absentTeacherName = `${profile.firstName} ${profile.lastName}`
        const additionalDetails = profile.additionalDetails;
        console.log("additionalDetails: ", additionalDetails);

        // --- LEAVE RULE VALIDATION LOGIC ---
        const requestedDays = endDate.diff(startDate, "days") + 1;

        // Fetch user's existing leaves for the current year (excluding rejected ones)
        const startOfYear = moment().startOf('year').toDate();
        const endOfYear = moment().endOf('year').toDate();
        
        const existingLeaves = await Leave.find({
            user: user.id,
            status: { $nin: ['Rejected by HOD', 'Rejected by Principal'] },
            startDate: { $gte: startOfYear, $lte: endOfYear }
        });

        // Tally up what they have taken so far
        let casualThisYear = 0;
        let casualThisMonth = 0;
        let restrictedThisYear = 0;

        existingLeaves.forEach(l => {
            const days = moment(l.endDate).diff(moment(l.startDate), 'days') + 1;
            
            if (l.category === 'Casual Leave') {
                casualThisYear += days;
                // Check if the leave falls in the current calendar month
                if (moment(l.startDate).isSame(startDate, 'month')) {
                    casualThisMonth += days;
                }
            }
            if (l.category === 'Restricted Holiday') {
                restrictedThisYear += days;
            }
        });

        // Apply specific rules based on the category requested
        if (category === 'Casual Leave') {
            if (casualThisYear + requestedDays > 12) {
                return res.status(400).json({ success: false, message: `Yearly limit reached. You only have ${12 - casualThisYear} Casual Leaves left this year.` });
            }
            if (casualThisMonth + requestedDays > 3) {
                return res.status(400).json({ success: false, message: `Monthly limit reached. You can only take 3 Casual Leaves per month.` });
            }
        } 
        else if (category === 'Earned Leave') {
            const availableEarned = profile.leaveBalances?.earnedLeave?.balance ?? 10;
            if (requestedDays > availableEarned) {
                return res.status(400).json({ success: false, message: `Insufficient balance. You only have ${availableEarned} Earned Leaves available.` });
            }
        } 
        else if (category === 'Restricted Holiday') {
            if (restrictedThisYear + requestedDays > 2) {
                return res.status(400).json({ success: false, message: `Limit reached. You can only take 2 Restricted Holidays per year.` });
            }
        } 
        else if (category === 'Maternity Leave') {
            if (requestedDays > 180) { 
                return res.status(400).json({ success: false, message: "Maternity Leave cannot exceed 6 months (180 days)." });
            }
            // If you still want to re-assign 'body', it must be let instead of const above, 
            // or just rely on the DB text. Assuming it's let in your original code.
            // body = `[MATERNITY LEAVE - REQUIRES OFFICER APPROVAL]\n` + body;
        }

        const dateDifferenceInDays = requestedDays; 
                
        // --- FETCH SUBSTITUTE TEACHER DETAILS FROM DB ---
        // Gather all unique Object IDs from the nested payload
        const uniqueTeacherIds = new Set();
        Object.values(substituteTeachers).forEach(daySchedule => {
            Object.values(daySchedule).forEach(teacherId => {
                uniqueTeacherIds.add(teacherId);
            });
        });

        // Fetch all matching users from the database to get their emails and names
        const substituteUsers = await User.find({
            _id: { $in: Array.from(uniqueTeacherIds) }
        }).select("firstName lastName email department");

        // Create a dictionary mapping: { "objectId": { userDetails } }
        const teacherMap = {};
        substituteUsers.forEach(sub => {
            teacherMap[sub._id.toString()] = sub;
        });

        // --- CLOUDINARY UPLOAD LOGIC ---
        let uploadedDocumentUrl = "";
        
        if (req.files && req.files.supportDocument) {
            const document = req.files.supportDocument;
            try {
                const uploadDetails = await uploadFileToCloudinary(
                    document,
                    process.env.CLOUDINARY_FOLDER
                );
                uploadedDocumentUrl = uploadDetails.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading support document to Cloudinary",
                });
            }
        }

        // Create leave record in MongoDB
        const leave = await Leave.create({
            user: user.id,
            category,
            subject,
            body,
            startDate,
            endDate,
            substituteTeachers,
            documentUrl: uploadedDocumentUrl // Saving the URL if it exists
        });

        // Push the leave to the user's profile
        await Profile.findByIdAndUpdate(
            additionalDetails._id,
            {
                $push: {
                    leaves: leave._id,
                },
            },
            { new: true }
        );

        // Send email to substitute teachers
        try {
            const extractEmails = (data) => {
                const emails = [];
                const days = Object.keys(data);
                console.log("Days error wala:", days)
                days.forEach((dayKey, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    data[dayKey].forEach((person) => {
                        emails.push({
                            dayToAdd: dayNumber - 1,
                            name: `${person.firstName} ${person.lastName}`,
                            email: person.email,
                        });
                    });
                });
                return emails;
            };
            
            const emails = extractEmails(substituteTeachers);
            console.log(emails);

            const processMails = async (emails) => {
                for (const { dayToAdd, name, email } of emails) {
                    await mailSender(
                        email,
                        "Substitute Assignment",
                        becameSubstituteTeacher(
                            startDate,
                            dayToAdd,
                            name,
                            `${absentTeacherName}`
                        )
                    );
                    console.log(`Message sent for day ${dayToAdd} to ${email}`);
                }
            };

            processMails(emails)
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        return res.status(200).json({
            message: `Leave created successfully for ${dateDifferenceInDays} days`,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            success: false,
        });
    }
};

exports.getAllUserLeaves = async (req, res) => {
    try {
        const user = req.user;
        console.log("User id: ", user.id);
        const leaves = await Leave.find({ user: user.id });
        const totalLeavesTaken = leaves.reduce((total, leave) => {
            const leaveDuration =
                Math.ceil(
                    (leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)
                ) + 1;
            return total + leaveDuration;
        }, 0);
        return res.status(200).json({
            message: "All leaves fetched successfully",
            data: {
                leaves,
                totalLeavesTaken,
            },
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId, status, comment } = req.body;
        const user = req.user;

        // Basic validation
        if (!leaveId || !status || !['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid leaveId and status (Approved/Rejected) are required",
            });
        }

        // Find the leave
        const leave = await Leave.findById(leaveId).populate('user');
        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave not found",
            });
        }

        // Determine status transitions based on Role
        let newStatus = "";

        if (user.accountType === 'HOD') {
            if (user.department !== leave.user.department) {
                return res.status(403).json({
                    success: false,
                    message: "HOD can only process leaves from their own department",
                });
            }

            if (leave.status !== 'Awaiting HOD Approval' && leave.status !== 'Pending') {
                return res.status(400).json({
                    success: false,
                    message: `Leave is not in a state to be approved by HOD (Current status: ${leave.status})`,
                });
            }

            newStatus = (status === 'Approved') ? 'Awaiting Principal Approval' : 'Rejected by HOD';

        } else if (user.accountType === 'Principal') {
            if (leave.status !== 'Awaiting Principal Approval') {
                return res.status(400).json({
                    success: false,
                    message: `Leave must be approved by HOD first (Current status: ${leave.status})`,
                });
            }

            newStatus = (status === 'Approved') ? 'Approved' : 'Rejected by Principal';

        } else {
            return res.status(403).json({
                success: false,
                message: "Only HOD or Principal can update leave status",
            });
        }

        // Update leave record
        leave.status = newStatus;
        leave.updatedAt = new Date();

        // --- CLEAN COMMENT LOGIC ---
        const textToSave = req.body.comment || req.body.rejectionReason || "";

        let actionWord = newStatus;
        if (newStatus === 'Awaiting Principal Approval') actionWord = 'Approved';
        if (newStatus === 'Rejected by HOD') actionWord = 'Rejected';
        if (newStatus === 'Rejected by Principal') actionWord = 'Rejected';

        if (!leave.comments) leave.comments = [];
        leave.comments.push({
            role: user.accountType,
            name: `${user.firstName} ${user.lastName}`,
            action: actionWord,
            commentText: textToSave.trim(),
            timestamp: new Date()
        });

        await leave.save();

        // --- DEDUCT EARNED LEAVE BALANCE ---
        if (newStatus === 'Approved' && leave.category === 'Earned Leave') {
            const requestedDays = moment(leave.endDate).diff(moment(leave.startDate), 'days') + 1;
            
            await User.findByIdAndUpdate(leave.user._id, {
                $inc: { 
                    "leaveBalances.earnedLeave.balance": -requestedDays,
                    "leaveBalances.earnedLeave.takenThisYear": requestedDays
                }
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Leave ${newStatus.toLowerCase()} successfully`,
            data: {
                _id: leave._id,
                status: leave.status,
                updatedAt: leave.updatedAt,
                subject: leave.subject,
                user: {
                    _id: leave.user._id,
                    name: `${leave.user.firstName} ${leave.user.lastName}`
                }
            },
        });

    } catch (err) {
        console.error("Leave status update error:", err);
        return res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
            success: false,
        });
    }
};

exports.editLeave = async (req, res) => {
    try {
        const { leaveId, subject, body, category, startDate, endDate, substituteTeachers } = req.body;
        const userId = req.user.id;

        // Find the leave
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave not found"
            });
        }

        // Security Check
        if (leave.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own leave requests."
            });
        }

        // Status Check
        if (leave.status !== 'Awaiting HOD Approval' && leave.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `You cannot edit this leave because it is already ${leave.status}.`
            });
        }

        // Update the fields
        if (subject) leave.subject = subject;
        if (body) leave.body = body;
        if (category) leave.category = category;
        if (substituteTeachers) leave.substituteTeachers = substituteTeachers;

        // Handle date updates carefully
        if (startDate && endDate) {
            const newStartDate = moment(startDate, "YYYY-MM-DD");
            const newEndDate = moment(endDate, "YYYY-MM-DD");

            if (!newStartDate.isValid() || !newEndDate.isValid() || newStartDate.isAfter(newEndDate)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid leave period provided."
                });
            }
            leave.startDate = newStartDate;
            leave.endDate = newEndDate;
        }

        leave.updatedAt = new Date();

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave updated successfully",
            data: leave,
        });

    } catch (err) {
        console.error("Edit leave error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};