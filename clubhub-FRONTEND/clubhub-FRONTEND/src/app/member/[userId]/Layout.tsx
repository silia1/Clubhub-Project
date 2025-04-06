import React, { ReactNode } from 'react'; // Import ReactNode for typing children
import Link from 'next/link';
import styles from './member.module.css'; // Import your CSS

// Define the props type for the layout
interface AdminLayoutProps {
  children: ReactNode;
  userId: string; // Add userId as a prop
  name: string;   // Add name as a prop
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userId, name }) => { // Pass userId and name here
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
        {children} {/* Injects content dynamically */}
      </div>
    </div>
  );
};

export default AdminLayout;
