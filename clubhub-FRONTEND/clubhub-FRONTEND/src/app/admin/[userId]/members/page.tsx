"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import AdminLayout from '../Layout';
import styles from '../admin.module.css';

interface Club {
  _id: string;
  name: string;
  description: string;
  acceptedMembers: Member[];
}

interface Member {
  _id: string;
  memberId: string;
  age: number;
  activities: string;
  experience: string;
  cvFile: string;
  status: string;
  payment: string;
}

const MembersPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/auth/users/${userId}`);
        const data = await res.json();
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };
    fetchProfileData();
  }, [userId]);

  const fetchClubsAndMembers = async () => {
    try {
      const res = await fetch(`http://localhost:4000/clubs/${userId}/members`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch clubs and members');
      }

      const data = await res.json();
      setClubs(data);
    } catch (err: any) {
      console.error('Error fetching clubs and members:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchClubsAndMembers();
  }, [userId]);

  return (
    <AdminLayout userId={userId}>
      <header className={styles.header}>
        <h2 id={`header-${userId}`}>Clubs and Accepted Members</h2>
        <div className={styles.adminInfo}>
          <img src={profileImage} alt="Admin Avatar" id={`admin-avatar-${userId}`} className={styles.adminAvatar} />
        </div>
      </header>

      {error && <p id={`error-${userId}`} className={styles.error}>{error}</p>}

      <div className={styles.clubList}>
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <div key={club._id} id={`club-${club._id}`} className={styles.clubCard}>
              <h3 id={`club-name-${club._id}`} className={styles.clubName}>{club.name}</h3>
              <p id={`club-description-${club._id}`} className={styles.clubDescription}>{club.description}</p>

              <h4 id={`members-header-${club._id}`} className={styles.membersHeader}>Accepted Members:</h4>
              <div className={styles.membersList}>
                {club.acceptedMembers.length > 0 ? (
                  club.acceptedMembers.map((member) => (
                    <div key={member._id} id={`mem-${member._id}`} className={styles.memberCard}>
                      <p id={`mem-id-${member._id}`}><strong>Member ID:</strong> {member.memberId}</p>
                      <p id={`mem-age-${member._id}`}><strong>Age:</strong> {member.age}</p>
                      <p id={`mem-activities-${member._id}`}><strong>Activities:</strong> {member.activities}</p>
                      <p id={`mem-experience-${member._id}`}><strong>Experience:</strong> {member.experience}</p>
                      <p id={`mem-cv-${member._id}`}><strong>CV:</strong> <a href={`/uploads/cv/${member.cvFile}`} download>Download CV</a></p>
                      <p id={`mem-payment-${member._id}`}><strong>Payment Status:</strong> {member.payment === 'yes' ? 'Paid' : 'Not Paid'}</p>
                    </div>
                  ))
                ) : (
                  <p id={`no-members-${club._id}`} className={styles.noMembers}>No accepted members found for this club.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p id={`no-clubs-${userId}`} className={styles.noClubs}>No clubs found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default MembersPage;
