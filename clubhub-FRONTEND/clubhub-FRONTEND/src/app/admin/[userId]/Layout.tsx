import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

// Define the props type for the layout
interface AdminLayoutProps {
  children: ReactNode;
  userId: string; // Add userId as a prop
  name: string;   // Add name as a prop
  profileImage: string;  // Add profileImage as a prop
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userId, name, profileImage }) => { // Pass profileImage here
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

        {children} {/* Injects content dynamically */}
      </div>
    </div>
  );
};

export default AdminLayout;
