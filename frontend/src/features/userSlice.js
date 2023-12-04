import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8081/signup', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8081/login', loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = 'idle';
    },
  },
  extraReducers: {
    [signupUser.pending]: (state) => {
      state.status = 'loading';
    },
    [signupUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    [signupUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = action.payload;
    },
    [loginUser.pending]: (state) => {
      state.status = 'loading';
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.data = action.payload;
    },
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
