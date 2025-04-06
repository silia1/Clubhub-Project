"use client"; // Enable client-side rendering

import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layout'; // Import the AdminLayout to reuse the sidebar
import styles from '../admin.module.css'; // Use your CSS for consistent styling
import { useSearchParams } from 'next/navigation'; // To get query params

interface UserProfile {
  name: string;
  email: string;
  idCard: string;
  role: string;
  phone?: string;
  address?: string;
  academicGrade?: string;
  linkedin?: string;
  instagram?: string;
}

const Profile = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from dynamic route
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // Extract name from query parameters

  const [profileData, setProfileData] = useState<UserProfile | null>(null); // Store profile info
  const [additionalInfo, setAdditionalInfo] = useState(false); // Toggle for additional info
  const [editableData, setEditableData] = useState<UserProfile | null>(null); // State to handle editing
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg'); // Default profile image

  // Fetch user profile info from the database
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:4000/auth/users/${userId}`);  // Updated route
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        setProfileData(data);
        if (data.profileImage) {
          setProfileImage(data.profileImage); // Set the profile image if available
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableData((prevData) => prevData ? { ...prevData, [name]: value } : null);
  };

  // Toggle additional info form and set editable data to current profile
  const handleAdditionalInfoToggle = () => {
    setAdditionalInfo((prevState) => !prevState);
    if (!editableData && profileData) {
      setEditableData(profileData); // Initialize editableData with profileData when showing the form
    }
  };

  const handleSaveAdditionalInfo = async () => {
    try {
      const res = await fetch(`http://localhost:4000/auth/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableData), // Send updated data
      });

      if (!res.ok) throw new Error('Failed to save profile info');
      alert('Profile updated successfully!');
      // Update the profile data with the latest changes
      setProfileData(editableData);
    } catch (err) {
      console.error('Error saving profile info:', err);
    }
  };

  return (
    <AdminLayout userId={userId} name={name}> {/* Pass userId and name to AdminLayout */}
      <header className={styles.header}>
        <h2>Profile Page (for {name})</h2> {/* Display user's name */}
        <div className={styles.adminInfo}>
          <span>{name || "Isabella A."}</span> {/* Display user name in sidebar */}
          {/* Use dynamically fetched profile image */}
          <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.formSection}>
        {/* Display personal details */}
        <div className={styles.personalDetails}>
          <h3 className={styles.sectionHeader}>Personal Details</h3>
          {profileData ? (
            <form className={styles.form}>
              <div className={styles.row}>
                <div>
                  <label>Name *</label>
                  <input type="text" value={profileData.name} readOnly />
                </div>
                <div>
                  <label>Email *</label>
                  <input type="email" value={profileData.email} readOnly />
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>ID Card *</label>
                  <input type="text" value={profileData.idCard} readOnly />
                </div>
                <div>
                  <label>Role *</label>
                  <input type="text" value={profileData.role} readOnly />
                </div>
              </div>
            </form>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* Toggle additional information */}
        <div className={styles.buttons}>
          <button className={styles.saveButton} onClick={handleAdditionalInfoToggle}>
            {additionalInfo ? "Cancel" : "Add Additional Info"}
          </button>
        </div>

        {/* Additional Info Form */}
        {additionalInfo && editableData && (
          <div className={styles.additionalInfo}>
            <h3>Add Additional Information</h3>
            <form className={styles.form}>
              <div className={styles.row}>
                <div>
                  <label>Phone</label>
                  <input type="text" name="phone" value={editableData.phone || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Address</label>
                  <h1></h1>
                  <textarea name="address" value={editableData.address || ""} onChange={handleInputChange} />
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <label>Academic Grade</label>
                  <input type="text" name="academicGrade" value={editableData.academicGrade || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <label>LinkedIn</label>
                  <input type="text" name="linkedin" value={editableData.linkedin || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Instagram</label>
                  <input type="text" name="instagram" value={editableData.instagram || ""} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.buttons}>
                <button type="button" className={styles.saveButton} onClick={handleSaveAdditionalInfo}>
                  Save Additional Info
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Profile;
