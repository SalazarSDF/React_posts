import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import { getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { fetchPosts } from "./postsSlice";
import { TPost } from "./postsSlice";
import { useState } from "react";

const PostAuthor = ({ userId }: { userId: number }) => {
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // )
  // return <span>by {author ? author.name : 'Unknown author'}</span>
  //
  return <span>by {userId ? userId : "Unknown author"}</span>;
};

const PostButtons = ({ post }: { post: TPost }) => {
  //TODO: сделать кнопки иконками
  return (
    <div>
      <button>Комментарий</button>
      <button>Редактировать</button>
      <button>Удалить</button>
      <button>В избранное</button>
    </div>
  );
};

const Post = ({ post }: { post: TPost }) => {
  const [showComments, setShowComments] = useState(false);
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.userId} />
      </div>
      {showComments ?? <p className="post-content">{post.body}</p>}

      <button onClick={() => setShowComments(!showComments)}></button>
    </article>
  );
};

export const PostsList = () => {
  // const dispatch = useAppDispatch();
  const postsStatus = useSelector(getPostsStatus);
  //const error = useSelector((state) => state.posts.error)

  // if (postStatus === "failed") {
  //   content = <div>{error}</div>;
  // }
  //
  // if (postsStatus === "idle") {
  //   void dispatch(fetchPosts());
  // }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {postsStatus === "loading" ?? <Spinner></Spinner>}
    </section>
  );
};
