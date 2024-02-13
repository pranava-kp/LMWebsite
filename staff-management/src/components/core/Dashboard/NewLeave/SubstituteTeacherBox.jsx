import React, {useState} from "react";
import { FaSearch } from "react-icons/fa";
import { getAllUsers } from "../../../../services/operations/commonAPI";
import SearchResultsList from "./SearchResultsList";

const SubstituteTeacherBox = ({token}) => {

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

    return (
        <div className="flex flex-col gap-4 mt-4">
            <label
                htmlFor="substituteTeacher"
                className=" text-sm font-semibold uppercase"
            >
                Substitute Teacher
                <sup className=" text-pink-500">*</sup>
            </label>
            <div className="flex gap-2 items-center bg-white p-2 rounded-md">
                <FaSearch className=" text-rnsit-blue" />
                <input
                    type="text"
                    name="substituteTeacher"
                    id="substituteTeacher"
                    placeholder="Enter Name"
                    className=" bg-white outline-none"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <SearchResultsList results={results} />
        </div>
    );
};

export default SubstituteTeacherBox;
