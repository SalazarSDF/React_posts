import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import "./index.css";
import { fetchPosts } from "./features/posts/postsSlice.ts";
import { fetchUsers } from "./features/users/usersSlice.ts";

function start() {
  void store.dispatch(fetchPosts());
  void store.dispatch(fetchUsers());
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

start();
