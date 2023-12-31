import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientUsers, TUsersData } from "../../api/clientUsers";

export type TUser = {
  id: number;
  firstName: "string";
  lastName: "string";
  email: "string";
  image: "string";
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await clientUsers.get(
      `https://dummyjson.com/users?limit=100`
    );

    if (response && response.data) {
      const usersData: TUsersData = response.data;
      return { ...usersData };
    }
    throw new Error("Invalid response or data");
  } catch (error) {
    console.error(error);
    throw error;
  }
});

type TUsersIntialState = {
  status: "idle" | "loading" | "succeeded";
  usersData: TUsersData;
  error: null;
};
const initialState: TUsersIntialState = {
  status: "idle",
  usersData: { users: [], total: 0, skip: 0, limit: 0 },
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, _) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.usersData = action.payload;
        }

      });
  },
});

export default usersSlice;

export const getAllUsers = ({ users }: { users: TUsersIntialState }) => {
  return users.usersData.users;
};

export const getUsersStatus = ({ users }: { users: TUsersIntialState }) =>
  users.status;

export const selectUserById = (
  { users }: { users: TUsersIntialState },
  userId: number
) => users.usersData.users.find((user) => user.id === userId);

export const selectUsersByIds = (
  { users }: { users: TUsersIntialState },
  userIds: number[]
) => userIds.map((userId) => selectUserById({ users }, userId));
