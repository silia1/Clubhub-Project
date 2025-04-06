"use client"; // Enable client-side rendering

import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; // To handle dynamic routing

const ApplyToClub = ({ params }: { params: { userId: string, clubId: string } }) => {
  const { userId, clubId } = params; // Extract userId and clubId from URL
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || ''; // Extract member's name from URL

  const router = useRouter();

  const [age, setAge] = useState('');
  const [activities, setActivities] = useState('');
  const [experience, setExperience] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null); // State for CV file

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Create a FormData object to hold the application data and the CV file
    const formData = new FormData();
    formData.append('age', age);
    formData.append('activities', activities);
    formData.append('experience', experience);
    formData.append('memberId', userId); // Add memberId to the formData
    if (cvFile) {
      formData.append('cv', cvFile); // Append the CV file
    }
  
    // Submit the application (you'll need to adjust the backend API accordingly)
    const res = await fetch(`http://localhost:4000/clubs/${clubId}/apply`, {
      method: 'POST',
      body: formData,
    });
  
    if (res.ok) {
      alert('Application submitted successfully!');
      router.push(`/member/${userId}?name=${name}`); // Redirect back to member's dashboard
    } else {
      alert('Failed to submit the application. Please try again.');
    }
  };

  return (
    <div style={styles.applyForm}>
      <h2>Apply to Club (ID: {clubId})</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={styles.row}>
          <div>
            <label>Age *</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Extracurricular Activities *</label>
            <textarea
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Describe your extracurricular activities"
              required
              style={styles.textarea}
            ></textarea>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Previous Club Membership Experience *</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Describe your previous club membership experience"
              required
              style={styles.textarea}
            ></textarea>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label>Upload CV *</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttons}>
          <button type="submit" style={styles.submitButton}>Submit Application</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  applyForm: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  row: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '16px',
    minHeight: '100px',
  },
  buttons: {
    textAlign: 'center' as 'center',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default ApplyToClub;
