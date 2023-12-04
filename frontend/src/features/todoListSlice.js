import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addTask = createAsyncThunk(
  'todos/todoInsert',
  async (taskData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8081/todoInsert', taskData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchTodos = createAsyncThunk(
  'todos/getTodolist',
  async (uid, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8081/getTodolist', uid);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'todos/updateTask',
  async (updateData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8081/updateStatus', updateData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteTask = createAsyncThunk('todos/deleteTask', async (task) => {
  const response = await axios.post('http://localhost:8081/deleteTodo', task);
  const data = await response.json();
  return data;
});

export const updateTask = createAsyncThunk('todos/updateTask', async (editTask) => {
  const response = await axios.post('http://localhost:8081/updateTodo', { editTask });
  const data = await response.json();
  return data;
});

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    fetchTodos: (state, action) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: {
    [addTask.pending]: (state) => {
      state.status = 'loading';
    },
    [addTask.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.tasks.push(action.payload.task);
    },
    [addTask.rejected]: (state, action) => {
      state.status = 'failed';
    },
    [fetchTodos.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    [fetchTodos.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});


export default todoListSlice.reducer;
