"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter for redirection
import styles from './signin.module.css';
import Link from 'next/link'; 

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior

    const loginData = { email, password };

    try {
      // Send the login data to the backend API
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Send the login data as JSON
      });

      const responseData = await res.json(); // Parse the response data

      // Log for debugging purposes
      console.log('Response Status:', res.status);
      console.log('Response Data:', responseData);

      if (res.ok) {
        const { user } = responseData; // Capture the user data

        // Redirect based on the user role and user ID
        if (user.role === 'Administrator') {
          router.push(`/admin/${user.id}?name=${user.name}`); // Redirect to admin page with user name
        } else {
          router.push(`/member/${user.id}?name=${user.name}`); // Redirect to member page with user name
        }
      } else {
        // Handle backend errors (e.g., invalid credentials)
        alert(`Login failed: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.signinContainer}>
      <header className={styles.header}>
        <img src="/signup/logo_clubhub.jpg" alt="Logo" className={styles.logo} />
        <button className={styles.homeButton}>HOME</button>
      </header>

      <h2 className={styles.title}>SIGN IN</h2>

      <form className={styles.signinForm} onSubmit={handleSubmit}>
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

        <div className={styles.inputField}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.rememberMe}>
          <input type="checkbox" />
          <label>Remember me</label>
        </div>

        <div className={styles.forgotPassword}>
          <Link href="/sign-in/forgot" className={styles.forgotPasswordLink}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className={styles.submitButton}>Sign In</button>
      </form>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <img src="/signup/Green and Black Minimalist Education Logo.png" alt="Logo" className={styles.logo} />
          </div>

          <div className={styles.footerLinks}>
            <div>
              <h4>Quick Links</h4>
              <a href="#">Contact Us</a>
              <a href="#">About Us</a>
            </div>
            <div>
              <h4>Others</h4>
              <a href="#">User FAQs</a>
              <a href="#">Legal</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms and Conditions</a>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.socialMedia}>
              <h4>Follow us</h4>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <img src="/signup/facebook.jpg" alt="Facebook" className={styles.socialIcon} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <img src="/signup/twitter.jpg" alt="Twitter" className={styles.socialIcon} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <img src="/signup/insta.jpg" alt="Instagram" className={styles.socialIcon} />
                </a>
              </div>
            </div>
            <div className={styles.newsletter}>
              <h4>Subscribe to our newsletter</h4>
              <input type="email" placeholder="Email Address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signin;
