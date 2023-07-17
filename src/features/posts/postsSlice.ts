import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientPosts } from "../../api/clientPosts";
import {
  clientPostComments,
  TComments,
  TDataPostComments,
} from "../../api/clientPostComments";

export type TPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: number;
  comments?: TComments[];
  selected?: boolean;
  favorite?: boolean;
  userName?: string;
};

export type TPostData = {
  posts: TPost[];
  total: number;
  skip: number;
  limit: number;
  filterOptions?: {
    filterByPostName?: string;
    filterByUserName?: number | "all";
    filterByFavorites?: boolean;
  };
  sortOption?:
    | "idAsc"
    | "idDesc"
    | "titleAsc"
    | "titleDesc"
    | "userAsc"
    | "userDesc"
    | "FavFirst"
    | "FavLast";
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (url: string) => {
    try {
      const response = await clientPosts.get(url);

      if (response && response.data) {
        const postsData: TPostData = response.data;
        return { ...postsData };
      }
      throw new Error("Invalid response or data");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

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
  postsData: TPostData;
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
  reducers: {
    selectPostHandler(state, action: PayloadAction<{ postId: number }>) {
      const { postId } = action.payload;
      const existingPost = state.postsData.posts.find(
        (post) => post.id === postId
      );
      if (existingPost) {
        const newExistingPostValue =
          existingPost.selected === undefined ? true : !existingPost.selected;
        existingPost.selected = newExistingPostValue;
      }
    },
    favoritePostHandler(state, action: PayloadAction<{ postId: number }>) {
      const { postId } = action.payload;
      const existingPost = state.postsData.posts.find(
        (post) => post.id === postId
      );
      if (existingPost) {
        const newExistingPostValue =
          existingPost.favorite === undefined ? true : !existingPost.favorite;
        existingPost.favorite = newExistingPostValue;
      }
    },
    deleteSelectedPosts(state) {
      const postsIdsToDelete = state.postsData.posts.map((post) => {
        if (post.selected === true) {
          return post.id;
        }
      });
      state.postsData.posts = state.postsData.posts.filter(
        (post) => !postsIdsToDelete.includes(post.id)
      );
    },

    setFavoriteSelectedPosts(state) {
      const postsIdsToFavorite = state.postsData.posts.map((post) => {
        if (post.selected === true) {
          return post.id;
        }
      });
      state.postsData.posts = state.postsData.posts.map((post) => {
        return postsIdsToFavorite.includes(post.id)
          ? { ...post, favorite: true, selected: false }
          : post;
      });
    },
    changeFilterOption(
      state,
      action: PayloadAction<{ option: TPostData["filterOptions"] }>
    ) {
      if (!action.payload.option) return;

      const { filterByPostName, filterByUserName, filterByFavorites } =
        action.payload.option;

      if (typeof filterByPostName === "string") {
        state.postsData.filterOptions = {
          ...state.postsData.filterOptions,
          filterByPostName: filterByPostName,
        };
      } else if (filterByUserName) {
        state.postsData.filterOptions = {
          ...state.postsData.filterOptions,
          filterByUserName: filterByUserName,
        };
      } else if (typeof filterByFavorites === "boolean") {
        state.postsData.filterOptions = {
          ...state.postsData.filterOptions,
          filterByFavorites: filterByFavorites,
        };
      }
    },
    changeSortOption(
      state,
      action: PayloadAction<{ option: TPostData["sortOption"] }>
    ) {
      if (!action.payload.option) return;
      state.postsData.sortOption = action.payload.option;
    },
    changePostBodyUserAndTitle(
      state,
      action: PayloadAction<{
        newPostBody: string;
        postId: number;
        newPostUser: string;
        newPostTitle: string;
      }>
    ) {
      const existingPost = state.postsData.posts.find(
        (post) => post.id === action.payload.postId
      );
      if (existingPost) {
        existingPost.body = action.payload.newPostBody;
        existingPost.userName = action.payload.newPostUser;
        existingPost.title = action.payload.newPostTitle;
      }
    },

    postAdded(
      state,
      action: PayloadAction<{
        title: string;
        body: string;
        userId: number;
      }>
    ) {
      const newPost: TPost = {
        ...action.payload,
        id: Math.random() * state.postsData.posts.length + 100,
        tags: [],
        reactions: 0,
      };
      state.postsData.posts.push(newPost);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.postsData = action.payload;
        }
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchPostComments.pending, (state) => {
        state.commentsStatus = "loading";
      })

      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.commentsStatus = "succeeded";
        if (action.payload.comments.length === 0) return;
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

export const {
  selectPostHandler,
  favoritePostHandler,
  deleteSelectedPosts,
  setFavoriteSelectedPosts,
  changeFilterOption,
  changeSortOption,
  changePostBodyUserAndTitle,
  postAdded,
} = postsSlice.actions;

export const getAllPosts = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.posts;
};

export const checkOnSelect = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.posts.some((post) => post.selected === true);
};

export const getPostsStatus = ({ posts }: { posts: TPostsIntialState }) =>
  posts.status;

export const getPostCommentsStatus = ({
  posts,
}: {
  posts: TPostsIntialState;
}) => {
  return posts.commentsStatus;
};

export const getFilterOptions = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.filterOptions;
};

export const getSortOption = ({ posts }: { posts: TPostsIntialState }) => {
  return posts.postsData.sortOption;
};
