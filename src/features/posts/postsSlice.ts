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
  title: "string";
  body: "string";
  tags: [];
  reactions: number;
  comments?: TComments[];
  selected?: boolean;
  favorite?: boolean;
};

export type TPostData = {
  posts: TPost[];
  total: number;
  skip: number;
  limit: number;
  filterOptions?: {
    filterByPostName?: string;
    filterByUserName?: number;
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

      if (filterByPostName) {
        state.postsData.filterOptions = {
          ...state.postsData.filterOptions,
          filterByPostName: filterByPostName,
        };
      } else if (filterByUserName) {
        state.postsData.filterOptions = {
          ...state.postsData.filterOptions,
          filterByUserName: filterByUserName,
        };
      } else if (filterByFavorites) {
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
  },
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
