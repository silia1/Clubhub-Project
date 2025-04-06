"use client"; // Enable client-side features like useState

import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout"; // Import the AdminLayout to reuse the sidebar
import { useSearchParams } from "next/navigation";
import styles from "../admin.module.css"; // Ensure the path is correct

interface EventData {
  _id?: string;
  name: string;
  date: string;
  place: string;
  clubId: string;
}

interface Member {
  _id?: string; // Added for consistency with the member structure
  name: string;
}

const Event = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  // State for form visibility, event storage, and interested members
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [interestedMembers, setInterestedMembers] = useState<Member[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const eventData: Omit<EventData, "_id"> = {
      name: formData.get("name")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      place: formData.get("place")?.toString() || "",
      clubId: formData.get("clubId")?.toString() || "",
    };

    try {
      const response = await fetch(`http://localhost:4000/events?adminId=${userId}&name=${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        const createdEvent: EventData = { ...eventData, _id: result._id };
        setEvents((prevEvents) => [...prevEvents, createdEvent]);

        const eventDate = new Date(eventData.date).getDate();
        setHighlightedDays((prev) => [...prev, eventDate]);
        setShowForm(false);
      } else {
        alert("Failed to create event: " + result.message);
      }
    } catch (error: any) {
      alert("Error creating event: " + error?.message || error);
    }
  };

  // Function to delete an event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedEvent = events.find((event) => event._id === eventId);
        if (deletedEvent) {
          const eventDate = new Date(deletedEvent.date).getDate();
          setHighlightedDays((prevDays) => prevDays.filter((day) => day !== eventDate));
        }

        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } else {
        const result = await response.json();
        alert("Failed to delete event: " + result.message);
      }
    } catch (error: any) {
      alert("Error deleting event: " + error?.message || error);
    }
  };

  // Function to fetch all events
  const fetchEvents = async () => {
    if (!userId || !name) return;
    try {
      const response = await fetch(`http://localhost:4000/events?adminId=${userId}&name=${name}`);
      const data = await response.json();
      if (response.ok) {
        setEvents(data);

        const existingHighlightedDays = data.map((event) => new Date(event.date).getDate());
        setHighlightedDays(existingHighlightedDays);
      } else {
        alert("Failed to fetch events: " + data.message);
      }
    } catch (error: any) {
      alert("Error fetching events: " + error?.message || error);
    }
  };

  // Function to fetch interested members for a specific event and display in UI
  const handleViewInterestedMembers = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}/interested-members`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching interested members: ${errorText}`);
      }
  
      const members = await response.json();
      console.log("Fetched members:", members); // Debugging: Check data structure
      setInterestedMembers(members); // Update state with the list of interested members
      setShowMembers(true); // Show the interested members section
    } catch (error) {
      console.error("Error fetching interested members:", error);
      alert("Failed to load interested members.");
    }
  };
  

  // Load events when component mounts
  useEffect(() => {
    fetchEvents();
  }, [userId, name]);

  return (
    <AdminLayout userId={userId} name={name}>
      <div>
        <header className={styles.header}>
          <h2>Events Page</h2>
          <div className={styles.adminInfo}>
            <span>{name}</span>
            <img src="/admin/adminpicture.jpg" alt="Admin Avatar" className={styles.adminAvatar} />
          </div>
        </header>

        <div className={styles.eventSection}>
          {/* Calendar Section */}
          <div className={styles.calendar}>
            <h3>Calendar</h3>
            <div className={styles.calendarHeader}>
              <div className={styles.dateSelector}>
                <select>
                  <option>January</option>
                  <option>February</option>
                  {/* Add other months here */}
                </select>
                <select>
                  <option>2021</option>
                  <option>2022</option>
                  {/* Add other years here */}
                </select>
              </div>
              <button className={styles.newEventButton} onClick={() => setShowForm(true)}>
                + Create Event
              </button>
            </div>

            <div className={styles.calendarGrid}>
              {[...Array(31)].map((_, index) => {
                const day = index + 1;
                return (
                  <div
                    key={index}
                    className={highlightedDays.includes(day) ? styles.activeDay : styles.day}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Creation Form */}
          {showForm && (
  <form onSubmit={handleSubmit} className={styles.eventForm}>
    <h3>Create Event</h3>
    <input type="text" name="name" placeholder="Event Name" required />
    <input type="date" name="date" required />
    <input type="text" name="place" placeholder="Event Place" required />
    <input type="text" name="clubId" placeholder="Club ID" required />
    <button type="submit">Submit</button>
    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
  </form>
)}


          {/* Event List */}
          <div className={styles.eventList}>
            <h3 className={styles.sectionTitle}>Events</h3>
            {events.length > 0 ? (
              <div className={styles.eventGrid}>
                {events.map((event) => (
                  <div key={event._id} className={styles.eventItem}>
                    <div className={styles.eventDetails}>
                      <h4 className={styles.eventName}>{event.name}</h4>
                      <p className={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</p>
                      <p className={styles.eventPlace}>{event.place}</p>
                    </div>
                    <div className={styles.eventActions}>
                      <button className={styles.viewButton} onClick={() => handleViewInterestedMembers(event._id)}>View Interested</button>
                      <button className={styles.deleteButton} onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events found.</p>
            )}
          </div>

          {/* Interested Members Section */}
          {showMembers && (
  <div className={styles.membersList}>
    <h3>Interested Members</h3>
    {interestedMembers.length > 0 ? (
      interestedMembers.map((member) => (
        <div key={member._id} className={styles.memberItem}>
          {/* Access memberId.name to display the name */}
          {member.memberId?.name || "Name not available"}
        </div>
      ))
    ) : (
      <p>No members interested.</p>
    )}
    <button onClick={() => setShowMembers(false)}>Close</button>
  </div>
)}

        </div>
      </div>
    </AdminLayout>
  );
};

export default Event;
