import "./workout.css";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRunning, FaWalking, FaBiking, FaSwimmer, FaDumbbell, FaHeartbeat, FaMusic, FaShip, FaHandRock, FaWeightHanging, FaTrash } from "react-icons/fa";
import { GiMeditation, GiJumpingRope, GiBoxingGlove, GiMountains } from "react-icons/gi";

import { TbYoga } from "react-icons/tb";
import { MdWhatshot } from "react-icons/md";
export default function Workout({ headers, userId }) {
    const [exerciseType, setExerciseType] = useState("");
    const [duration, setDuration] = useState("");
    const [intensity, setIntensity] = useState("Low");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weightLifted, setWeightLifted] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [stepsCount, setStepsCount] = useState("");
    const [notes, setNotes] = useState("");
    const [time, setTime] = useState(getCurrentTime());
    const [date, setDate] = useState(getCurrentDate());
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [viewAll, setViewAll] = useState(true);

    const today = new Date().toISOString().split("T")[0];
    const exercisesWithWeights = ["Weight Training", "Strength Training", "CrossFit", "HIIT", "Martial Arts"];
    const exercisesWithSteps = ["Walking", "Running", "Hiking"];

    const workoutIcons = {
        RUNNING: <FaRunning className="workout-icon" />,
        WALKING: <FaWalking className="workout-icon" />,
        CYCLING: <FaBiking className="workout-icon" />,
        SWIMMING: <FaSwimmer className="workout-icon" />,
        YOGA: <GiMeditation className="workout-icon" />,
        WEIGHT_TRAINING: <FaDumbbell className="workout-icon" />,
        CARDIO: <FaHeartbeat className="workout-icon" />,
        HIIT: <MdWhatshot className="workout-icon" />,
        PILATES: <TbYoga className="workout-icon" />,
        DANCE: <FaMusic className="workout-icon" />,
        JUMP_ROPE: <GiJumpingRope className="workout-icon" />,
        ROWING: <FaShip className="workout-icon" />,
        MARTIAL_ARTS: <GiBoxingGlove className="workout-icon" />,
        HIKING: <GiMountains className="workout-icon" />,
        STRENGTH_TRAINING: <FaHandRock className="workout-icon" />,
        CROSSFIT: <FaWeightHanging className="workout-icon" />
    };

    useEffect(() => {
        fetchWorkoutHistory();
    }, [viewAll, date]);
    useEffect(() => {
        console.log("fetch types")
        fetchWorkoutTypes();
    }, []);

    function fetchWorkoutTypes() {
        fetch("http://localhost:8080/api/workout/types")
            .then((res) => res.json())
            .then((data) => setWorkoutTypes(data.map(type => type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))))
            .catch((err) => console.error("Error fetching workout types", err));
        console.log(workoutTypes)
    }


    function fetchWorkoutHistory() {
        if (viewAll) {
            fetch("http://localhost:8080/api/workout/all_history", {
                method: "GET",
                headers
            })
                .then((res) => res.json())
                .then((data) => {
                    {
                        if (Array.isArray(data)) {
                            setWorkoutHistory([...data.reverse()]);
                        } else {
                            console.error("Unexpected response format:", data);
                            setWorkoutHistory([]);
                        }
                    }
                })
                .catch((error) => console.error("Error fetching all workout history:", error));
        } else {
            fetch(`http://localhost:8080/api/workout/history?userId=${userId}&startDate=${date}T00:00:00&endDate=${date}T23:59:59`, {
                method: "GET",
                headers
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setWorkoutHistory([...data.reverse()]);
                    } else {
                        console.error("Unexpected response format:", data);
                        setWorkoutHistory([]);
                    }
                })
                .catch((err) => console.error("Error fetching workout history", err));
        }
    }



    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function getCurrentDate() {
        return new Date().toISOString().split("T")[0];
    }

    function formatTimestamp(date, time) {
        const now = new Date();

        const formattedTime = time ? time : now.toLocaleTimeString([], { hour12: false });

        const dateTimeString = `${date}T${formattedTime}:00.000000`;

        return dateTimeString;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const workoutData = {
            user: { id: userId },
            exerciseType: exerciseType.toUpperCase().replace(/ /g, '_'),
            duration,
            intensity,
            stepsCount,
            sets,
            reps,
            weightLifted,
            notes,
            timestamp: formatTimestamp(date, time)
        };

        fetch("http://localhost:8080/api/workout/log", {
            method: "POST",
            headers,
            body: JSON.stringify(workoutData),
        })
            .then((res) => res.json())
            .then((newWorkout) => {
                setWorkoutHistory(prevHistory => Array.isArray(prevHistory) ? [newWorkout, ...prevHistory] : [newWorkout]);
                setCaloriesBurned(newWorkout.caloriesBurned);
                setStepsCount(newWorkout.stepsCount);

                setExerciseType('')
                setDuration('')
                setIntensity('Low')
                setSets('')
                setReps('')
                setCaloriesBurned('')
                setWeightLifted('')
                setNotes('')
                setTime(getCurrentTime())
            })
            .catch((err) => toast.error("Error logging workout", err));
    }

    function handleDeleteWorkout(id) {
        console.log(id)
        fetch(`http://localhost:8080/api/workout/${id}`, {
            method: "DELETE",
            headers
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(err => { throw new Error(err); });
                }
                return response.text();
            })
            .then(message => {
                toast.success(message || "Workout deleted successfully!");
                fetchWorkoutHistory(date);
            })
            .catch(error => {
                toast.error(error.message || "Error deleting workout");
            });
    };

    const prevDate = (currentDate, change) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + change);
        return newDate.toISOString().split("T")[0];
    };
    return (
        <div className="main-container">
            <h2 className="title">Track your Workout</h2>

            <div className="container" >
                <div className="workout-form">
                    <h2>Log Your Workout</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Exercise Type *</label>
                        <select
                            value={exerciseType}
                            onChange={(e) => setExerciseType(e.target.value)}
                            required
                            className="dropdown">
                            <option value="" disabled>Select Exercise Type</option>
                            {workoutTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="row1">
                            <div className="input-group">
                                <label>Duration * (minutes)</label>
                                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                            </div>

                            <div className="input-group">
                                <label>Intensity</label>
                                <div className="intensity-options">
                                    {["Low", "Medium", "High"].map((level) => (
                                        <label key={level} className="intensity-label">
                                            <input type="radio" name="intensity" value={level} checked={intensity === level} onChange={() => setIntensity(level)} />
                                            {level}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row1">
                            <div className="input-group">
                                <label>Date</label>
                                <input type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Time</label>
                                <input type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {exercisesWithWeights.includes(exerciseType) && (
                            <>
                                <div className="row1">
                                    <div className="input-group">
                                        <label>Sets</label>
                                        <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Reps</label>
                                        <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
                                    </div>
                                </div>
                                <label>Weight Lifted (kg)</label>
                                <input type="number" value={weightLifted} onChange={(e) => setWeightLifted(e.target.value)} />
                            </>
                        )}
                        {exercisesWithSteps.includes(exerciseType) && (
                            <>
                                <label>Steps Count</label>
                                <input type="number" value={stepsCount} onChange={(e) => setStepsCount(e.target.value)} />
                            </>
                        )}

                        <label>Calories Burned</label>
                        <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} />

                        <label>Notes</label>
                        <textarea placeholder="Additional notes about your workout" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>

                        <button type="submit" className="add-workout-btn">Add Workout</button>
                    </form>
                </div>

                <div className="workout-history" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <div className="row">

                        <h2>Workout History</h2>
                        <div className="toggle-container">
                            <span className={!viewAll ? "active" : ""}>Day-wise</span>
                            <div className="toggle-switch" onClick={() => setViewAll(!viewAll)}>
                                <div className={`toggle-slider ${viewAll ? "right" : "left"}`}></div>
                            </div>
                            <span className={viewAll ? "active" : ""}>All-time</span>
                        </div>
                    </div>

                    {!viewAll && (
                        <div className="date-picker-container">
                            <button className="nav-btn" onClick={() => setDate(prevDate(date, -1))}>&lt;</button>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                className="custom-date-picker"
                            />
                            <button className="nav-btn" onClick={() => setDate(prevDate(date, 1))} disabled={date === today}>&gt;</button>
                            {date !== today && (
                                <button className="today-btn" onClick={() => setDate(today)}>Go to Today</button>
                            )}
                        </div>
                    )}

                    {workoutHistory.length === 0 ? (
                        <p>No workout logged yet.</p>
                    ) : (<>{workoutHistory.map((workout) => (
                        <div className="w-item" key={workout.id}>
                            <div
                                className="workout-item"
                                data-notes={workout.notes || null}
                            >

                                <div className="workout-header">
                                    <h3>
                                        {workoutIcons[workout.exerciseType]}{" "}
                                        {workout.exerciseType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h3>
                                    <p className="workout-time-intensity">{workout.duration} mins</p>
                                    <p className="workout-time-intensity">
                                        {new Date(workout.timestamp).toDateString()}
                                    </p>
                                </div>

                                <div className="row">
                                    <div>
                                        {workout.sets && (
                                            <p className="workout-details">
                                                Sets: {workout.sets} | Reps: {workout.reps} | Weight: {workout.weightLifted} kg
                                            </p>
                                        )}
                                        {workout.stepsCount !== 0 && (
                                            <p className="workout-details">Steps: {workout.stepsCount}</p>
                                        )}
                                        <p className="workout-details">
                                            Calories Burned: {workout.caloriesBurned}
                                        </p>
                                    </div>

                                    <span className="workout-details" id="time">
                                        {new Date(workout.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true
                                        })}
                                    </span>
                                </div>
                            </div>
                            <FaTrash
                                className="delete-icon"
                                onClick={() => handleDeleteWorkout(workout.id)}
                            />
                        </div>
                    ))}</>)}

                </div>

                <ToastContainer />
            </div>
        </div>
    );
}
