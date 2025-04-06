"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import AdminLayout from '../Layout'; // Import the AdminLayout to reuse the sidebar
import styles from '../admin.module.css'; // Use your CSS for consistent styling
import { useRouter, useSearchParams } from 'next/navigation'; // To get query params and router

const Club = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract adminId (userId) from dynamic route
  const searchParams = useSearchParams(); // Access the query parameters
  const name = searchParams.get("name"); // Get 'name' from query string

  const [clubs, setClubs] = useState([]); // Store the list of clubs created by the admin
  const [showForm, setShowForm] = useState(false); // To control when to show the form
  const [pending, setPending] = useState(false);   // To show the pending message
  const [numberOfPeople, setNumberOfPeople] = useState(''); // Store number of people
  const [clubName, setClubName] = useState(''); // Store the club name
  const [description, setDescription] = useState(''); // Store the club description
  const [error, setError] = useState(''); // Store error messages
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');

  const router = useRouter(); // Initialize router for navigation

  // Fetch clubs created by this admin from the API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/clubs/admin?adminId=${userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await res.json();
        console.log('Fetched Clubs:', data); // Log fetched clubs here
        setClubs(data);
      } catch (err) {
        console.error('Error fetching clubs:', err.message);
        setError('Could not load clubs.');
      }
    };
  
    fetchClubs();
  }, [userId]);
  
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

  const handleCreateClub = () => {
    setShowForm(true); // Show the form when the button is clicked
    setPending(false); // Reset the pending status
    setError('');      // Reset the error message
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent page reload
    
    const numPeople = parseInt(numberOfPeople);
    
    // Validation: Check if number of people is positive and <= 100
    if (numPeople < 1 || numPeople > 100) {
      setError('Number of members must be between 1 and 100.');
      return; // Stop form submission if the validation fails
    }

    // Create the club by sending a POST request to the API
    try {
      const res = await fetch('http://localhost:4000/clubs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clubName,  // Use the clubName state variable
          description: description,  // Use the description state variable
          adminId: userId,
          numberOfPeople: numPeople
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create the club');
      }

      const createdClub = await res.json();
      // Refresh club list
      setClubs((prevClubs) => [...prevClubs, createdClub]);
      setPending(true);    // Show pending message after submitting the form
      setShowForm(false);  // Hide the form after submission
      setError('');        // Reset the error message
    } catch (err) {
      console.error('Error creating club:', err.message);
      setError('Failed to create the club.');
    }
  };

  // Update handleApply function to navigate to the correct applications page
  const handleApply = (clubId: string) => {
    // Construct the URL with userId and clubId and navigate to /applications
    window.location.href = `/admin/${userId}/club/${clubId}/applications?name=${name}`;
  };

  return (
    <AdminLayout userId={userId} name={name}> {/* Pass the userId and name to AdminLayout */}
      <header className={styles.header}>
        <h2>Club Page</h2>
        <div className={styles.adminInfo}>
          <span>{name} </span> {/* Display user name and userId */}
          <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.formSection}>
        {/* Create New Club Button */}
        {!showForm && !pending && (
          <button className={styles.createClubButton} onClick={handleCreateClub}>
            Create New Club
          </button>
        )}

        {/* Display Form if 'Create New Club' Button is Clicked */}
        {showForm && (
          <div className={styles.clubDetails}>
            <h3 className={styles.sectionHeader}>Create New Club</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div>
                  <label>Name of Club </label>
                  <input
                    type="text"
                    placeholder="Enter club name"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}  // Bind to clubName state
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Description of Club </label>
                  <textarea
                    placeholder="Enter club description"
                    value={description}  // Bind to description state
                    onChange={(e) => setDescription(e.target.value)}  // Bind description
                    required
                  ></textarea>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Number of People </label>
                  <input
                    type="number"
                    placeholder="Enter number of members"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    required
                    min="1" // Ensure minimum value is 1
                    max="100" // Ensure maximum value is 100
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>} {/* Display error message if validation fails */}

              <div className={styles.buttons}>
                <button type="submit" className={styles.saveButton}>Submit Offer</button>
              </div>
            </form>
          </div>
        )}

        {/* Display Pending Message after Form Submission */}
        {pending && (
          <div className={styles.pendingMessage}>
            <p>Your club offer is pending, waiting for member applications.</p>
          </div>
        )}

        {/* List of created clubs by this admin */}
        <div className={styles.clubList}>
          <h3>Clubs Created:</h3>
          {clubs.length > 0 ? (
            clubs.map((club) => (
              <div key={club._id} className={styles.clubCard}> {/* Change 'id' to '_id' */}
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                {/* Use optional chaining to prevent errors */}
                <p><strong>Members:</strong> {club.currentMembers ?? 0}/{club.numberOfPeople ?? 0}</p>
                <button className={styles.applyButton} onClick={() => handleApply(club._id)}>
                  Manage Applications
                </button>
              </div>
            ))
          ) : (
            <p>No clubs created yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Club;
