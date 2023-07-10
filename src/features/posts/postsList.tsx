import { useSelector } from "react-redux";
import { getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { selectAllPosts } from "./postsSlice";
import { selectUserById } from "../users/usersSlice";
import { RootState } from "../../store";
import Post from "./Post";
import "./postsList.css";
//import { Post2 } from "./Post";

const PostAuthor = ({ userId }: { userId: number }) => {
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // )
  // return <span>by {author ? author.name : 'Unknown author'}</span>

  const user = useSelector((state: RootState) => selectUserById(state, userId));

  return <span>{user?.firstName}</span>;
};

export const PostsList = () => {
  // const dispatch = useAppDispatch();
  const postsStatus = useSelector(getPostsStatus);
  const posts = useSelector(selectAllPosts);
  return (
    <section className="posts_list">
      <h2 className="posts_list__header">Posts</h2>
      {postsStatus === "loading" ?? <Spinner></Spinner>}
      <ul>
        {posts.map((el) => (
          <Post key={el.id} post={el} />
        ))}
      </ul>
    </section>
  );
};
