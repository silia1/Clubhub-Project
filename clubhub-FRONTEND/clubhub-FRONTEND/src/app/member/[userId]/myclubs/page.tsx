"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import styles from '../member.module.css'; // Import your CSS styles
import { useRouter } from 'next/navigation'; // To handle navigation
import AdminLayout from "../Layout"; // Import the AdminLayout

interface Club {
  _id: string;
  name: string;
  description: string;
}

const MyClubsPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from the route params
  const [acceptedClubs, setAcceptedClubs] = useState<Club[]>([]); // State to store accepted clubs
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter(); // To handle navigation

  // Fetch the accepted clubs for this user
  const fetchAcceptedClubs = async () => {
    try {
      const res = await fetch(`http://localhost:4000/clubs/members/${userId}/accepted-clubs`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch accepted clubs');
      }

      const data = await res.json();
      setAcceptedClubs(data); // Store fetched accepted clubs in state
    } catch (err: any) {
      console.error('Error fetching accepted clubs:', err);
      setError(err.message); // Handle error
    }
  };

  useEffect(() => {
    fetchAcceptedClubs(); // Fetch accepted clubs when the component mounts
  }, [userId]);

  // Function to handle payment redirection
  const handlePayment = (clubId: string) => {
    router.push(`/member/${userId}/myclubs/${clubId}/pay`); // Redirect to the correct payment page
  };

  return (
    <AdminLayout userId={userId}> {/* Pass userId to the layout */}
      <h2>My Clubs</h2>

      {/* Display error if any */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Display the list of accepted clubs with welcome messages */}
      <div className={styles.clubList}>
        {acceptedClubs.length > 0 ? (
          acceptedClubs.map((club) => (
            <div key={club._id} className={styles.clubCard}>
              <h3>Welcome to {club.name}!</h3>
              <p>You are now an active member of the {club.name} club. You will receive all updates and notifications related to this club. Stay tuned!</p>

              {/* Button to pay membership fees */}
              <button
                className={styles.payButton}
                onClick={() => handlePayment(club._id)}
              >
                Pay Membership Fees
              </button>
            </div>
          ))
        ) : (
          <p>You haven't been accepted into any clubs yet.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default MyClubsPage;
