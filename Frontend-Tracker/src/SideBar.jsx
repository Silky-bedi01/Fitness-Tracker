import React from 'react';
import './sidebar.css';
import { useNavigate } from 'react-router-dom'


export default function SideBar(props) {
    const navigate = useNavigate();

    const list = [
        { name: 'Dashboard', path: 'dashboard', icon: 'home' },
        { name: 'Workout', path: 'workout', icon: 'dumbbell' },
        { name: 'Meals', path: 'meals', icon: 'food' },
        // { name: 'Water', path: 'water', icon: 'water' },
        { name: 'Edit Profile', path: 'profile', icon: 'user' }
    ];

    const mapped = list.map((item) => {
        return (
            <li
                key={item.path}
                className={item.path === props.page ? 'active' : ''}
                onClick={() => props.setPage(item.path)}
            >
                {item.name}
            </li>
        );
    });
    function logOut() {
        console.log("works!")
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className='sidebar'>
            <p>
                <img src="/logo.png" width='45px'></img>
                <span className='appname'>FitTrack</span>
            </p>
            <br />
            <ul>{mapped}</ul>
            <button className='logout-btn' onClick={logOut}>Log out</button>
        </div>
    );
}

