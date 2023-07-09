import { useSelector } from "react-redux";
import { selectAllPosts } from "./features/posts/postsSlice";
import { selectAllUsers } from "./features/users/usersSlice";

function App() {
  const posts = useSelector(selectAllPosts);
  const users = useSelector(selectAllUsers);
  console.log(posts);
  console.log(users, 'users')
  return <>Hello world!</>;
}

export default App;
