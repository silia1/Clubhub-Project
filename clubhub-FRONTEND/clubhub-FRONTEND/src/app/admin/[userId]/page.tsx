"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from './admin.module.css';

const Dashboard = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg'); // Default image

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`http://localhost:4000/auth/upload-profile-image/${userId}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.imageUrl) {
      setProfileImage(data.imageUrl);  // Update the displayed image
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/signup/Green and Black Minimalist Education Logo.png" alt="Logo" />
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href={`/admin/${userId}?name=${name}`}>
                <img src="/admin/dashboardicon.png" alt="Dashboard" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/profile?name=${name}`}>
                <img src="/admin/profileicon.png" alt="Profile" /> Profile
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/club?name=${name}`}>
                <img src="/admin/clubicon.png" alt="Club" /> Club
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/event?name=${name}`}>
                <img src="/admin/eventicon.png" alt="Event" /> Event
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/notifications?name=${name}`}>
                <img src="/admin/notificon.png" alt="Notifications" /> Notifications
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/upload-files?name=${name}`}>
                <img src="/admin/uploadicon.png" alt="Upload Files" /> Upload Files
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/chat?name=${name}`}>
                <img src="/admin/chaticon.png" alt="Chat" /> Chat
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/settings?name=${name}`}>
                <img src="/admin/settingicon.png" alt="Settings" /> Settings
              </Link>
            </li>
            <li>
              <Link href={`/admin/${userId}/members?name=${name}`}>
                <img src="/admin/membericon.png" alt="Members" /> Members
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome {name}!</h2>
          <div className={styles.adminInfo}>
            {/* Display dynamically fetched profile image */}
            <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
            <span>{name}</span>
          </div>
        </header>

        <div className={styles.formSection}>
          <h3>Dashboard Overview</h3>
          <p>This is the admin dashboard. Here you can manage all the features.</p>
          
          {/* Upload form */}
          <div className={styles.uploadSection}>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleFileUpload}>Upload Profile Image</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
