import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientPosts } from "../../api/clientPosts";
import { TData } from "../../api/clientPosts";
import {
  clientPostComments,
  TComments,
  TDataPostComments,
} from "../../api/clientPostComments";

export type TPost = {
  userId: number;
  id: number;
  title: "string";
  body: "string";
  tags: [];
  reactions: number;
  comments?: TComments[];
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await clientPosts.get(
      `https://dummyjson.com/posts?limit=100`
    );

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

export const fetchPostComments = createAsyncThunk(
  "posts/fetchPostComments",
  async (postId: number) => {
    try {
      const response = await clientPostComments.get(
        `https://dummyjson.com/posts/${postId}/comments`
      );

      if (response && response.data) {
        const postsData: TDataPostComments = response.data;
        return { ...postsData };
      }
      throw new Error("Invalid response or data");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

type TPostsIntialState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  commentsStatus: "idle" | "loading" | "succeeded" | "failed";
  postsData: TData;
  error: null;
};
const initialState: TPostsIntialState = {
  status: "idle",
  commentsStatus: "idle",
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
        state.status = "succeeded";
        if (action.payload) {
          state.postsData = action.payload;
        }
      })
      .addCase(fetchPosts.rejected, (state, _) => {
        state.status = "failed";
      })
      .addCase(fetchPostComments.pending, (state, _) => {
        state.commentsStatus = "loading";
      })

      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.commentsStatus = "succeeded";
        if(action.payload.comments.length === 0) return 
        const post = state.postsData.posts.find(
          (post) => post.id === action.payload.comments[0].postId
        );
        if (post) {
          post.comments = action.payload.comments;
        }
      });
  },
});

export default postsSlice;

export const selectAllPosts = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.posts;
};

export const selectOnePost = (
  { posts }: { posts: TPostsIntialState },
  postId: number
) =>  posts.postsData.posts.find((post) => post.id === postId);


export const getPostsStatus = ({ posts }: { posts: TPostsIntialState }) =>
  posts.status;

export const getPostCommentsStatus = ({
  posts,
}: {
  posts: TPostsIntialState;
}) => {
  return posts.commentsStatus;
};
