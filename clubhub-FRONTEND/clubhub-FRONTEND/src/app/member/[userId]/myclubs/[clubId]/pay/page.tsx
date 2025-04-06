"use client"; // Enable client-side rendering

import React, { useState } from "react";
// Reuse the layout for members
import styles from '../../../member.module.css'; // Correct relative path to your CSS
import { useRouter } from 'next/navigation'; // To handle navigation
import AdminLayout from "../../../Layout";

const PayMembershipPage = ({ params }: { params: { userId: string, clubId: string } }) => {
  const { userId, clubId } = params; // Extract userId and clubId from the params
  const [amount, setAmount] = useState<number>(50); // Default membership fee amount
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<boolean>(false); // Success state
  const router = useRouter();

  // Function to handle payment submission
  const handlePayment = async () => {
    try {
      const res = await fetch(`http://localhost:4000/clubs/${clubId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to process payment');
      }
  
      setSuccess(true); // Set success state if payment is successful
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.message); // Handle error
    }
  };
  

  return (
    <AdminLayout userId={userId}> {/* Pass userId to the layout */}
      <h2>Pay Membership Fees for Club: {clubId}</h2>

      {/* Display error if any */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Payment form */}
      <div className={styles.paymentForm}>
        <label htmlFor="amount">Membership Fee:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        <button onClick={handlePayment} className={styles.payButton}>
          Pay Now
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className={styles.successMessage}>
          <p>Payment successful! You will now receive all services and updates for this club.</p>
          <button onClick={() => router.push(`/member/${userId}/myclubs`)}>
            Back to My Clubs
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default PayMembershipPage;
