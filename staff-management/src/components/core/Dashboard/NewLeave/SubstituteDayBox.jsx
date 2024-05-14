import React, { useState } from "react";
import SubstituteTeacherBox from "./SubstituteTeacherBox";

const SubstituteDayBox = ({ day, token }) => {
    const [periods, setPeriods] = useState(1);
    const increasePeriods = (e) => {
        e.preventDefault();
        setPeriods(periods + 1);
    };
    return (
        <div className="flex flex-col my-4 gap-4 w-full">
            <div className="flex justify-between">
                <h2>Day {day}</h2>
                <button onClick={increasePeriods}>+</button>
            </div>
            {Array.from({ length: periods }).map((_, i) => (
                <SubstituteTeacherBox key={i} index={i} token={token} />
            ))}
        </div>
    );
};

export default SubstituteDayBox;
