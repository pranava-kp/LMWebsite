const Leave = require("../model/leave");
const User = require("../model/user");
const Profile = require("../model/profile");
const moment = require("moment");

exports.createLeave = async (req, res) => {
    try {
        const { category, subject, body } = req.body;
        const startDate = moment(req.body.startDate, "DD-MMM-YYYY");
        const endDate = moment(req.body.endDate, "DD-MMM-YYYY");
        if (!category || !subject || !body || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
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
        // console.log(user);

        // Checking if leave count is available at the backend
        const profile = await User.findById(user.id).populate({
            path: "additionalDetails",
            populate: {
                path: "leaves",
            },
        });
        const additionalDetails = profile.additionalDetails;
        console.log("additionalDetails: ", additionalDetails);

        //Calculating the no. of leaves user already taken
        const totalDaysTaken = additionalDetails.leaves.reduce(
            (total, leave) => {
                const leaveDuration =
                    Math.ceil(
                        (leave.endDate - leave.startDate) /
                            (1000 * 60 * 60 * 24)
                    ) + 1;
                return total + leaveDuration;
            },
            0
        );
        console.log("total leaves user already took: ", totalDaysTaken);
        console.log("startDate: ", startDate);
        console.log("endDate: ", endDate);
        const dateDifferenceInDays = endDate.diff(startDate, "days") + 1;
        console.log(
            "dateDifferenceInDays for current leave duration user is asking for: ",
            dateDifferenceInDays
        );

        if (dateDifferenceInDays > 12 - totalDaysTaken) {
            return res.status(400).json({
                success: false,
                message: "Leave duration cannot be more than left leaves",
            });
        }

        // After checking all the conditions, create the leave
        const leave = await Leave.create({
            user: user.id,
            category,
            subject,
            body,
            startDate,
            endDate,
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
