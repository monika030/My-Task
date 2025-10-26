

import { createSlice } from '@reduxjs/toolkit';
import { usersData } from "../component/users";

const initialState = {
  list: usersData,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload);
    },
    editUser: (state, action) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
  },
});

export const { addUser, editUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;