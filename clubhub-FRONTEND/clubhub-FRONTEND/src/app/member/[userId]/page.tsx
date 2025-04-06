"use client"; // This enables the use of React hooks like useState
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Use this hook to get query params
import styles from './member.module.css'; // Import your CSS

const Dashboard = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from the dynamic route
  const searchParams = useSearchParams(); // Access the query parameters
  const name = searchParams.get("name"); // Get 'name' from query string
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');


  // Fetch the profile image when the component loads
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
              <Link href={`/member/${userId}?name=${name}`}> {/* Add name to the URL */}
                <img src="/admin/dashboardicon.png" alt="Dashboard" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/profile?name=${name}`}> {/* Add name to the URL */}
                <img src="/admin/profileicon.png" alt="Profile" /> Profile
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/club?name=${name}`}> {/* Add name to the URL */}
                <img src="/admin/clubicon.png" alt="Club" /> Clubs
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/notifications?name=${name}`}> {/* Add name to the URL */}
                <img src="/admin/notificon.png" alt="Notifications" /> Notifications
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/settings?name=${name}`}> {/* Add name to the URL */}
                <img src="/admin/settingicon.png" alt="Settings" /> Settings
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/myclubs?name=${name}`}> {/* Add My Clubs section */}
                <img src="/admin/clubicon.png" alt="My Clubs" /> My Clubs
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/events?name=${name}`}> {/* Add My Clubs section */}
                <img src="/admin/clubicon.png" alt="events" /> events
              </Link>
            </li>
            <li>
              <Link href={`/member/${userId}/chat?name=${name}`}> {/* Add My Clubs section */}
                <img src="/admin/clubicon.png" alt="chat" /> chat
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome {name}!</h2> {/* Display user name */}
          <div className={styles.adminInfo}>
            <span>{name}</span> {/* Display user name in sidebar */}
            <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
          </div>
        {/* Upload form */}
        <div className={styles.uploadSection}>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleFileUpload}>Upload Profile Image</button>
          </div>
        </header>

        <div className={styles.formSection}>
          {/* Default content for the dashboard */}
          <h3>Dashboard Overview</h3>
          <p>This is the member dashboard. Here you can manage all the features.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
