import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientPosts } from "../../api/clientPosts";
import { TData } from "../../api/clientPosts";

export type TPost = {
  userId: number;
  id: number;
  title: "string";
  body: "string";
  tags: [];
  reactions: number;
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await clientPosts.get(`https://dummyjson.com/posts?limit=5`);

    if (response && response.data) {
      const postsData: TData = response.data;
      return { ...postsData };
    }
    throw new Error("Invalid response or data");
  } catch (error) {
    console.error(error);
    throw error;
  }
});

type TPostsIntialState = {
  status: "idle" | "loading" | "succeeded";
  postsData: TData;
  error: null;
};
const initialState: TPostsIntialState = {
  status: "idle",
  postsData: { posts: [], total: 0, skip: 0, limit: 0 },
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, _) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log(action, "action");
        state.status = "succeeded";
        if (action.payload) {
          state.postsData = action.payload;
        }
      });
  },
});

export default postsSlice;

export const selectAllPosts = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.posts;
};

export const getPostsStatus = ({ posts }: { posts: TPostsIntialState }) =>
  posts.status;
