"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import AdminLayout from '../Layout'; // Import the AdminLayout to reuse the sidebar
import { useSearchParams } from 'next/navigation'; // Use this for URL parameters
import styles from '../admin.module.css'; // Use your CSS for consistent styling

const UploadFiles = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from the dynamic route
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // Extract name from the query parameters
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');
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
        <h2>Upload Files</h2>
        <div className={styles.adminInfo}>
          <span>{name} </span> {/* Display userId and name */}
          <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.uploadSection}>
        {/* File Upload Box */}
        <div className={styles.uploadBoxContainer}>
          <h3>File Upload</h3>
          <div className={styles.uploadBox}>
            <p>Upload the file by dragging or selecting a file from browser. Accepts only .pdf file types.</p>
            <input type="file" accept=".pdf" />
          </div>
        </div>

        {/* File Details */}
        <div className={styles.fileDetails}>
          <h3>More Details</h3>
          <table className={styles.fileTable}>
            <thead>
              <tr>
                <th>Upload Date</th>
                <th>Batch ID</th>
                <th>Subject</th>
                <th>Success</th>
                <th>Failed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="date" /></td>
                <td><input type="text" placeholder="Batch ID" /></td>
                <td><input type="text" placeholder="Subject" /></td>
                <td><input type="checkbox" /></td>
                <td><input type="checkbox" /></td>
                <td>
                  <button className={styles.deleteButton}>Delete</button>
                  <button className={styles.submitButton}>Submit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadFiles;
