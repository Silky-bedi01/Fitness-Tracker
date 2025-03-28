import React, { useState, useEffect } from "react";
import "./meals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGlassWhiskey } from "react-icons/fa";
import { FaTrash, FaBreadSlice, FaUtensils, FaPizzaSlice, FaIceCream } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md"

export default function Meals({ headers, userId }) {
    const [meal, setMeal] = useState("");
    const [mealType, setMealType] = useState("breakfast");
    const [mealHistory, setMealHistory] = useState([]);
    const [waterIntake, setWaterIntake] = useState(2);
    const [waterHistory, setWaterHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [viewAll, setViewAll] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);



    const mealIcons = {
        BREAKFAST: <FaBreadSlice />,
        LUNCH: <FaUtensils />,
        DINNER: <MdDinnerDining />,
        SNACKS: <FaPizzaSlice />,
        DESSERT: <FaIceCream />,
    };



    useEffect(() => {
        if (userId) {
            fetchMealHistory();
            fetchWaterHistory();
        }
    }, [userId, viewAll, startDate, endDate]);


    const handleDateChange = (e) => {
        setStartDate(e.target.value);
    };


    const handlePrevDate = () => {
        const prevDate = new Date(startDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setStartDate(prevDate.toISOString().split("T")[0]);
    };

    const handleNextDate = () => {
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const today = new Date().toISOString().split("T")[0];

        if (nextDate.toISOString().split("T")[0] <= today) {
            setStartDate(nextDate.toISOString().split("T")[0]);
        }
    };

    const isSelectedDate = (date) => {
        const entryDate = new Date(date).toISOString().split("T")[0];
        return entryDate === startDate;
    };

    // Fetch Meal History
    const fetchMealHistory = () => {
        if (viewAll) {
            fetch(`http://localhost:8080/api/meals/all_history`, {
                method: "GET",
                headers
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch meal history");
                    return response.json();
                })
                .then((data) => setMealHistory(data))
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error("Failed to load meal history.");
                });
        } else {
            const start = `${startDate}T00:00:00`;
            const end = `${startDate}T23:59:59`;
            fetch(`http://localhost:8080/api/meals/history?startDate=${start}&endDate=${end}`, {
                method: "GET",
                headers
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch meal history");
                    return response.json();
                })
                .then((data) => setMealHistory(data))
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error("Failed to load meal history.");
                });
        }
    };
    // Fetch Water History
    const fetchWaterHistory = () => {
        if(viewAll){
            fetch(`http://localhost:8080/api/water/all_history`, {
                method: "GET",
                headers
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch water history");
                    return response.json();
                })
                .then((data) => {
                    setWaterHistory(data);
                    console.log("Water history loaded successfully!");
                })
                .catch((error) => {
                    console.error("Error fetching water history:", error);
                    toast.error("Failed to load water history.");
                });
        }
        else{const start = `${startDate}T00:00:00`;
        const end = `${startDate}T23:59:59`;

        fetch(`http://localhost:8080/api/water/history?startDate=${start}&endDate=${end}`, {
            method: "GET",
            headers
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch water history");
                return response.json();
            })
            .then((data) => {
                setWaterHistory(data);
                console.log("Water history loaded successfully!");
            })
            .catch((error) => {
                console.error("Error fetching water history:", error);
                toast.error("Failed to load water history.");
            });}
    };


    const handleMealLog = (e) => {
        e.preventDefault();
        if (!meal.trim()) {
            toast.warn("Please enter a valid meal.");
            return;
        }
        if (!userId) {
            toast.error("User not identified. Please log in again.");
            return;
        }

        const mealData = {
            "user": {
                "id": userId
            },
            mealName: meal,
            mealType: mealType.toUpperCase(),
        };
        if(startDate!=today){
            mealData.timestamp=startDate+'T'+"00:00:00.000Z"
        }

        fetch("http://localhost:8080/api/meals/log", {
            method: "POST",
            headers,
            body: JSON.stringify(mealData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to log meal");
                return response.json();
            })
            .then((newMeal) => {
                setMealHistory((prevHistory) => [...prevHistory, newMeal]);
                setMeal("");
                toast.success(`${meal} logged successfully!`);
            })
            .catch((error) => {
                console.error("Error logging meal:", error);
                toast.error("Error logging meal.");
            });
    };

    const fetchFoodSuggestions = (query) => {
        if (!query) return setSuggestions([]);

        fetch(`http://localhost:8080/api/meals/autocomplete?query=${query}`, {
            headers
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch suggestions");
                return response.json();
            })
            .then(setSuggestions)
            .catch((error) => console.error("Error fetching suggestions:", error));
    };

    const handleWaterChange = (e) => {
        setWaterIntake(parseFloat(e.target.value));
    };

    const handleWaterLog = () => {
        if (waterIntake <= 0) return toast.warn("Water amount must be greater than 0.");

        const waterData = {
            "user": {
                "id": userId
            },
            waterAmount: waterIntake,
        };
        if(startDate!=today){
            waterData.timestamp=startDate+'T'+"00:00:00.000Z"
        }

        fetch("http://localhost:8080/api/water/log", {
            method: "POST",
            headers,
            body: JSON.stringify(waterData),
        })
            .then((res) => res.ok ? res.json() : Promise.reject("Failed to log water intake"))
            .then((newEntry) => {
                setWaterHistory((prev) => [newEntry, ...prev]);
                toast.success(`${waterIntake}L water logged!`);
            })
            .catch((err) => {
                console.error("Error logging water:", err);
                toast.error("Error logging water intake.");
            });
    };

    function handleDelete(logtype, id) {
        console.log(id)

        fetch(`http://localhost:8080/api/${logtype}/${id}`, {
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
                toast.success(message || "Log deleted successfully!");
                if (logtype == "water") {
                    fetchWaterHistory();
                } else if (logtype == "meals") {
                    fetchMealHistory();
                }
            })
            .catch(error => {
                toast.error(error.message || "Error deleting log");
            });
    };
    const capitalize = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const totalCalories = mealHistory
        .filter((meal) => isSelectedDate(meal.timestamp))
        .reduce((sum, meal) => sum + (meal.calories || 0), 0);

    const totalWater = waterHistory
        .filter((entry) => isSelectedDate(entry.timestamp))
        .reduce((sum, entry) => sum + entry.waterAmount, 0);


    return (
        <div className="main-container">
            <h2 className="title">Track your Intake</h2>
            <div className="row">

                <div className="toggle-container">
                    <span className={!viewAll ? "active" : ""}>Day-wise</span>
                    <div className="toggle-switch" onClick={() => setViewAll(!viewAll)}>
                        <div className={`toggle-slider ${viewAll ? "right" : "left"}`}></div>
                    </div>
                    <span className={viewAll ? "active" : ""}>All-time</span>
                </div>

                {!viewAll && (
                    <div className="date-picker-container-m">
                        <button className="nav-btn" onClick={handlePrevDate}>&lt;</button>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="custom-date-picker"
                        />
                        <button className="nav-btn" onClick={handleNextDate} disabled={startDate === today}>&gt;</button>
                        {startDate !== today && (
                            <button className="today-btn" onClick={() => setStartDate(today)}>Go to Today</button>
                        )}
                    </div>
                )}
            </div>


            {/* <div className="date-picker-container">
                <button className="nav-btn" onClick={handlePrevDate}>&lt;</button>

                <input
                    type="date"
                    value={startDate}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="custom-date-picker"
                />

                <button className="nav-btn" onClick={handleNextDate} disabled={isToday(startDate)}>&gt;</button>
            </div> */}


            <div className="container">

                {/* Meal Section */}
                <div className="meal-section">
                    <h2 className="section-title"> Meals</h2>
                    <form className="meal-form" onSubmit={handleMealLog}>
                        <input
                            type="text"
                            placeholder="Add Food Item"
                            value={meal}
                            onChange={(e) => {
                                setMeal(e.target.value);
                                fetchFoodSuggestions(e.target.value);
                            }}
                        />

                        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                            <option value="breakfast">🍞 Breakfast</option>
                            <option value="lunch">🍽️ Lunch</option>
                            <option value="dinner">🍝 Dinner</option>
                            <option value="snacks">🍕 Snacks</option>
                            <option value="dessert">🍨 Dessert</option>
                        </select>
                        <button type="submit" className="add-btn">Add</button>
                    </form>

                    {suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => {
                                        setMeal(item);
                                        setSuggestions([]);
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>Total Calories: {totalCalories.toFixed(0)} cal</h3>

                    <div className="meal-history">
                        {mealHistory.length === 0 ? (
                            <p>No meals logged yet.</p>
                        ) : (<>
                            {mealHistory
                                .slice()
                                .reverse()
                                .map((entry) => (
                                    <div className="w-item" key={entry.id}>
                                        <div className="meal-item">
                                            <span className="meal-icon">{mealIcons[entry.mealType]}</span>
                                            <div>
                                                <p>{capitalize(entry.mealName)}</p>
                                                <small>
                                                    {entry.calories.toFixed(0)} Cal •
                                                    Protein: {entry.protein.toFixed(0)}g •
                                                    Carbs: {entry.carbs.toFixed(0)}g •
                                                    Fats: {entry.fats.toFixed(0)}g
                                                </small>
                                            </div>
                                            <small>{new Date(entry.timestamp).toLocaleString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}</small>
                                        </div>
                                        <FaTrash
                                            className="delete-icon"
                                            onClick={() => handleDelete("meals", entry.id)}
                                        />
                                    </div>
                                ))}
                        </>)}
                    </div>

                </div>

                {/* Water Section */}
                <div className="water-section">
                    <h2 className="section-title">💧 Water Intake</h2>
                    <div className="water-control">
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={waterIntake}
                            onChange={handleWaterChange}
                        />
                        <span>{waterIntake}L</span>
                        <button onClick={handleWaterLog} className="add-btn">Log</button>
                    </div>

                    <h3>Total Water Intake: {totalWater.toFixed(1)}L</h3>

                    <div className="water-history">
                        {waterHistory.length === 0 ? (
                            <p>No water intake logged yet.</p>
                        ) : (
                            <>{
                                waterHistory.map((entry) => (
                                    <div className="w-item" key={entry.id}>
                                        <div className="water-item">
                                            <FaGlassWhiskey className="water-icon" />
                                            <p>{entry.waterAmount}L</p>
                                            <small className="small-left">{new Date(entry.timestamp).toLocaleString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}</small>
                                        </div>
                                        <FaTrash
                                            className="delete-icon"
                                            onClick={() => handleDelete("water", entry.id)}
                                        />
                                    </div>
                                ))
                            }</>
                        )}
                    </div>
                </div>

                <ToastContainer />
            </div>
        </div >
    );
}
