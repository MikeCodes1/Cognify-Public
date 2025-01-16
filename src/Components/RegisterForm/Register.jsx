import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import './Register.css';
import { FaUser, FaLock, FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import BackButton from '../BackButton/BackButton';
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const signUp = async (e) => {
      e.preventDefault();

      if (!email || !password || !username || !firstName || !lastName) {
          alert("Please fill in all fields.");
          return;
      }

      try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate('/LoginForm'); // Redirect only after successful registration
      } catch (err) {
          console.error(err);
          alert("Registration failed. Please try again.");
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
  return (
    <div>
      <Link to= '/LandingPage'><BackButton></BackButton></Link>
    <div className='wrapper'>
      
      <form onSubmit={signUp}>
        <h1>Register</h1>
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
        <div className='input-box'>
          <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
          <FaUser className='icon'/>
        </div>

        <div className="input-box">
          <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
          <MdEmail className='icon'/>
        </div>

        <div className="input-box">
          <input type="text" placeholder='First Name' required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="input-box">
          <input type="text" placeholder='Last Name' required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="input-box">
          <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
          <FaLock className ='icon'/>
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox" />Remember me</label>
        </div>

        <div className="register-link">
          <p>Have an account? <Link to="/LoginForm">Login</Link></p>
        </div>
        <div className='RegisterButton'>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Register;
