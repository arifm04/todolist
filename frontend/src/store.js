import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import todoListReducer from './features/todoListSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    todoList: todoListReducer,
  },
});