import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:8000/signup', JSON.stringify(userData));
            alert(response.data.message);
            return response.data;
        } catch (error) {
            alert(error.response.data);

            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (loginData, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:8000/login', JSON.stringify(loginData));
        return response.data; // Assuming the API returns user data on successful login
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        status: 'idle',
    },
    reducers: {
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
            state.error = action.payload;
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
            state.error = action.payload;
        },
    },
});

export default userSlice.reducer;
