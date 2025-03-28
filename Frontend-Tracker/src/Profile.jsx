import './profile.css';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

export default function Profile({headers}) {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        activityLevel: "",
        age: "",
        bloodGroup: "",
        contactPhone: "",
        fitnessGoals: "",
        height: "",
        weight: "",
        bmi: "",
        profilePictureUrl: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    
    useEffect(() => {
        if (!headers) return;

        fetch("http://localhost:8080/api/auth/user/me", {
            method: "GET",
            headers,
        })
        .then(response => response.json())
        .then(userData => {
            console.log(userData);
            const nameParts = userData.name?.split(" ") || ["", ""];
            setUser({
                ...userData,
                first_name: nameParts[0],
                last_name: nameParts[1] || "",
                bmi: calculateBMI(userData.height, userData.weight),
            });
        })
        .catch(error => {
            console.log("Error fetching user", error)
            toast.error("Error fetching user")
        });
    }, [headers]);

    const calculateBMI = (height, weight) => {
        if (!height || !weight) return "";
        return (weight / ((height / 100) ** 2)).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => {
            const updatedUser = {
                ...prevUser,
                [name]: value
            };

            if (name === "height" || name === "weight") {
                updatedUser.bmi = calculateBMI(updatedUser.height, updatedUser.weight);
            }

            return updatedUser;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setUser({ ...user, profilePictureUrl: imageUrl });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUser = { 
            ...user, 
            name: `${user.first_name} ${user.last_name}`,
            bmi: parseFloat(user.bmi),
            profilePictureUrl: user.profilePictureUrl
        };

        fetch("http://localhost:8080/api/auth/update-profile", {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.text())  
        .then(data => {
            // console.log("Updated Data from API:", data);
            toast.success(data || "Profile updated successfully!");  
            setUser({
                ...updatedUser,
                first_name: updatedUser.name.split(" ")[0],
                last_name: updatedUser.name.split(" ")[1] || "",
            });
        })
        .catch(error => {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile.");  
        });
        
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();
    
        if (passwords.newPassword =="") {
            toast.error("New password can't be empty")
            return
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!")
            return
        }
    
        const requestBody = {
            oldPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        };
    
        fetch("http://localhost:8080/api/auth/change-password", {
            method: "PUT",
            headers,
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error(errorMessage || "Error changing password");
                });
            }
            return response.text(); 
        })
        .then(data => {
            console.log(data);
            toast.success("Password changed successfully!"); 
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        })
        .catch(error => {
            console.error("Error:", error);
            
            const errorMessage = (error instanceof Error) ? error.message : "Error changing password"; 
            toast.error(errorMessage);  
        });
        
    };
    
    return (
        <div className="profile-container">
            <h2 className="profile-title">Profile Settings</h2>

            <div className="tabs">
                <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>Personal Info</button>
                <button className={activeTab === "physical" ? "active" : ""} onClick={() => setActiveTab("physical")}>Physical Data</button>
                <button className={activeTab === "goals" ? "active" : ""} onClick={() => setActiveTab("goals")}>Goals</button>
                <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>Password</button>
            </div>

            <form onSubmit={activeTab === "password" ? handleSubmitPassword : handleSubmit} className="profile-form">
                {activeTab === "personal" && (
                    <>
                        <div className="profile-section">
                            <div className="profile-picture">
                                <img src={selectedImage || user.profilePictureUrl || "https://placehold.co/600x400?text=Profile+photo"} alt="Profile" />
                                <label htmlFor="profile-pic-upload" className="edit-icon">✏️</label>
                                <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>First Name:</label>
                                <input type="text" name="first_name" value={user.first_name || ""} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Last Name:</label>
                                <input type="text" name="last_name" value={user.last_name || ""} onChange={handleChange} />
                            </div>
                        </div>

                        <label>Email:</label>
                        <input type="email" name="email" value={user.email || ""} disabled />

                        <label>Phone Number:</label>
                        <input type="text" name="contactPhone" value={user.contactPhone || ""} onChange={handleChange} />

                        <label>Gender:</label>
                        <div className="gender-options">
                            <label><input type="radio" name="gender" value="Male" checked={user.gender === "Male"} onChange={handleChange} /> Male</label>
                            <label><input type="radio" name="gender" value="Female" checked={user.gender === "Female"} onChange={handleChange} /> Female</label>
                            <label><input type="radio" name="gender" value="Other" checked={user.gender === "Other"} onChange={handleChange} /> Other</label>
                        </div>
                    </>
                )}
                {activeTab === "physical" && (
                    <>
                        <label>Height (cm):</label>
                        <input type="number" name="height" value={user.height || ""} onChange={handleChange} />

                        <label>Weight (kg):</label>
                        <input type="number" name="weight" value={user.weight || ""} onChange={handleChange} />

                        <label>BMI (Auto-Calculated):</label>
                        <input type="text" value={user.bmi || ""} disabled />

                        <label>Age (in years):</label>
                        <input type="number" name="age" value={user.age || ""} onChange={handleChange} />

                        <label>Blood Group:</label>
                        <input type="text" name="bloodGroup" value={user.bloodGroup || ""} onChange={handleChange} />
                    </>
                )}

                {activeTab === "goals" && (
                    <>
                        <label>Activity Level:</label>
                        <select name="activityLevel" value={user.activityLevel || ""} onChange={handleChange}>
                            <option value="Sedentary">Sedentary</option>
                            <option value="Moderately active">Moderately Active</option>
                            <option value="Active">Active</option>
                        </select>

                        <label>Fitness Goals:</label>
                        <select name="fitnessGoals" value={user.fitnessGoals || ""} onChange={handleChange}>
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Endurance">Endurance</option>
                            <option value="Overall Health">Overall Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </>
                )}

                {activeTab === "password" && (
                    <>
                        <label>Current Password:</label>
                        <input type="password" name="currentPassword" onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />

                        <label>New Password:</label>
                        <input type="password" name="newPassword" onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />

                        <label>Confirm New Password:</label>
                        <input type="password" name="confirmPassword" onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />

                        <button type="submit" className="save-btn">Change Password</button>
                    </>
                )}

                {activeTab !== "password" && <button type="submit" className="save-btn">Update</button>}
            </form>
            <ToastContainer/>
        </div>
    );
}

