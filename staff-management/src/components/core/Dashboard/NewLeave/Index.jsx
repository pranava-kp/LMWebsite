import React, { useState } from "react";
import rnsLogo from "../../../../assets/images/rns-logo.webp";

const NewLeave = () => {
    return (
        <div className="flex flex-col border p-5 bg-gray-100 gap-8 w-full rounded-md">
            <div className="flex justify-between text-3xl font-semibold">
                <img src={rnsLogo} alt="" className=" self-start w-10" />
                Leave Application
                <div></div>
            </div>
            <form className=" flex flex-col gap-4">
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
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="leaveType"
                            className=" text-sm font-semibold uppercase"
                        >
                            Leave Type<sup className=" text-pink-500">*</sup>:{" "}
                        </label>
                        <select
                            name="leaveType"
                            id="leaveType"
                            className=" border border-gray-200 px-2 py-1"
                        >
                            <option disabled>Select Leave Type</option>
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
