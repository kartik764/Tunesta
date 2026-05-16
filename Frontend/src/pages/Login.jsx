import React, { useState } from 'react'
import "../components/Style.css"
import "../components/Utility.css"
import { toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom'
import { useAuth,Authprovider } from '../context/Authcontext'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

 
    // to use the login function declared in the authcontext.
    const {login} = useAuth();
    // to use the navigate function of the react-router-dom.    
    const navigate= useNavigate();

    const handlelogin = async (e) => {
        // to prevent the default action of the form to refresh the server upon submission.
        e.preventDefault();
        
        if(!email || !password){
            toast.warning("Please enter both email and the password");
        }

        const loadingToast=toast.loading("Logging in...");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}), // Convert your data to a JSON string
                
            });

            const data= await response.json();
            toast.dismiss(loadingToast);

            if(response.ok){
                // 1. Updating the login status at the Authcontext to make the app know that the user is login.
                console.log("LOGIN SUCCESS");
                toast.success("Welcome To TUNESTA! 🎵")
                login(data.user, data.token);
                sessionStorage.setItem("tunesta_usertoken", data.token);
                sessionStorage.setItem("user_email", email);
                console.log("Stored Email:", email);
                // route change to home page
                navigate("/");

            }
            else{
                toast.error("Check your Credentials and try again...")
                console.log("Login failed because of the message: ", data.message);
            }

        }
        catch(e) {
            toast.dismiss(loadingToast);
            toast.error("Something went wrong, please try again later...")
            console.log("login failed with the error: ",e);
        }
    }

    return (
        <>
            <div className="logincontainer">

                <div className="glass-effect" style={{
                    width: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '40px',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}>
                    {/* cross button */}
                    <button className='close-btn'></button>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '32px' }}>Login</h1>

                    <form onSubmit={handlelogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* inputting the email */}
                        <div className="input-group">
                            <input
                                type='email'
                                // placeholder gives the hint to the user that what is the field is about.
                                placeholder='Email Address'
                                className='auth-input'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </input>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="auth-btn">
                            Log In
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '14px', marginTop: '10px' }}>
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login;
