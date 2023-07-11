import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import "./index.css";
import { fetchPosts } from "./features/posts/postsSlice.ts";
import { fetchUsers } from "./features/users/usersSlice.ts";

async function start() {
  await store.dispatch(fetchUsers());
  void store.dispatch(fetchPosts());
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

void start();
