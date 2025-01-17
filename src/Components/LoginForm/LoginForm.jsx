import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock, FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { auth, googleProvider, db } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useState, useEffect } from "react";
import BackButton from '../BackButton/BackButton';
/* **CHANGE USERNAME TO EMAIL** */
const LoginForm = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signIn = async (e) =>{
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            navigate('/HomePage');
        } catch(err) {
            console.error(err);
            alert("Wrong Email or Password. Please try again.");
        }

    };
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {  // Check if the user is authenticated
                navigate('/HomePage');
            }
        } catch (err) {
            console.error(err);
            alert("Google Sign-In failed. Please try again.");
        }
    };
    // const signInWithGithub = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, githubProvider);
    //         if (result.user) {  // Check if the user is authenticated
    //             navigate('/HomePage');
    //         }       
    //     } catch (err) {
    //         console.error(err);
    //         alert("Github Sign-In failed. Please try again.");
    //     }
    // };
    const logout = async () => {
        try{
            await signOut(auth);
        }catch (err){
            console.error(err);
        }
    }

    return(
        <div>
            <Link to= '/LandingPage'><BackButton></BackButton></Link>
        <div className='wrapper'>
            <form onSubmit={signIn}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='Email' required 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <FaUser className ='icon'/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required
                    onChange={(e) => setPassword(e.target.value)}/>
                    <FaLock className ='icon'/>
                </div>
                
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href='#'>Forgot password?</a>
                </div>
                <div className='AutoSubmit'> 
                    <div className='google_signin'>
                        <button type="submit" onClick={signInWithGoogle}> <FcGoogle className='icon'/></button>
                    </div>
                    <div className='github_signin'>
                        <button type="submit"> <BsGithub className='icon'/></button>
                    </div>
                    <div className='microsoft_signin'>
                        <button type="submit"> <FaMicrosoft className='icon'/></button>
                        </div>
                </div>
                <div className='LoginButton'>
                    <button type="submit" onClick={signIn}>Login</button>
                </div>

                
                
                <div className="register-link">
                    <p>Don't have an account? <Link to ="/RegisterForm"> Register</Link></p>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;