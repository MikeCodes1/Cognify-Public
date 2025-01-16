import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../src/config/firebase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Render a loading indicator while waiting for Firebase to confirm the user's authentication status
    return <div></div>;
  }

  if (!user) {
    // If no user is authenticated, redirect to the login page
    return <Navigate to="/LoginForm"/>;
  }

  // If the user is authenticated, render the children (i.e., the protected content)
  return children;
};

export default ProtectedRoute;