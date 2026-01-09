import axios from "axios";
import {URL} from '../../Url/Url'

const login = async (userData) => {
  const response = await axios.post(`${URL}/api/NextStudio/admin/login`, userData);

  if (response.data && response.data.status === 'success' && response.data.data) {
    const { user, session } = response.data.data;
    
    // Store session data
    if (session) {
      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
      localStorage.setItem("expires_at", session.expires_at.toString());
    }
    
    // Store user data
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    // Store complete auth data for easy access
    const authData = {
      user,
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      } : null
    };
    localStorage.setItem("auth", JSON.stringify(authData));
    
    // Keep backward compatibility with 'token' key
    if (session?.access_token) {
      localStorage.setItem("token", session.access_token);
    }
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("token");
  localStorage.removeItem("auth");
};

const updatePassword = async (userData,token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }


  
  const response = await axios.patch(
    `${URL}/api/NextStudio/auth/password`,
    userData,config
  );

  return response.data;
};

const authService = {
  logout,
  login,
  updatePassword,
};

export default authService;
