import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./features/posts/postsSlice";
import usersSlice from "./features/users/usersSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    users: usersSlice.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
