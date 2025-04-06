"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';

const MemberDashboard = () => {
  const { userId } = useParams(); // Capture userId from the URL
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  console.log("User ID from URL (Member):", userId); // Debug: Check if userId is being set correctly

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return; // Exit if userId is not defined
      try {
        console.log(`Attempting to fetch notifications for userId (Member): ${userId}`); // Debug
        const response = await axios.get(`http://localhost:4000/notifications/user/${userId}`);
        console.log("Notifications fetched for member:", response.data); // Debug
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications for member:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read for member:", notificationId); 
      await axios.patch(`http://localhost:4000/notifications/${notificationId}/read`);
      setNotifications(notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error("Failed to mark notification as read for member:", error);
    }
  };

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Member Dashboard</h1>
      {name && <p>Welcome, {name}!</p>}
      <div className="notification-dropdown">
        <button onClick={toggleDropdown} className="notification-icon">
          🛎️
          {notifications.filter(notif => !notif.read).length > 0 && (
            <span className="badge">{notifications.filter(notif => !notif.read).length}</span>
          )}
        </button>

        {isOpen && (
          <div className="dropdown-content">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.read ? 'read' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  {notification.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
