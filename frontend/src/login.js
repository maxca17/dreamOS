// Login.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './css/login.css';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('Email and password required.');
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Sign-up successful! Check your email for verification.');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email and password required.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Dream Ventures</h1>
        <h2 className="login-subheader">Sign in to your account</h2>
        <h1 className="login-heading">{isSignUp ? 'Sign Up' : 'Login'}</h1>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp ? (
          <>
            <button className="login-button" onClick={handleSignUp}>Sign Up</button>
            <p className="login-text">
              Already have an account?{' '}
              <span className="login-link" onClick={() => setIsSignUp(false)}>
                Login here
              </span>
            </p>
          </>
        ) : (
          <>
            <button className="login-button" onClick={handleLogin}>Login</button>
            <p className="login-text">
              No account?{' '}
              <span className="login-link" onClick={() => setIsSignUp(true)}>
                Sign up here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
