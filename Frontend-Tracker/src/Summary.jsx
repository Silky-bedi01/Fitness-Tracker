import React, { useEffect, useState } from 'react';
import WorkoutCharts from './WorkoutCharts';
import CaloricCharts from './MealCharts';
import "./Summary.css";
export default function Summary({ headers, userId }) {

    const [timeFrame, setTimeFrame] = useState("week");
    const [start, setStart] = useState(getStartOfWeek());
    const [end, setEnd] = useState(getEndOfWeek());
    const [data,setData] = useState(null);

    const today = new Date().toISOString().split('T')[0];


    useEffect(() => {
        if (timeFrame === "week") {
            setStart(getStartOfWeek());
            setEnd(getEndOfWeek());
        } else if (timeFrame === "month") {
            setStart(getStartOfMonth());
            setEnd(getEndOfMonth());
        } else if (timeFrame === "year") {
            setStart(getStartOfYear());
            setEnd(getEndOfYear());
        }
    }, [timeFrame]);

    useEffect(() => {
        if (start && end) fetchWorkoutData();
        console.log("data "+data);
    }, [start, end, timeFrame]);

    // Fetch workout data from API
    function fetchWorkoutData() {
        const startDate = formatDateForApi(start)+"T00:00:00";
        const endDate = formatDateForApi(end)+"T23:59:59";

        fetch(`http://localhost:8080/api/progress/data?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response: ", data);
                setData(data);
            })
            .catch((error) => console.error("Error fetching workout data:", error));
    }
    function formatDateForApi(date) {
        return date.toISOString().split("T")[0];
    }

    // Navigate to previous range
    function handlePrev() {
        if (timeFrame === "week") {
            setStart((prev) => new Date(prev.setDate(prev.getDate() - 7)));
            setEnd((prev) => new Date(prev.setDate(prev.getDate() - 7)));
        } else if (timeFrame === "month") {
            const newMonth = new Date(start);
            newMonth.setMonth(newMonth.getMonth() - 1);
            setStart(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
            setEnd(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0));
        } else if (timeFrame === "year") {
            const newYear = start.getFullYear() - 1;
            setStart(new Date(newYear, 0, 1));
            setEnd(new Date(newYear, 11, 31));
        }
    }

    // Navigate to next range
    function handleNext() {
        if (timeFrame === "week") {
            setStart((prev) => new Date(prev.setDate(prev.getDate() + 7)));
            setEnd((prev) => new Date(prev.setDate(prev.getDate() + 7)));
        } else if (timeFrame === "month") {
            const newMonth = new Date(start);
            newMonth.setMonth(newMonth.getMonth() + 1);
            setStart(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
            setEnd(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0));
        } else if (timeFrame === "year") {
            const newYear = start.getFullYear() + 1;
            setStart(new Date(newYear, 0, 1));
            setEnd(new Date(newYear, 11, 31));
        }
    }

    // Format the date range display
    function getRangeLabel() {
        const options = { month: "long", day: "numeric" };

        if (timeFrame === "week") {
            return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
        }
        if (timeFrame === "month") {
            return `${start.toLocaleString("en-US", { month: "long" })}`;
        }
        if (timeFrame === "year") {
            return `${start.getFullYear()}`;
        }
    }
    // Get start of the current week (Monday)
    function getStartOfWeek() {
        const today = new Date();
        const day = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
        return monday;
    }

    // Get end of the current week (Sunday)
    function getEndOfWeek() {
        const monday = getStartOfWeek();
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return sunday;
    }

    // Get start and end of the current month
    function getStartOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    function getEndOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get start and end of the current year
    function getStartOfYear() {
        const now = new Date();
        return new Date(now.getFullYear(), 0, 1);
    }

    function getEndOfYear() {
        const now = new Date();
        return new Date(now.getFullYear(), 11, 31);
    }

    return (
        <div className="main-container">
            <div className='flex'>

                <h2 className="title">Analysis</h2>
                <div className="date-navigation">
                    <div className="date-controls">
                        <button onClick={handlePrev}>←</button>
                        <span>{getRangeLabel()}</span>
                        <button onClick={handleNext} disabled={end.toISOString().split('T')[0] >= today}>→</button>
                    </div>
                    <div className="btn-navigation">

                        <button onClick={() => setTimeFrame("week")}>By Week</button>
                        <button onClick={() => setTimeFrame("month")}>By Month</button>
                        <button onClick={() => setTimeFrame("year")}>By Year</button>

                    </div>

                </div>
            </div>
            <div className="container" >
                <WorkoutCharts headers={headers} userId={userId} start={start} end={end} timeFrame={timeFrame} data={(data)?data.workoutHistory : []}/>
                <CaloricCharts headers={headers} userId={userId} start={start} end={end} timeFrame={timeFrame} data={(data)?data.mealHistory:[]} dataw={(data)?data.workoutHistory :[]}/>
            </div>
        </div>
    )
}