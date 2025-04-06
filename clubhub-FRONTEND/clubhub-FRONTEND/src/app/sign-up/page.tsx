"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Signup.module.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Member');  // Default to 'Member'
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const signupData = { name, email, idCard, password, role: userType };

    try {
      const res = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const responseData = await res.json(); // Parse the JSON response

      if (res.ok) {
        const userId = responseData._id; // Correctly reference _id from the response
        const userName = responseData.name; // Get user's name from the response
        const userRole = responseData.role; // Get user's role

        // Redirect based on the user role, passing userId and name
        if (userRole === 'Administrator') {
          router.push(`/admin/${userId}?name=${userName}`); // Redirect to the admin dashboard with name
        } else {
          router.push(`/member/${userId}?name=${userName}`); // Redirect to the member dashboard with name
        }
      } else {
        alert(`Signup failed: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <header className={styles.header}>
        <img src="/signup/logo_clubhub.jpg" alt="Logo" className={styles.logo} />
        <button className={styles.homeButton}>HOME</button>
      </header>

      <h2 className={styles.title}>SIGN UP</h2>

      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <label>Sign up as:</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="Administrator"
              checked={userType === 'Administrator'}
              onChange={() => setUserType('Administrator')}
            />
            Administrator
          </label>
          <label>
            <input
              type="radio"
              value="Member"
              checked={userType === 'Member'}
              onChange={() => setUserType('Member')}
            />
            Member
          </label>
        </div>

        <div className={styles.inputField}>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <label>ID card:</label>
          <input
            type="text"
            name="idCard"
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
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

        <button type="submit" className={styles.submitButton}>Sign Up</button>
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

export default Signup;
