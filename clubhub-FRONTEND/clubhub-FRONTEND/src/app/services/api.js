import axios from 'axios';

// Base URL of the backend API (replace with your actual API URL)
const API_URL = 'http://localhost:4000/auth';

// Function to sign up a user
export const signup = async (signupData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, signupData);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error.response.data;
  }
};

// Function to log in a user
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    // You would typically save the token here (in localStorage or cookies)
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response.data;
  }
};

// Function to change password (protected route, needs a token)
export const changePassword = async (changePasswordData) => {
  try {
    const token = localStorage.getItem('accessToken'); // Get token from storage
    const response = await axios.put(`${API_URL}/change-password`, changePasswordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error during password change:', error);
    throw error.response.data;
  }
};
