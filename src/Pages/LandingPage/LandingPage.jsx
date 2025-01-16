import React from 'react'
import { BrowserRouter,Routes,Route, Link } from 'react-router-dom';
import './LandingPage.css';
import Nav from '../../Components/Navigation/Nav';
const LandingPage = () => {
  return (
    // <div className='Wrapper-LandingPage'>
    <div className='wrapper-pages'>
        <div className='wrapper-Landing'>
            <h1>Cognify</h1>
            <Link to = '/LoginForm'> <button > Login </button> </Link>
            <Link to = '/RegisterForm'> <button> Register </button> </Link>
            <h2> hello this is updated testing that should show on screen </h2> 
        </div>
    </div>
    
  )
}

export default LandingPage;