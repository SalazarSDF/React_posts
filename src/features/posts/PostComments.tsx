import { useSelector } from "react-redux";
import { getPostCommentsStatus, selectOnePost } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { fetchPostComments } from "./postsSlice";
import { RootState, useAppDispatch } from "../../store";
import { useEffect } from "react";
import { selectUsersByIds } from "../users/usersSlice";

const PostComments = ({ postId }: { postId: number }) => {
  const postCommentsStatus = useSelector(getPostCommentsStatus);
  const dispatch = useAppDispatch();
  const post = useSelector((state: RootState) => selectOnePost(state, postId));
  useEffect(() => {
    if (postCommentsStatus !== "loading") {
      if (!post) return;
      const jopa = post.comments;
      if (!jopa) void dispatch(fetchPostComments(postId));
    }
  }, [postCommentsStatus, dispatch, postId, post]);

  const usersWitchLeaveComments = useSelector((state: RootState) => {
    if (!post || !post.comments) return;
    return selectUsersByIds(
      state,
      post.comments.map((comment) => comment.user.id)
    );
  });

  if (!post) return <p>No post</p>;

  const commentsList = () => {
    return post.comments?.map((comment, id) => {
      const user = usersWitchLeaveComments
        ? usersWitchLeaveComments[id]
        : false;
      let userDiv;
      if (user) {
        userDiv = (
          <div className="post__user">
            <img className="post__user-image" src={user.image} alt="" />
            <p className="post__user-name">{comment.user.username}</p>
            <p>email: {user.email}</p>
          </div>
        );
      }
      return (
        <li>
          <p>{comment.body}</p>
          {user && userDiv}
        </li>
      );
    });
  };

  console.log(post.comments);
  console.log(usersWitchLeaveComments);
  return postCommentsStatus === "loading" ? (
    <Spinner />
  ) : (
    <ul>{commentsList()}</ul>
  );
};

export default PostComments;
