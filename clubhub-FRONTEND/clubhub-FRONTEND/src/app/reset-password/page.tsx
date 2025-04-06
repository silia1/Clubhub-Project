"use client"; // Ensure this is a client-side component

import { useSearchParams } from 'next/navigation'; // Use to access the query parameters
import { useState } from 'react';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams(); // Get query parameters
  const token = searchParams.get('token'); // Extract the 'token' query parameter from the URL

  const [newPassword, setNewPassword] = useState(''); // Store the new password entered by the user
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  // Function to handle password reset
  const handleResetPassword = async () => {
    setIsLoading(true); // Set loading state to true while request is being made

    try {
      // Send new password and reset token to backend
      const res = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, ResetToken: token }), // Token from URL and new password
      });

      if (res.ok) {
        alert('Password successfully reset!'); // Notify user of success
      } else {
        const data = await res.json();
        alert(`Error resetting password: ${data.message}`); // Handle any errors
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.'); // Catch and display any unexpected errors
    } finally {
      setIsLoading(false); // Remove loading state after request completes
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={handleResetPassword} disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </div>
  );
};

export default ResetPasswordPage;
