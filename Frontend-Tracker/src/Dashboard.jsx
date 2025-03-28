import './dashboard.css'

import SideBar from './SideBar'
import Summary from './Summary'
import Workout from './Workout'
import Meals from './Meals'
import Water from './Water'
import Profile from './Profile'

import React,{useState,useEffect} from 'react'
export default function Dashboard() {
    const [page,setPage]= React.useState("dashboard")
    const [userId, setUserId] = useState(null);

    const token = localStorage.getItem("token");
    const headers= {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    function handleChange(path){
        setPage(path)
        console.log(path)
    }
    useEffect(() => {
            if (!token) return;
    
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                if (decodedToken?.userId) {
                    setUserId(decodedToken.userId);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                toast.error("Invalid session. Please log in again.");
            }
        }, [token]);

    // const [dark, setDark]=React.useState(false)
    // function toggleTheme(){
    //     setDark((prev)=>!prev)
    //     console.log(dark)
    // }
    // <button onClick={toggleTheme}>Theme</button> 


    return (
        <div >
            <SideBar page={page} setPage={handleChange}/>
            {(page === "dashboard") ? <div className='content'>
                <Summary headers={headers} userId={userId} />
            </div> : null}
            {(page === "workout") ? <div className='content'>
                <Workout headers={headers} userId={userId}/>
            </div> : null}
            {(page === "meals") ? <div className='content'>
                <Meals headers={headers} userId={userId}/>
            </div> : null}
            {(page === "water") ? <div className='content'>
                <Water headers={headers} userId={userId}/>
            </div> : null}
            {(page === "profile") ? <div className='content'>
                <Profile headers={headers} userId={userId}/>
            </div> : null}
            
        </div>
    )
}


