import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'
import './mealcharts.css'
export default function CaloricCharts({ headers, start, end, timeFrame, data, dataw }) {
    const [summedData, setSummedData] = useState({ calories: 0, carbs: 0, fats: 0, protein: 0 });

    const date = new Date(start);
    const multiplier = (timeFrame == "week") ? 7 :
        (timeFrame == "year") ? 365 :
            getDaysInMonth(date.getFullYear(), date.getMonth() + 1);

    const nutritionGoals = { calories: 2000, carbs: 200, fats: 70, protein: 100 };

    useEffect(() => {
        console.log('CaloricCharts', data);
        calculateSummedData(data);
    }, [data]);

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function calculateSummedData(data) {
        let sum = { calories: 0, carbs: 0, fats: 0, protein: 0 };

        data.forEach(meal => {
            sum.calories += meal.calories || 0;
            sum.carbs += meal.carbs || 0;
            sum.fats += meal.fats || 0;
            sum.protein += meal.protein || 0;
            // console.log(meal);
            // console.log(summedData);
        });

        setSummedData(sum);
        console.log(sum);
    }
    function ProgressBar({ value, goal, label, color }) {
        const [progress, setProgress] = useState(0);
        const percentage = Math.min((value / goal) * 100, 100);

        useEffect(() => {
            setTimeout(() => {
                setProgress(percentage);
            }, 200);
        }, [percentage]);

        return (
            <div className="progress-bar-container">
                <span>{label}: {value}g / {goal}g</span>
                <div className="progress-bar">
                    <div className="progress-fill"
                        style={{ width: `${progress}%`, backgroundColor: color }}></div>
                </div>
            </div>
        );
    }

    const [labels, setLabels] = useState([]);
    const [intakeData, setIntakeData] = useState([]);
    const [burnedData, setBurnedData] = useState([]);
    useEffect(() => {
        generateLabels();
        calculateCalories();
    }, [data, dataw, timeFrame, start, end]);

    const generateLabels = () => {
        if (timeFrame === 'week') {
            setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        } else if (timeFrame === 'month') {
            const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
            setLabels(Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()));
        } else if (timeFrame === 'year') {
            setLabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        }
    };

    const calculateCalories = () => {
        const intakeMap = {};
        const burnedMap = {};

        labels.forEach(label => {
            intakeMap[label] = 0;
            burnedMap[label] = 0;
        });

        data?.forEach(meal => {
            const date = new Date(meal.timestamp);
            const label = getLabelFromDate(date);
            intakeMap[label] += meal.calories || 0;
        });

        dataw?.forEach(workout => {
            const date = new Date(workout.timestamp);
            const label = getLabelFromDate(date);
            burnedMap[label] += workout.caloriesBurned || 0;
        });

        setIntakeData(labels.map(label => intakeMap[label]));
        setBurnedData(labels.map(label => burnedMap[label]));
    };

    const getLabelFromDate = (date) => {
        if (timeFrame === 'week') {
            const dayIndex = (date.getDay() + 6) % 7; // Monday starts at 0
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex];
        } else if (timeFrame === 'month') {
            return date.getDate().toString();
        } else if (timeFrame === 'year') {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
        }
    };
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Calories Intake',
                data: intakeData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
            {
                label: 'Calories Burned',
                data: burnedData,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            x: { stacked: false },
            y: { stacked: false }
        }
    };

    const pieChartData = {
        labels: ['Carbs', 'Fats', 'Protein'],
        datasets: [
            {
                label: 'Macronutrients',
                data: [summedData.carbs, summedData.fats, summedData.protein],
                backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
                borderWidth: 1,
            },
        ],
    };
    const optionsPie = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            position: 'right', // Move legend to the right
          },
        },
      };
      

    return (
        <div className='flex'>

            <div className="chart-container-p">
                <h3>Total {timeFrame}ly calories: {summedData.calories.toFixed(1)} Cal</h3>
                <small>Recommended: {nutritionGoals.calories * multiplier} Cal/day</small>
                <ProgressBar value={summedData.carbs.toFixed(0)} goal={nutritionGoals.carbs * multiplier} label="Carbs" color="#4caf50" />
                <ProgressBar value={summedData.fats.toFixed(0)} goal={nutritionGoals.fats * multiplier} label="Fats" color="#ff9800" />
                <ProgressBar value={summedData.protein.toFixed(0)} goal={nutritionGoals.protein * multiplier} label="Protein" color="#2196f3" />
                {/* <ProgressBar value={summedData.calories.toFixed(0)} goal={nutritionGoals.calories*multiplier} label="Total Calories" color="#FF5733" /> */}
            </div>
            <div className='chart-container-b'>
                <h4>Calorie Intake vs. Calories Burned</h4>
                <Bar data={chartData} options={options} />
            </div>
            <div className='temp'>
                <h4>Macronutrients chart</h4>
            <div className='chart-container-pie'>
                <Pie data={pieChartData} options={optionsPie} />

            </div>

            </div>
        </div>
    )
}