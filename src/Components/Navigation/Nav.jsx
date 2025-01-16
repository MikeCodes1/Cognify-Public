import React from 'react'
import {NavLink } from 'react-router-dom';
import './Nav.css';
import { useState } from 'react';


const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
  return (
    
    <div className='wrapper-nav'>
        <div className="wrapper-title">
            <NavLink to = "/HomePage" className="Title">Cognify </NavLink>
        </div>
        
        
            <button className = 'hamburger' onClick={toggleMenu}>
                <span className='hamburger-line'></span>
                <span className='hamburger-line'></span>
                <span className='hamburger-line'></span>
            </button>

        <nav className= {`Nav ${isMenuOpen ? 'active' : ''}`}>
        <NavLink 
                to="/HomePage" 
                className={({ isActive }) => isActive ? "Home active-link" : "Home"}

                onClick={() => setIsMenuOpen(false)}
            >
                Home
            </NavLink>
            <NavLink 
                to="/Sets" 
                className={({ isActive }) => isActive ? "active-link" : ""}

                onClick={() => setIsMenuOpen(false)}
            >
                Sets
            </NavLink>
            <NavLink
                to="/Explore" 
                className={({ isActive }) => isActive ? "active-link" : ""}

                onClick={() => setIsMenuOpen(false)}
            >
                Explore
            </NavLink>
            <NavLink 
                to="/Account" 
                className={({ isActive }) => isActive ? "active-link" : ""}

                onClick={() => setIsMenuOpen(false)}
            >
                Account
            </NavLink>
        </nav>
    </div>
  )
}

export default Nav