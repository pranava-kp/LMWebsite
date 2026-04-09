import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";

const LeaveDetailsModal = ({ isOpen, onClose, leave, canApproveReject, onProcessLeave, isProcessing, onEditLeave }) => {
  const [comment, setComment] = useState("");
  const [showRejectionConfirmation, setShowRejectionConfirmation] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + "/getuserdept" || "http://localhost:2000/api/v1/getuserdept", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const responseData = await response.json();
        if (responseData?.success && responseData?.data?.users) {
          setStaffList(responseData.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch staff list:", error);
      }
    };

    if (isOpen && token && leave?.substituteTeachers) {
      fetchStaff();
    }
  }, [isOpen, token, leave]);

  const getStaffName = (id) => {
    const staff = staffList.find(s => s._id === id);
    if (staff) {
      const dept = staff.department?.departmentName || staff.department || "No Dept";
      return `${staff.firstName} ${staff.lastName} (${dept})`;
    }
    return "Loading teacher...";
  };

  let parsedSubs = {};
  try {
    parsedSubs = typeof leave?.substituteTeachers === "string" 
      ? JSON.parse(leave.substituteTeachers) 
      : (leave?.substituteTeachers || {});
  } catch (error) {
    parsedSubs = {};
  }

  if (!isOpen || !leave) return null;

  const handleRejectClick = () => setShowRejectionConfirmation(true);
  const handleCancelRejectConfirmation = () => setShowRejectionConfirmation(false);

  const handleConfirmReject = () => {
    onProcessLeave(leave, "reject", comment || "", true); 
    setShowRejectionConfirmation(false);
    setComment("");
  };

  const handleApproveClick = () => {
    onProcessLeave(leave, "approve", comment || "", true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full md:w-fit md:min-w-[450px] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Leave Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={isProcessing}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3 text-gray-700">
          <p><strong>Subject:</strong> {leave.subject}</p>
          {leave.user && (
            <p><strong>Applied By:</strong> {leave.user.firstName} {leave.user.lastName} ({leave.user.department})</p>
          )}
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-bold ${
              ["Pending", "Awaiting HOD Approval", "Awaiting Principal Approval"].includes(leave.status) ? "text-yellow-600" :
              leave.status === "Approved" ? "text-green-600" : "text-red-600"
            }`}>
              {leave.status}
            </span>
          </p>
          <p><strong>Category:</strong> {leave.category}</p>
          <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString('en-GB')}</p>
          <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString('en-GB')}</p>
          
          <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
            <p className="font-bold mb-1">Description:</p>
            <p className="break-all whitespace-pre-wrap text-sm">{leave.body}</p>
            
            {/* --- NEW: UNIVERSAL VIEW DOCUMENT BUTTON --- */}
            {(leave.documentUrl || leave.supportDocument || leave.document) && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <a 
                  href={leave.documentUrl || leave.supportDocument || leave.document} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition-colors text-sm w-max"
                >
                  📄 View Attached Document
                </a>
              </div>
            )}
          </div>

          {Object.keys(parsedSubs).length > 0 && (
            <div className="mt-2 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Daily Schedule</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(parsedSubs).map(([date, periods]) => (
                  <div key={date} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="bg-blue-50 px-3 py-2 font-bold text-sm text-blue-800 border-b border-gray-200">
                      {date}
                    </div>
                    {Object.keys(periods).length > 0 ? (
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-white border-b border-gray-200 text-gray-500">
                            <th className="px-3 py-2 font-medium w-1/3">Hour</th>
                            <th className="px-3 py-2 font-medium">Substitute Teacher</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(periods).map(([hour, staffId]) => (
                            <tr key={hour} className="border-b border-gray-100 bg-white last:border-0">
                              <td className="px-3 py-2 font-semibold text-gray-700">{hour}</td>
                              <td className="px-3 py-2 text-gray-700">{getStaffName(staffId)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500 bg-white">No classes scheduled.</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMENTS AUDIT TRAIL */}
          {leave?.comments && Array.isArray(leave.comments) && leave.comments.length > 0 && (
            <div className="mt-2 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Comments:</h3>
              <div className="flex flex-col gap-3">
                {leave.comments.map((c, index) => {
                  const actionColor = c.action === 'Approved' ? 'text-green-600' : 'text-red-600';
                  return (
                    <div key={index} className="bg-white p-3 rounded-md text-sm border border-gray-100 shadow-sm">
                      <p className="text-gray-800 m-0 mb-1">
                        <strong>{c.role}:</strong> <span className={`font-semibold ${actionColor}`}>{c.action}</span>
                      </p>
                      {c.commentText && c.commentText.trim() !== "" && (
                        <p className="text-gray-800 m-0 mb-1">"{c.commentText}"</p>
                      )}
                      <p className="text-xs text-gray-400 m-0">
                        On {new Date(c.timestamp).toLocaleDateString('en-GB')} at {new Date(c.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* EDIT BUTTON FOR STAFF ONLY */}
        {!canApproveReject && leave.status === "Awaiting HOD Approval" && onEditLeave && (
          <div className="mt-5 border-t border-gray-200 pt-4 flex justify-end">
            <button
              onClick={() => onEditLeave(leave)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full font-semibold"
              disabled={isProcessing}
            >
              Edit Leave Request
            </button>
          </div>
        )}

        {/* APPROVE/REJECT BUTTONS */}
        {["Pending", "Awaiting HOD Approval", "Awaiting Principal Approval"].includes(leave.status) && canApproveReject && (
          <div className="mt-5 border-t border-gray-200 pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Add a Comment (Optional):
            </label>
            <textarea
              placeholder="Type your comment or reason here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              rows="2"
              disabled={isProcessing}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleApproveClick}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                disabled={isProcessing}
              >
                Approve
              </button>
              <button
                onClick={handleRejectClick}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                disabled={isProcessing}
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Rejection Confirmation Pop-up */}
        {showRejectionConfirmation && (
          <ConfirmationModal
            isOpen={showRejectionConfirmation}
            text1="Reject Leave Request"
            text2={
              <div className="flex flex-col gap-2">
                <p>Are you sure you want to reject this leave request?</p>
                <textarea
                  placeholder="Reason for rejection (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  disabled={isProcessing}
                />
              </div>
            }
            btn1Text="Cancel"
            btn2Text="Confirm Reject"
            btn1Handler={handleCancelRejectConfirmation}
            btn2Handler={handleConfirmReject}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default LeaveDetailsModal;