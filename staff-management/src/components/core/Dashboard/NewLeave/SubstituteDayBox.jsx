import React, { useState } from "react";
import SubstituteTeacherBox from "./SubstituteTeacherBox";

const SubstituteDayBox = ({ day, token }) => {
    const [periods, setPeriods] = useState(1);
    const increasePeriods = (e) => {
        e.preventDefault();
        setPeriods(periods + 1);
    };

    const [teachersArray, setTeachersArray] = useState(Array.from({ length: periods }));
    const updateTeacher = (index, newValue) => {
        // Create a new array with the updated value
        const updatedArray = [...teachersArray];
        updatedArray[index] = newValue;
        setTeachersArray(updatedArray);
    };


    return (
        <div className="flex flex-col my-4 gap-4 w-full">
            <div className="flex justify-between">
                <h2>Day {day}</h2>
                <button onClick={increasePeriods}>+</button>
            </div>
            {periodsArray.map((teacherName, i) => (
                <SubstituteTeacherBox key={i} index={i} token={token} value={teacherName} updateTeacher={updateTeacher} />
            ))}
        </div>
    );
};

export default SubstituteDayBox;
