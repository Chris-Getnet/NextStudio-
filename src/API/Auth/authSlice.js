import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authServices'

// Get auth data from localStorage
const getStoredAuth = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      return JSON.parse(authData);
    }
    // Fallback to old format for backward compatibility
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (user && token) {
      return {
        user: JSON.parse(user),
        session: {
          access_token: token,
          refresh_token: localStorage.getItem('refresh_token') || null,
          expires_at: localStorage.getItem('expires_at') || null
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing stored auth data:', error);
    return null;
  }
}

const storedAuth = getStoredAuth();

const initialState = {
  user: storedAuth?.user || null,
  session: storedAuth?.session || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  messages: '',
}

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const messages =
        (error.response && error.response.data && error.response.data.message) ||
        (error.response && error.response.data && error.response.data.messages) ||
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.messages ||
        error.toString()
      return thunkAPI.rejectWithValue(messages)
    }
  })

export const updatePassword = createAsyncThunk('auth/updatePassword', async (user, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.session?.access_token || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    return await authService.updatePassword(user, token)
    
  } catch (error) {
    const messages =
      (error.response && error.response.data && error.response.data.messages) ||
      error.messages ||
      error.toString()
    return thunkAPI.rejectWithValue(messages)
  }
})

  export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
  })
  
  export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.messages = ''
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          
          // Extract user and session from Supabase response
          if (action.payload && action.payload.status === 'success' && action.payload.data) {
            state.user = action.payload.data.user || null
            state.session = action.payload.data.session || null
            state.messages = action.payload.message || 'Login successful'
          } else {
            // Fallback for other response formats
            state.user = action.payload?.user || action.payload || null
            state.messages = action.payload?.message || 'Login successful'
          }
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.messages = action.payload
          state.user = null
          state.session = null
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null
          state.session = null
        })
        .addCase(updatePassword.pending, (state) => {
          state.isLoading = true
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload
        })
        .addCase(updatePassword.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.messages = action.payload
        })
    },
  })
  
  export const { reset } = authSlice.actions
  export default authSlice.reducer
  