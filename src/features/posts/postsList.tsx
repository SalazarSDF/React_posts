import { useSelector } from "react-redux";
import { getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { selectAllPosts } from "./postsSlice";
import Post from "./Post";
import "./postsList.css";
//import { Post2 } from "./Post";

export const PostsList = () => {
  // const dispatch = useAppDispatch();
  const postsStatus = useSelector(getPostsStatus);
  const posts = useSelector(selectAllPosts);
  return (
    <section className="posts_list">
      <h2 className="posts_list__header">Posts</h2>
      {postsStatus === "loading" ? (
        <Spinner></Spinner>
      ) : (
        <ul>
          {posts.map((el) => (
            <Post key={el.id} post={el} />
          ))}
        </ul>
      )}
    </section>
  );
};
