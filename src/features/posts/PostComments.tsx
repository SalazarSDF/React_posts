import { useSelector } from "react-redux";
import { getPostCommentsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { RootState } from "../../store";
import { selectUsersByIds } from "../users/usersSlice";
import { TPost } from "./postsSlice";
import "./PostComments.css";

const PostComments = ({ post }: { post: TPost }) => {
  const postCommentsStatus = useSelector(getPostCommentsStatus);
  const isShowLoading = postCommentsStatus === "loading" && !post.comments;
  const usersWitchLeaveComments = useSelector((state: RootState) => {
    if (!post.comments) return;
    return selectUsersByIds(
      state,
      post.comments.map((comment) => comment.user.id)
    );
  });

  if (!post.comments && postCommentsStatus !== "loading")
    return <p>No comments..</p>;

  const commentsList = () => {
    if (!post.comments)
      return (
        <li>
          <p>No Comments..</p>
        </li>
      );
    return post.comments.map((comment, id) => {
      const user = usersWitchLeaveComments
        ? usersWitchLeaveComments[id]
        : false;
      return (
        <li className="comments-list__item" key={comment.id}>
          {user ? (
            <div className="comments-list__user">
              <img className="comments-list__user-image" src={user.image} alt="" />
              <p className="comments-list__user-name">{comment.user.username}</p>
              <p>{user.email}</p>
            </div>
          ) : (
            <p>Unknown user...</p>
          )}
          <p>{comment.body}</p>
        </li>
      );
    });
  };
  console.log(post.comments, 'post comments');
  console.log(usersWitchLeaveComments, 'users withc leab comments');
  return isShowLoading ? (
    <Spinner />
  ) : (
    <ul className="comments-list">{commentsList()}</ul>
  );
};

export default PostComments;
