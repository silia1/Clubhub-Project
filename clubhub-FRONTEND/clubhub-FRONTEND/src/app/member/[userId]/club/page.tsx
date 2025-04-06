"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import styles from '../member.module.css'; // Use your CSS for consistent styling
import { useRouter, useSearchParams } from 'next/navigation'; // To handle dynamic routing
import MemberLayout from '../Layout'; // Import your Layout component

interface Club {
  _id: string;  // Assuming the backend returns _id instead of id
  name: string;
  description: string;
  category: string;
  numberOfPeople: number;
  currentMembers: number;
}

const Clubs = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from dynamic route
  const searchParams = useSearchParams(); // Access query parameters
  const userName = searchParams.get("name") || ''; // Get 'name' from query string, default to empty if null
  const router = useRouter(); // Initialize router for navigation

  const [clubs, setClubs] = useState<Club[]>([]); // Store all clubs
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]); // Store filtered clubs
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [categoryFilter, setCategoryFilter] = useState(''); // Category filter input

  // Fetch club data from the API
  useEffect(() => {
    const fetchClubs = async () => {
      const res = await fetch("http://localhost:4000/clubs"); // Fetch all clubs
      const data = await res.json();
      setClubs(data); // Store all clubs
      setFilteredClubs(data); // Initially set filteredClubs as all clubs
    };

    fetchClubs();
  }, []);

  // Handle search and filter changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update search term
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value); // Update category filter
  };

  // Filter clubs based on search and category
  useEffect(() => {
    const filtered = clubs.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? club.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredClubs(filtered);
  }, [searchTerm, categoryFilter, clubs]);

  // Handle apply button click
  const handleApply = (clubId: string) => {
    router.push(`/member/${userId}/club/${clubId}?name=${userName}`); // Navigate to the club-specific page
  };

  return (
    <MemberLayout userId={userId} name={userName}> {/* Pass userId and userName to MemberLayout */}
      <header className={styles.header}>
        <h2>Club Offers for {userName}</h2> {/* Display user's name */}
      </header>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by club name..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />

        <select value={categoryFilter} onChange={handleCategoryChange} className={styles.filterSelect}>
          <option value="">All Categories</option>
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>
      </div>

      {/* Display the Club Offers */}
      <div className={styles.clubList}>
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <div key={club._id} className={styles.clubCard}>
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <p><strong>Category:</strong> {club.category}</p>
              <p><strong>Members:</strong> {club.currentMembers}/{club.numberOfPeople}</p>
              <button
                className={styles.applyButton}
                onClick={() => handleApply(club._id)}
                disabled={club.currentMembers >= club.numberOfPeople} // Disable if club is full
              >
                {club.currentMembers >= club.numberOfPeople ? 'Club Full' : 'Apply to Join'}
              </button>
            </div>
          ))
        ) : (
          <p>No clubs found matching your criteria.</p>
        )}
      </div>
    </MemberLayout>
  );
};

export default Clubs;
