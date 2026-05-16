import React, { useState } from 'react'
import "../components/Style.css"
// import "../components/Utility.css" 
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const loadingToast=toast.loading("Signing in...")
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}), // Convert your data to a JSON string
            })
            console.log(response);

            const data = await response.json();
            toast.dismiss(loadingToast);

            if (response.ok) {
                toast.success("Signup Sucessful, Welcome to Tunesta! 🎵")
                navigate('/login');
                console.log('signup successful')
            }
            else {
                toast.error("Signup Failed!")
                console.log("Signup unsuccessful with the message ", data.message)
            }
        }
        catch (e) {
            toast.dismiss(loadingToast);
            toast.error("Something Went wrong, try again later..");
            console.log("Signup unsuccessful with the error: ", e);
        }



    }

    return (
        <div className="signupcontainer">
            <div className="glass-effect" style={{ width: '450px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>

                <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '32px' }}>Sign Up</h1>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input type='email' placeholder='Email Address' className='auth-input' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Create Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {/* Visual change: Different button color or text */}
                    <button type="submit" className="auth-btn" style={{ backgroundColor: '#1DB954' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '14px', marginTop: '10px' }}>
                    Already have an account?
                    {/* Link back to Login */}
                    <Link to="/login" className="auth-link">Log In</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup