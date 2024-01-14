const Leave = require("../model/leave");
const User = require("../model/user");
const Profile = require("../model/profile");

exports.createLeave = async (req, res) => {
    try {
        const { category, subject, body, startDate, endDate } = req.body;
        const user = req.user;
        console.log(user);
        // Checking if leave count is available at the backend
        const profile = await User.findById(user.id).populate({
            path: "additionalDetails",
            populate: {
                path: "leaves",
            },
        });
        const additionalDetails = profile.additionalDetails;
        console.log("additionalDetails: ", additionalDetails);
        // Aggregate the total leave duration using MongoDB aggregation framework
        const result = await additionalDetails.aggregate([
            {
                $project: {
                    totalLeaveDuration: {
                        $reduce: {
                            input: "$leaves",
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    {
                                        $add: [
                                            {
                                                $divide: [
                                                    {
                                                        $subtract: [
                                                            "$$this.endDate",
                                                            "$$this.startDate",
                                                        ],
                                                    },
                                                    86400000,
                                                ],
                                            }, // Convert milliseconds to days
                                            1, // Including the end date
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        ]);
        console.log("result: ", result);
        // const leaveDaysTaken = result[0] ? result[0].totalLeaveDuration : 0;
        const leaveDaysTaken = 0;
        const leave = await Leave.create({
            user: user.id,
            category,
            subject,
            body,
            startDate,
            endDate,
        });
        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid date format." });
        }
        if (startDate > endDate) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid date range." });
        }
        const dateDifferenceInDays = Math.floor(
            (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        if (dateDifferenceInDays > 12 - leaveDaysTaken) {
            return res.status(400).json({
                success: false,
                message: "Leave duration cannot be more than left leaves",
            });
        }
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
            message: "Leave created successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const user = req.user;
        const leaves = await Leave.find({ user: user._id });
        return res.status(200).json({
            message: "All leaves fetched successfully",
            leaves,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
