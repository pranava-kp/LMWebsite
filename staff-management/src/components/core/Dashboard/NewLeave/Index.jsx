import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import rnsLogo from "../../../../assets/images/rns-logo.webp";
import { createLeave } from "../../../../services/operations/leaveAPI";
import { axiosInstance } from "../../../../services/apiConnector";

const NewLeave = () => {
    const [substituteTeachers, setSubstituteTeachers] = useState({});
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: "",
        body: "",
        startDate: "",
        endDate: "",
        category: "",
        otherCategory: "",
    });

    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [startDateObj, setStartDateObj] = useState(null);
    const [endDateObj, setEndDateObj] = useState(null);

    // New states for staff fetching and dropdown
    const [staffList, setStaffList] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const getYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    };

    const formatForApi = (dateObj) => {
        if (!dateObj) return "";
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Fetch Staff List
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch("http://localhost:2000/api/v1/getuserdept", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();

                // Correctly path to the array based on the backend response structure
                if (responseData?.success && responseData?.data?.users) {
                    setStaffList(responseData.data.users);
                } else {
                    setStaffList([]);
                }
            } catch (error) {
                console.error("Failed to fetch staff list:", error);
                setStaffList([]);
            }
        };

        if (token) {
            fetchStaff();
        }
    }, [token]);

    useEffect(() => {
        if (startDateObj && endDateObj && startDateObj <= endDateObj) {
            const dates = [];
            let curr = new Date(startDateObj);
            const end = new Date(endDateObj);
            while (curr <= end) {
                if (curr.getDay() !== 0) {
                    dates.push(formatForApi(curr));
                }
                curr.setDate(curr.getDate() + 1);
            }

            setSubstituteTeachers((prev) => {
                const newState = {};
                dates.forEach((dateStr) => {
                    newState[dateStr] = prev[dateStr] || { hasClass: null, periods: [] };
                });
                return newState;
            });
        } else {
            setSubstituteTeachers({});
        }
    }, [startDateObj, endDateObj]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClassRadio = (dateStr, value) => {
        setSubstituteTeachers((prev) => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                hasClass: value,
                periods: value === "yes" && prev[dateStr].periods.length === 0
                    ? [{ hour: "", substitute: "" }]
                    : prev[dateStr].periods
            }
        }));
    };

    const handleAddPeriod = (dateStr) => {
        setSubstituteTeachers((prev) => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                periods: [...prev[dateStr].periods, { hour: "", substitute: "" }]
            }
        }));
    };

    const handlePeriodChange = (dateStr, index, field, value) => {
        setSubstituteTeachers((prev) => {
            const updatedPeriods = [...prev[dateStr].periods];
            updatedPeriods[index][field] = value;
            return {
                ...prev,
                [dateStr]: {
                    ...prev[dateStr],
                    periods: updatedPeriods
                }
            };
        });
    };

    const handleRemovePeriod = (dateStr, index) => {
        setSubstituteTeachers((prev) => {
            const updatedPeriods = prev[dateStr].periods.filter((_, i) => i !== index);
            return {
                ...prev,
                [dateStr]: {
                    ...prev[dateStr],
                    periods: updatedPeriods
                }
            };
        });
    };

    const formatStaffName = (staff) => {
        const firstName = staff?.firstName || "";
        const lastName = staff?.lastName || "";
        const department = staff?.department?.departmentName || staff?.department || "No Dept";
        return `${firstName} ${lastName} (${department})`.trim();
    };

    // Validation logic for the Submit button
    const isFormValid = () => {
        if (!formData.subject.trim()) return false;
        if (!formData.body.trim()) return false;
        if (!startDateObj || !endDateObj) return false;
        if (!formData.category) return false;
        if (formData.category === "Others" && !formData.otherCategory.trim()) return false;

        const dates = Object.keys(substituteTeachers);
        if (dates.length === 0 && startDateObj && endDateObj) return false;

        for (let i = 0; i < dates.length; i++) {
            const dateStr = dates[i];
            const dayData = substituteTeachers[dateStr];

            if (dayData.hasClass === null) return false;

            if (dayData.hasClass === "yes") {
                if (dayData.periods.length === 0) return false;
                for (let j = 0; j < dayData.periods.length; j++) {
                    const period = dayData.periods[j];
                    if (!period.hour.trim() || !period.substitute.trim()) return false;
                }
            }
        }
        return true;
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) return; // Extra protection

        const { subject, body, category, otherCategory } = formData;

        const apiStartDate = formatForApi(startDateObj);
        const apiEndDate = formatForApi(endDateObj);

        setLoading(true);
        try {
            const result = await dispatch(
                createLeave(
                    subject,
                    body,
                    apiStartDate,
                    apiEndDate,
                    category === "Others" ? otherCategory : category,
                    substituteTeachers,
                    token,
                    attachments
                )
            );

            console.log("createLeave result:", result);

            if (result?.success) {
                navigate("/dashboard/staff");
            }

        } catch (e) {
            console.log("Error in creating leave: ", e);
        }
        setLoading(false);
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const form = new FormData();
                form.append("Imagefile", file);

                const res = await axiosInstance.post("/imageUpload", form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (res?.data?.success) {
                    const fileData = res.data.data;
                    setAttachments((prev) => [
                        ...prev,
                        { url: fileData.url, name: file.name, publicId: fileData.publicId || null },
                    ]);
                } else {
                    console.error("Upload failed:", res?.data?.message);
                }
            }
        } catch (err) {
            console.error("File upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        handleFileUpload(files);
    };

    const removeAttachment = (idx) => {
        setAttachments((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <img src={rnsLogo} alt="Logo" className="w-12" />
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600">
                            Leave Application
                        </h1>
                        <p className="text-sm text-gray-500">
                            Submit a new leave request
                        </p>
                    </div>
                </div>

                <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
                    {/* SUBJECT */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 uppercase">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleOnChange}
                            placeholder="Enter subject"
                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 outline-none"
                            required
                        />
                    </div>

                    {/* REASON */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 uppercase">
                            Detailed Reason *
                        </label>
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleOnChange}
                            rows="5"
                            placeholder="Explain your leave reason"
                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 outline-none"
                            required
                        />
                    </div>

                    {/* DATE + TYPE */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-semibold uppercase mb-2 block">
                                From *
                            </label>
                            <DatePicker
                                selected={startDateObj}
                                onChange={(date) => {
                                    setStartDateObj(date);
                                    setFormData((prev) => ({
                                        ...prev,
                                        startDate: formatForApi(date)
                                    }));
                                    if (date && (!endDateObj || date > endDateObj)) {
                                        setEndDateObj(date);
                                        setFormData((prev) => ({
                                            ...prev,
                                            endDate: formatForApi(date)
                                        }));
                                    }
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                minDate={getYesterday()}
                                className="w-full border rounded-xl px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold uppercase mb-2 block">
                                To *
                            </label>
                            <DatePicker
                                selected={endDateObj}
                                onChange={(date) => {
                                    setEndDateObj(date);
                                    setFormData((prev) => ({
                                        ...prev,
                                        endDate: formatForApi(date)
                                    }));
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                minDate={startDateObj || getYesterday()}
                                className="w-full border rounded-xl px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold uppercase mb-2 block">
                                Leave Type *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleOnChange}
                                className="w-full border rounded-xl px-3 py-2"
                                required
                            >
                                <option value="">Select Leave</option>
                                <option value="Emergency Leave">Emergency Leave</option>
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Others">Others</option>
                            </select>

                            {formData.category === "Others" && (
                                <input
                                    type="text"
                                    name="otherCategory"
                                    value={formData.otherCategory}
                                    onChange={handleOnChange}
                                    placeholder="Specify leave type"
                                    className="w-full border rounded-xl px-3 py-2 mt-2"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {/* DAILY SCHEDULE */}
                    {Object.keys(substituteTeachers).length > 0 && (
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-4">Daily Schedule</h2>
                            {Object.keys(substituteTeachers).map((dateStr) => (
                                <div key={dateStr} className="bg-gray-50 border rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-6 mb-3">
                                        <span className="font-semibold text-gray-700">{dateStr}</span>
                                        <span className="text-sm">Do you have class?</span>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    checked={substituteTeachers[dateStr].hasClass === "yes"}
                                                    onChange={() => handleClassRadio(dateStr, "yes")}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    checked={substituteTeachers[dateStr].hasClass === "no"}
                                                    onChange={() => handleClassRadio(dateStr, "no")}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {substituteTeachers[dateStr].hasClass === "yes" && (
                                        <div className="flex flex-col gap-3 ml-2">
                                            {substituteTeachers[dateStr].periods.map((period, idx) => (
                                                <div key={idx} className="flex gap-3 relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Hour"
                                                        className="border rounded px-3 py-2 w-1/3"
                                                        value={period.hour}
                                                        onChange={(e) => handlePeriodChange(dateStr, idx, "hour", e.target.value)}
                                                        required
                                                    />
                                                    <div className="relative w-2/3">
                                                        <input
                                                            type="text"
                                                            placeholder="Substitute Teacher"
                                                            className="border rounded px-3 py-2 w-full"
                                                            value={period.substitute}
                                                            onChange={(e) => {
                                                                handlePeriodChange(dateStr, idx, "substitute", e.target.value);
                                                                setActiveDropdown(`${dateStr}-${idx}`);
                                                            }}
                                                            onFocus={() => setActiveDropdown(`${dateStr}-${idx}`)}
                                                            onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                                                            required
                                                        />
                                                        {activeDropdown === `${dateStr}-${idx}` && period.substitute.length > 0 && (
                                                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
                                                                {staffList
                                                                    .map(formatStaffName)
                                                                    .filter(name => name.toLowerCase().includes(period.substitute.toLowerCase()))
                                                                    .map((formattedName, sIdx) => (
                                                                        <div
                                                                            key={sIdx}
                                                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                handlePeriodChange(dateStr, idx, "substitute", formattedName);
                                                                                setActiveDropdown(null);
                                                                            }}
                                                                        >
                                                                            {formattedName}
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handleAddPeriod(dateStr)}
                                                className="bg-gray-200 px-3 py-1 rounded text-sm w-max"
                                            >
                                                + Add Another Class
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FILE UPLOAD */}
                    <div className="flex flex-col gap-2 border-t pt-4">
                        <label className="text-sm font-semibold uppercase">Supporting Documents (Optional)</label>
                        <p className="text-sm text-gray-500">Upload medical certificates or other documents</p>
                        <label className="border-2 border-dashed border-blue-400 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition">
                            <div className="text-blue-500 text-4xl">⬆</div>
                            <p className="text-blue-600 font-semibold">Click to upload <span className="text-gray-500 font-normal"> or drag and drop</span></p>
                            <input type="file" multiple onChange={handleFileInput} className="hidden" />
                        </label>
                        {uploading && <div className="text-sm text-gray-600">Uploading...</div>}
                        <ul className="mt-2 space-y-2">
                            {attachments.map((att, idx) => (
                                <li key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                                    <span className="text-sm truncate">{att.name}</span>
                                    <button type="button" onClick={() => removeAttachment(idx)} className="text-xs text-red-500 font-semibold">Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            className={`px-8 py-3 rounded-xl text-white font-semibold ${
                                !isFormValid() || loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={!isFormValid() || loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLeave;