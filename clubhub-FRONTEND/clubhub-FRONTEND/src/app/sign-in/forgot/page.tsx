"use client";

import React, { useState } from 'react';
import styles from './forgot.module.css'; // Add your own CSS styles
import { useRouter } from 'next/navigation'; // Use for redirection

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the email to the backend for password reset
      const res = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email as JSON
      });

      const responseData = await res.json();
      if (res.ok) {
        // Show success message
        setMessage('Please check your email for the password reset link.');
        
        // Optionally redirect after some time
        setTimeout(() => {
          router.push('/sign-in'); // Redirect back to sign-in page after 5 seconds
        }, 5000);
      } else {
        // Show error message if backend returns an error
        setMessage(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h2>Forgot Password</h2>
      <p>Please enter your email address to receive a password reset link.</p>

      <form className={styles.forgotPasswordForm} onSubmit={handleSubmit}>
        <div className={styles.inputField}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Send Reset Link
        </button>
      </form>

      {/* Conditionally render the message */}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
