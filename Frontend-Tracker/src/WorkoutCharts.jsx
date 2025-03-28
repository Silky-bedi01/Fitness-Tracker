import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import "./WorkoutCharts.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function WorkoutCharts({ headers, userId, start, end, timeFrame, data }) {
    const [chartData, setChartData] = useState({ calories: null, steps: null, time: null, exerciseType: null });
    const [activeChart, setActiveChart] = useState("calories");
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        calculateStreak();
    }, []);

    useEffect(() => {
        if (data) { processChartData(data); }
    }, [data, timeFrame]);


    const exerciseColors = {
        RUNNING: "#FF5733",
        WALKING: "#4CAF50",
        CYCLING: "#3498DB",
        SWIMMING: "#9B59B6",
        YOGA: "#F4D03F",
        WEIGHT_TRAINING: "#E74C3C",
        CARDIO: "#1ABC9C",
        HIIT: "#2E86C1",
        PILATES: "#A569BD",
        DANCE: "#E67E22",
        JUMP_ROPE: "#16A085",
        ROWING: "#5DADE2",
        MARTIAL_ARTS: "#E74C3C",
        HIKING: "#6E2C00",
        STRENGTH_TRAINING: "#8E44AD",
        CROSSFIT: "#F39C12",
    };

    // Process workout data for charts
    function processChartData(workouts) {

        const labels = generateLabels();
        const initialData = labels.reduce((acc, label) => {
            acc[label] = { calories: 0, steps: 0, time: 0 };
            return acc;
        }, {});
        function getMatchingLabel(date) {
            const parsedDate = date instanceof Date ? date : new Date(date);

            if (isNaN(parsedDate)) {
                console.error("Invalid date:", date);
                return "";
            }

            if (timeFrame === "week") return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][parsedDate.getDay()];
            if (timeFrame === "month") return String(parsedDate.getDate());
            if (timeFrame === "year") return parsedDate.toLocaleString("en-US", { month: "short" });
            return "";
        }

        // Aggregate workout data
        workouts.forEach((workout) => {
            const label = getMatchingLabel(workout.timestamp);
            console.log("Workout Date:", workout.timestamp, "-> Label:", label);

            if (initialData[label]) {
                initialData[label].calories += workout.caloriesBurned || 0;
                initialData[label].steps += workout.stepsCount || 0;
                initialData[label].time += workout.duration || 0;
            }
        });

        // Process exercise type for pie chart
        const exerciseTypeData = {};
        workouts.forEach((workout) => {
            const type = workout.exerciseType || "Unknown";
            exerciseTypeData[type] = (exerciseTypeData[type] || 0) + 1;
        });

        console.log("Processed Chart Data:", initialData);
        console.log("Exercise Type Data:", exerciseTypeData);
        { workouts.length && calculateStreak(workouts); }
        console.log("Streak : ", streak);
        setChartData({
            calories: createChartData(labels, initialData, "calories", "Calories Burned", "rgba(255,99,132,1)"),
            steps: createChartData(labels, initialData, "steps", "Steps Count", "rgba(54,162,235,1)"),
            time: createChartData(labels, initialData, "time", "Time Tracked (min)", "rgba(75,192,192,1)"),
            exerciseType: createPieChartData(exerciseTypeData),
        });

    }

    // Generate labels for the X-axis
    function generateLabels() {
        if (timeFrame === "week") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        if (timeFrame === "month") {
            const year = start.getFullYear();
            const daysInMonth = new Date(year, start.getMonth() + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        }

        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }




    // Create Line chart data
    function createChartData(labels, data, key, label, color) {
        return {
            labels,
            datasets: [
                {
                    label,
                    data: labels.map((label) => Math.max(0, data[label]?.[key] || 0)), // Ensure non-negative values
                    borderColor: color,
                    backgroundColor: color.replace("1)", "0.2)"),
                    tension: 0.4,
                },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        ticks: {
                            callback: (value) => value >= 0 ? value : '',
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            }
        };
    }

    // Create Pie chart data
    function createPieChartData(exerciseTypeData) {
        const labels = Object.keys(exerciseTypeData);
        const data = labels.map((label) => exerciseTypeData[label]);
        const colors = labels.map((label) => exerciseColors[label] || '#CCCCCC'); // Use dynamic colors

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors,
                    borderColor: "#fff",
                    borderWidth: 1,
                },
            ],
        };
    }
    const optionsPie = {
        responsive: true,
        maintainAspectRatio: true, // Ensure it fits the container height
        plugins: {
          legend: {
            position: 'right', // Move legend to the right
          },
        },
      };
      


    function calculateStreak() {
        fetch("http://localhost:8080/api/workout/streak", {
            method: "GET",
            headers,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setStreak(data);
            })
            .catch((error) => console.error("Error fetching workout data:", error));
    }




    return (
        <div className="chart-container">
            <h3>Workout</h3>

            <div className="horizontal">
                <div className="chart-nav">
                    <button
                        className={activeChart === "calories" ? "active-btn" : ""}
                        onClick={() => setActiveChart("calories")}
                    >Calories Burned</button>
                    <button
                        className={activeChart === "steps" ? "active-btn" : ""}
                        onClick={() => setActiveChart("steps")}
                    >Steps Count</button>
                    <button
                        className={activeChart === "time" ? "active-btn" : ""}
                        onClick={() => setActiveChart("time")}
                    >Workout Duration</button>
                    <div className="streak-container" id={(streak == 0) ? "frozen" : "fire"}>
                        {(streak == 0) ?
                            <span className="snowflake-emoji">❄️</span> :
                            <span className="fire-emoji">🔥</span>}
                        <div className={(streak == 0) ? "frozen" : "fire"}>{streak} Day Streak</div>
                    </div>


                </div>
                <div className="charts">
                    {chartData[activeChart] && <Line className="line" data={chartData[activeChart]} />}
                    <div className="space"></div>
                    {/* Exercise Type Pie Chart */}
                    <div className="pie">
                        {chartData.exerciseType && chartData.exerciseType.datasets[0].data.length > 0 ? (
                        <Pie data={chartData.exerciseType}  options={optionsPie}/>
                    ) : (
                        <div className="empty-message">No workout data available.</div>
                    )}</div>
                </div>
            </div>
        </div>
    );

}
