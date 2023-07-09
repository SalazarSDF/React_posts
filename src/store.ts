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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
