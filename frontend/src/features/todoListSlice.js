import { createSlice } from '@reduxjs/toolkit';

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState: {
    tasks: [],
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
  },
});

export const { addTask } = todoListSlice.actions;

export default todoListSlice.reducer;
