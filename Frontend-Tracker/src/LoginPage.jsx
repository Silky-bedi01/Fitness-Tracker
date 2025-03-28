import './login.css'
import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
export default function LoginPage() {
    const [login, setLogin] = React.useState(true)
    const [message, setMessage] = useState(""); // For error/success messages
    const [loading, setLoading] = useState(false); // Loading state
    console.log(login)

    const navigate = useNavigate();

    // First check if token is already present
    const isTokenValid = () => {
        const token = localStorage.getItem("token");

        if (!token) return false;

        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            const expiry = decodedToken.exp * 1000; // Convert expiry to ms

            if (Date.now() >= expiry) {
                localStorage.removeItem("token"); // Remove expired token
                return false;
            }

            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            return false;
        }
    };

    // Redirect to dashboard if token is there
    React.useEffect(() => {
        if (isTokenValid()) {
            navigate("/dashboard"); // Use React Router instead of window.location.href
        }
    }, []);

    // toggle between sign up and login form
    function toggleForm() {
        setLogin((prev) => !prev)
        setMessage("");
    }


    function handleLogin(event) {
        event.preventDefault()
        setLoading(true);
        setMessage("");

        const formEl = event.currentTarget
        const formData = new FormData(formEl)

        const email = formData.get('email')
        const password = formData.get('password')
        console.log(email, password)

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password}),
            redirect: "follow"
        };

        fetch("http://localhost:8080/api/auth/login", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) throw new Error("Incorrect password!");
                    if (response.status === 404) throw new Error("Email not registered! Create an account first.");
                    if (response.status === 500) throw new Error("Server is down. Please try again later.");
                    throw new Error("Login failed!");
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    navigate("/dashboard");
                } else {
                    throw new Error(data.message || "Invalid credentials!");
                }
            })
            .catch((error) => {
                setMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function handleRegister(event) {
        event.preventDefault()
        const formEl = event.currentTarget
        const formData = new FormData(formEl)

        const fullName = formData.get('fullName')
        const email = formData.get('email')
        const password = formData.get('password')
        console.log(fullName, email, password)

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: fullName, email, password }),
        };

        fetch("http://localhost:8080/api/auth/register", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 400) throw new Error("Invalid email format.");
                    if (response.status === 409) throw new Error("Email already exists.");
                    if (response.status === 500) throw new Error("Server is down. Please try again later.");
                    throw new Error("Registration failed.");
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    navigate("/dashboard");
                } else {
                    throw new Error(data.message || "Something went wrong.");
                }
            })
            .catch((error) => {
                setMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className='login-page'>
            <form className="login-form" onSubmit={login ? handleLogin : handleRegister}>
                <h2 className="title">FitTrack</h2>

                {!login ? <label htmlFor="fullName" className="details">Full Name
                    <input id="fullName" name="fullName" className="field" type="text" placeholder="John Smith" required /></label>
                    : <br />}

                <label htmlFor="email" className="details">Email
                    <input id="email" name="email" className="field" type="email" placeholder="example@mail.com" required />
                </label>

                <label htmlFor="password" className="details">Password
                    <input id="password" name="password" className="field" type="password" required />
                </label>

                <br /><br />
                {message && <p className="message">{message}</p>}
                {loading ? <p className="processing" >Processing...</p> : <button className="button" type="submit">{login ? "Login" : "Create account"}</button>}

                <p id="or">{login ? "Not a member?" : "Already a member?"} <button className='signIn' onClick={toggleForm}>{login ? "Sign up" : "Log in"}</button></p>
            </form>
        </div>

    )
}