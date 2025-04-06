"use client"; // Enable client-side rendering

import React, { useEffect, useState } from 'react';
import AdminLayout from '../Layout'; // Import the AdminLayout to reuse the sidebar
import styles from '../member.module.css'; // Use your CSS for consistent styling
import { useSearchParams } from 'next/navigation'; // To get query params

const Settings = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from dynamic route
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // Extract name from query parameters

  const [email, setEmail] = useState(""); // State for email
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success message state
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/auth/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    }
  };
// Fetch profile image when component loads
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/auth/users/${userId}`);
        const data = await res.json();
        if (data.profileImage) {
          setProfileImage(data.profileImage); // Set the profile image
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };
    fetchProfileData();
  }, [userId]);

  return (
    <AdminLayout userId={userId} name={name}> {/* Pass userId and name to AdminLayout */}
      <header className={styles.header}>
        <h2>Settings Page (for {name})</h2> {/* Display user's name */}
        <div className={styles.adminInfo}>
          <span>{name || "Isabella A."}</span> {/* Fallback if no name is available */}
          <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
        </div>
      </header>
      
      <div className={styles.formSection}>
  <h3>Modify Account</h3>
  <form className={styles.form} onSubmit={handleSave}>
    {error && <p className={styles.error}>{error}</p>}
    {success && <p className={styles.success}>{success}</p>}

    <div className={styles.row}>
      <div>
        <label>Name *</label>
        <input 
          type="text" 
          placeholder={name || "User"} 
          value={name || ""} // Display username in input field
          disabled // Prevent modification of the name field
        />
      </div>
      <div>
        <label>Email *</label>
        <input 
          type="email" 
          placeholder={`${name || "User"}@gmail.com`} // Default to name@gmail.com if no email is entered
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email
        />
      </div>
    </div>

    <div className={styles.row}>
      <div>
        <label>New Password *</label>
        <input 
          type="password" 
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} // Update password
        />
      </div>
    </div>

    <div className={styles.buttons}>
      <button type="submit" className={styles.saveButton}>Save Changes</button>
    </div>
  </form>
</div>

    </AdminLayout>
  );
};

export default Settings;
