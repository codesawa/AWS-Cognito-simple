// src/App.js

import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from './cognitoClient';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(username, password);
      alert('Sign-up successful! Please check your email for the confirmation code.');
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Error during sign-up, please try again.');
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp(username, confirmationCode);
      alert('Confirmation successful! You can now sign in.');
    } catch (error) {
      console.error('Error during confirmation:', error);
      alert('Error during confirmation, please try again.');
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signIn(username, password);
      if (result) {
        setIsSignedIn(true);
        alert('Sign-in successful!');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Error during sign-in, please try again.');
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setIsSignedIn(false);
    setMessage('');
  };

  const callProtectedApi = async () => {
    const token = sessionStorage.getItem('idToken'); // or 'accessToken', depending on your backend setup
    try {
      const response = await fetch('http://localhost:5000/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Failed to fetch protected resource.');
      }
    } catch (error) {
      console.error('Error calling protected API:', error);
      setMessage('Error calling protected API.');
    }
  };

  return (
    <div className="App">
      {!isSignedIn ? (
        <div>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>

          <h2>Confirm Sign Up</h2>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>

          <h2>Sign In</h2>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      ) : (
        <div>
          <h1>Welcome, {username}!</h1>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={callProtectedApi}>Call Protected API</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
