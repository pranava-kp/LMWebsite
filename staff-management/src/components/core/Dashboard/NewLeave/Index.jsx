import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import rnsLogo from "../../../../assets/images/rns-logo.webp";
import { createLeave } from "../../../../services/operations/leaveAPI";
import toast from "react-hot-toast";

const NewLeave = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        subject: "",
        body: "",
        startDate: null,
        endDate: null,
        category: "",
    });

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };
    const { subject, body, startDate, endDate, category } = formData;
    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log("form data:", formData);
        setLoading(true);
        try{
            dispatch(createLeave(category, subject, body, startDate, endDate, token))
        }
        catch(e){
            console.log("Error in creating leave: ", e)
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col border p-5 bg-gray-100 gap-8 w-full rounded-md">
            <div className="flex justify-between text-3xl font-semibold">
                <img src={rnsLogo} alt="" className=" self-start w-10" />
                Leave Application
                <div></div>
            </div>
            <form onSubmit={handleOnSubmit} className=" flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="subject"
                        className=" text-sm font-semibold uppercase"
                    >
                        Subject<sup className=" text-pink-500"> *</sup>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Enter Subject"
                        className=" bg-white px-4 py-2 rounded"
                        onChange={handleOnChange}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="body"
                        className=" text-sm font-semibold uppercase"
                    >
                        Message<sup className=" text-pink-500"> *</sup>
                    </label>
                    <textarea
                    onChange={handleOnChange}
                        name="body"
                        id="body"
                        cols="40"
                        rows="10"
                        placeholder="Enter Message"
                        className=" bg-white px-4 py-2 rounded"
                    ></textarea>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex gap-20">
                        <div className="flex flex-col">
                            <label
                                htmlFor="startdate"
                                className=" text-sm font-semibold uppercase"
                            >
                                From<sup className=" text-pink-500">*</sup>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                className=" max-w-max bg-transparent border text-gray-600 text-sm border-gray-200"
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="endDate"
                                className=" text-sm font-semibold uppercase"
                            >
                                To<sup className=" text-pink-500">*</sup>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                className=" max-w-max bg-transparent border text-gray-600 text-sm border-gray-200 custom-inpt"
                                onChange={handleOnChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="category"
                            className=" text-sm font-semibold uppercase"
                        >
                            Leave Type<sup className=" text-pink-500">*</sup>:{" "}
                        </label>
                        <select
                            name="category"
                            id="category"
                            className=" border border-gray-200 px-2 py-1"
                            onChange={handleOnChange}
                            defaultValue={"Select Leave Type"}
                        >
                            <option disabled >Select Leave Type</option>
                            <option value="Emergency Leave">
                                Emergency Leave
                            </option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </div>
                <div className="mx-auto mt-4">
                    <button className="text-gray-100 font-semibold text-lg bg-rnsit-blue px-4 py-2 rounded-md">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewLeave;
