//import { useSelector } from "react-redux";
//import { selectAllPosts } from "./features/posts/postsSlice";
//import { selectAllUsers } from "./features/users/usersSlice";
import { PostsList } from "./features/posts/postsList";

function App() {
  //const users = useSelector(selectAllUsers);

  //const error = useSelector((state) => state.posts.error)

  // if (postStatus === "failed") {
  //   content = <div>{error}</div>;
  // }
  //
  // if (postsStatus === "idle") {
  //   void dispatch(fetchPosts());
  // }
  //TODO: fix redux devtoools
  return (
    <>
      <PostsList />
    </>
  );
}

export default App;
