import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUserLeaves } from "../../../../services/operations/leaveAPI";

const Staff = () => {
    const { token } = useSelector((state) => state.auth);
    const [leavesData, setLeavesData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchLeavesTaken = async () => {
        try {
            const response = await getAllUserLeaves(token);
            setLeavesData(response);
            console.log("All user leaves: ", response.totalLeavesTaken);
        } catch (e) {
            console.log("Error in fetching leaves: ", e);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchLeavesTaken();
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className=" w-full">
                <p className=" w-full text-end">Leaves Taken: {leavesData? leavesData.totalLeavesTaken : 0}</p>
                {
                  leavesData &&
                  leavesData.map((leave) => {
                    return(
                      // LEAVE KE CARD BNAANE HAI ACCORDINGLY
                      // SAARE VARIETY KE LIYE, 

                      <LeaveCard leave={leave} key={leave._id} />
                    )
                  })
                }
            </div>
        </div>
    );
};

export default Staff;
