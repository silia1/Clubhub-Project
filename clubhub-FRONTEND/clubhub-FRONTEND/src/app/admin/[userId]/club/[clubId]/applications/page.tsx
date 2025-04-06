"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";

interface Application {
  _id: string;
  memberId: string;
  age: number;
  activities: string;
  experience: string;
  cvFile: string;
  status: string;
}

const ManageApplications = ({ params }: { params: { clubId: string } }) => {
  const { clubId } = params; // Extract clubId from the URL
  const [applications, setApplications] = useState<Application[]>([]); // To hold the applications
  const [error, setError] = useState<string | null>(null); // For catching errors

  // Fetch the applications from the backend for this club
  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:4000/clubs/${clubId}/applications`, {
        method: 'GET',
      });
  
      if (!res.ok) {
        console.error('Failed to fetch applications', res.status);
        setError(`Error: ${res.status}`);
        return;
      }
  
      const data = await res.json(); // Parse the returned data
      setApplications(data); // Set the applications in state
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message); // Set the error message
    }
  };
  
  // Fetch applications when the component mounts
  useEffect(() => {
    fetchApplications();
  }, [clubId]);

  // Handle accept/reject actions
  const handleApplicationAction = async (applicationId: string, status: string) => {
    try {
      // Update the application status (accept/reject)
      const res = await fetch('http://localhost:4000/clubs/manage-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status }),
      });

      if (res.ok) {
        // If successful, refresh the applications list
        alert(`Application ${status}`);
        fetchApplications();
      } else {
        alert('Failed to update the application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  return (
    <div style={styles.manageApplications}>
      <h2>Manage Applications for Club ID: {clubId}</h2>

      {/* Show an error message if there is any */}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.applicationsList}>
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} style={styles.applicationCard}>
              <p><strong>Member ID:</strong> {app.memberId || 'N/A'}</p>
              <p><strong>Age:</strong> {app.age || 'N/A'}</p>
              <p><strong>Activities:</strong> {app.activities || 'N/A'}</p>
              <p><strong>Experience:</strong> {app.experience || 'N/A'}</p>
              <p><strong>CV:</strong> <a href={`/uploads/cv/${app.cvFile}`} download>Download CV</a></p>
              <p><strong>Status:</strong> {app.status || 'pending'}</p>
              <div style={styles.buttons}>
                {app.status === 'pending' && (
                  <>
                    <button
                      style={styles.acceptButton}
                      onClick={() => handleApplicationAction(app._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleApplicationAction(app._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No applications found for this club.</p>
        )}
      </div>
    </div>
  );
};

// Styles using an inline object
const styles = {
  manageApplications: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    width: '80%',
    margin: '0 auto',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  applicationsList: {
    marginTop: '20px',
  },
  applicationCard: {
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  buttons: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default ManageApplications;
