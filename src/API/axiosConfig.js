import axios from 'axios';
import { message } from 'antd';

// Set up response interceptor to handle 401 errors globally for admin routes only
axios.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors only for admin routes
    if (error.response && error.response.status === 401) {
      // Check if current route is an admin route
      const currentPath = window.location.pathname;
      const isAdminRoute = currentPath.startsWith('/admindashboard') || currentPath.startsWith('/administrator');
      
      if (isAdminRoute) {
        // Show session expired message
        message.error('Session expired. Please login again.');
        
        // Clear all localStorage
        localStorage.clear();
        
        // Redirect to administrator login page
        // Use setTimeout to ensure message is shown before redirect
        setTimeout(() => {
          window.location.href = '/administrator';
        }, 1000);
      }
    }
    
    // Return the error so it can be handled by individual catch blocks if needed
    return Promise.reject(error);
  }
);

export default axios;
