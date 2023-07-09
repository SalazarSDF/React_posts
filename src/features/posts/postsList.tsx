import { useSelector } from "react-redux";
import { getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { TPost } from "./postsSlice";
import { useState } from "react";
import { selectAllPosts } from "./postsSlice";
import { selectUserById } from "../users/usersSlice";
import { RootState } from "../../store";

const PostAuthor = ({ userId }: { userId: number }) => {
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // )
  // return <span>by {author ? author.name : 'Unknown author'}</span>

  const user = useSelector((state: RootState) => selectUserById(state, userId))

  return <span>{user?.firstName}</span>;
};

const Post = ({ post }: { post: TPost }) => {
  const [showComments, setShowComments] = useState(false);
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div>
        <PostAuthor userId={post.userId} />
      </div>
      {showComments ?? <p className="post-content">{post.body}</p>}

      <button onClick={() => setShowComments(!showComments)}>
        {showComments ? "show comments" : "hide comments"}
      </button>
      <input type="checkbox" />
    </article>
  );
};

export const PostsList = () => {
  // const dispatch = useAppDispatch();
  const postsStatus = useSelector(getPostsStatus);
  const posts = useSelector(selectAllPosts);
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {postsStatus === "loading" ?? <Spinner></Spinner>}
      <ul>
        {posts.map((el) => (
          <Post key={el.id} post={el} />
        ))}
      </ul>
    </section>
  );
};
