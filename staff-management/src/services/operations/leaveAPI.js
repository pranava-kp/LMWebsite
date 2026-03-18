import { toast } from "react-hot-toast";
import { setLoading } from "../slices/authSlice";
import { leaveEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

// Make sure UPDATE_LEAVE_STATUS is correctly exported in your leaveEndpoints/apis file!
const { CREATE_LEAVE, GET_ALL_USER_LEAVES, UPDATE_LEAVE_STATUS } = leaveEndpoints;

export function createLeave(
  subject,
  body,
  startDate,
  endDate,
  category,
  substituteTeachers,
  token
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        CREATE_LEAVE,
        {
          subject,
          body,
          startDate,
          endDate,
          category,
          substituteTeachers,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("Create leave API response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Leave created successfully");

      // Return the API response so NewLeave can use result.success
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot create leave");
      console.log("Error in createLeave:", error);

      // Return an error object so NewLeave can detect failure
      return { success: false, message: error.message };
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export async function getAllUserLeaves(token, filters = {}) {
  const toastId = toast.loading("Loading leaves...");
  try {
    const params = {};
    //console.log(filters.departments);
    if (filters.departments && filters.departments.length > 0) {
      params.departments = filters.departments.join(",");
    }
    if (filters.status) {
      params.status = filters.status;
    }
    // Always send accountTypes as "Staff" as per the requirement
    params.accountTypes = "Staff";

    console.log("getAllUserLeaves (API): Fetching with params:", params);

    const response = await apiConnector(
      "GET",
      GET_ALL_USER_LEAVES,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );

    console.log("getAllUserLeaves (API) response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch leaves.");
    }
    toast.success("Leaves fetched successfully");
    return response.data.data;
  } catch (error) {
    console.error("Error in fetching leaves:", error);
    toast.error(error.response?.data?.message || "Cannot fetch leaves");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

export async function updateLeaveStatus(token, leaveId, status, incomingText = "") {
  const toastId = toast.loading("Updating leave status...");
  try {
    const payload = {
      leaveId,
      status,
      // FIX: We send the text under BOTH names so the backend cannot possibly miss it.
      comment: incomingText,
      rejectionReason: incomingText,
    };

    // Completing the missing API call that got cut off by the merge conflict
    const response = await apiConnector(
      "POST", // Adjust to "PUT" if your backend requires it
      UPDATE_LEAVE_STATUS, 
      payload,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update leave status.");
    }

    return response.data;
  } catch (error) {
    console.error("Error in updating leave status:", error);
    toast.error(error.response?.data?.message || "Cannot update leave status");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}