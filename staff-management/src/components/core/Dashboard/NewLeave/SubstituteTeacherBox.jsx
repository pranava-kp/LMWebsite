import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getAllUsers } from "../../../../services/operations/commonAPI";
import SearchResultsList from "./SearchResultsList";
import { FaRegEdit } from "react-icons/fa";

const SubstituteTeacherBox = ({
    token,
    substituteTeachers,
    setSubstituteTeachers,
    index,
    value,
    updateTeacher
}) => {
    const [results, setResults] = useState([]); // Search result of staff when searched for substitute teacher
    const handleSearch = async (searchQuery) => {
        // FETCH ALL USERS FROM THE DATABASE
        const allUsers = await getAllUsers(token);
        const searchResults = allUsers.data.users.filter((user) => {
            return (
                searchQuery &&
                (user.accountType.toLowerCase().includes("staff") ||
                    user.accountType.toLowerCase().includes("hod")) &&
                (user.firstName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    user.lastName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
            );
        });
        setResults(searchResults);
    };
    const onSelectSubstituteTeacher = (newSubstituteTeacher) => {
        updateTeacher(index, newSubstituteTeacher);
    };
    const editHandler = () => {
        setSubstituteTeachers((prevSubstituteTeachers) => {
            const newSubstituteTeachers = [...prevSubstituteTeachers];
            newSubstituteTeachers[index] = null;
            return newSubstituteTeachers;
        });
    }

    return (
        <div className="flex mt-4 gap-4">
            <div className="w-full">
                <div className="flex gap-2 items-center bg-white p-2 rounded-md">
                    <FaSearch className=" text-rnsit-blue" />
                    <input
                        type="text"
                        name="substituteTeacher"
                        id="substituteTeacher"
                        placeholder="Enter Name"
                        className=" bg-white outline-none w-full"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <SearchResultsList
                    results={results}
                    onSelectSubstituteTeacher={onSelectSubstituteTeacher}
                />
            </div>
            <div className="flex flex-col justify-center text-xl">
                <FaRegEdit onClick={editHandler} />
            </div>
        </div>
    );
};

export default SubstituteTeacherBox;
