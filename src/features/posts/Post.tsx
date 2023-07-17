import { useState, useReducer } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { selectUserById } from "../users/usersSlice";
import PostComments from "./PostComments";
import "./Post.css";
import {
  fetchPostComments,
  selectPostHandler,
  favoritePostHandler,
  TPost,
  changePostBodyUserAndTitle,
} from "./postsSlice";

type TPostState = {
  postBody?: string;
  postUser?: string;
  postTitle?: string;
};

enum TPostActionKind {
  "change_post_body" = "change_post_body",
  "change_post_title" = "change_post_title",
  "change_post_user" = "change_post_user",
}

interface TPostAction {
  type: TPostActionKind;
  payload: TPostState;
}

function changePostValue(state: TPostState, action: TPostAction) {
  switch (action.type) {
    case "change_post_body": {
      return {
        ...state,
        postBody: action.payload.postBody,
      };
    }
    case "change_post_title": {
      return {
        ...state,
        postTitle: action.payload.postTitle,
      };
    }
    case "change_post_user": {
      return {
        ...state,
        postUser: action.payload.postUser,
      };
    }
    default:
      return state;
  }
}

const Post = ({ post }: { post: TPost }) => {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) =>
    selectUserById(state, post.userId)
  );

  const [postValue, dispatchChangePostValue] = useReducer(changePostValue, {
    postBody: post.body,
    postUser: post.userName
      ? post.userName
      : user
      ? `${user.firstName} ${user.lastName}`
      : "Неизвестный пользователь.",
    postTitle: post.title,
  });

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!post.comments) {
      void dispatch(fetchPostComments(post.id));
    }
  };

  const handleToggleEditing = () => {
    setEditing(!editing);
    if (editing) {
      const confirmed = window.confirm(
        "Вы уверены, что хотите выполнить действие?"
      );
      if (confirmed) {
        dispatch(
          changePostBodyUserAndTitle({
            postId: post.id,
            newPostBody: postValue.postBody ? postValue.postBody : "",
            newPostUser: postValue.postUser ? postValue.postUser : "",
            newPostTitle: postValue.postTitle ? postValue.postTitle : "",
          })
        );
      }
      if (!confirmed) {
        dispatchChangePostValue({
          type: TPostActionKind.change_post_title,
          payload: { postTitle: post.title },
        });

        dispatchChangePostValue({
          type: TPostActionKind.change_post_body,
          payload: { postBody: post.body },
        });

        dispatchChangePostValue({
          type: TPostActionKind.change_post_user,
          payload: {
            postUser: user
              ? `${user.firstName} ${user.lastName}`
              : "Неизвестный пользователь.",
          },
        });
      }
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот пост?"
    );
    if (confirmed) {
      // Удалить пост
    }
  };

  const handleToggleFavorite = () => {
    dispatch(favoritePostHandler({ postId: post.id }));
  };

  const handleToggleSelect = () => {
    dispatch(selectPostHandler({ postId: post.id }));
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!event || !event.target) return;
    const { name, value }: { name: string; value: string } = event.target;

    switch (name) {
      case "postTitle": {
        dispatchChangePostValue({
          type: TPostActionKind.change_post_title,
          payload: { postTitle: value },
        });
        break;
      }
      case "postBody": {
        dispatchChangePostValue({
          type: TPostActionKind.change_post_body,
          payload: { postBody: value },
        });

        break;
      }
      case "postUserName": {
        dispatchChangePostValue({
          type: TPostActionKind.change_post_user,
          payload: { postUser: value },
        });
        break;
      }
    }
  };

  return (
    <div
      className={`post ${post.selected === true ? "selected" : ""} ${
        post.favorite === true ? "favorite" : ""
      }`}
    >
      <p>{post.id}</p>
      {editing ? (
        <input
          type="text"
          name="postTitle"
          value={postValue.postTitle}
          onChange={(e) => handleInputChange(e)}
          placeholder="Enter a value"
          className="post__inpit-title"
        />
      ) : (
        <h1 className="post__title">{postValue.postTitle}</h1>
      )}
      {editing ? (
        <input
          type="text"
          name="postUserName"
          value={postValue.postUser}
          onChange={handleInputChange}
          placeholder="Enter a value"
          className="post__inpit-username"
        />
      ) : (
        <div className="post__user">
          <img
            className="post__user-image"
            src={user?.image}
            alt="user photo"
          />
          <p className="post__user-name">{postValue.postUser}</p>
        </div>
      )}
      {editing ? (
        <textarea
          name="postBody"
          value={postValue.postBody}
          onChange={handleInputChange}
          placeholder="Enter a value"
          className="post__inpit-textarea"
        />
      ) : (
        <p className="post__text">{postValue.postBody}</p>
      )}

      <div className="post__buttons">
        <button
          className={`comment__button ${showComments ? "active" : ""}`}
          onClick={handleToggleComments}
        >
          <span role="img" aria-label="Комментарии">
            💬
          </span>
          Комментарии
        </button>
        <button onClick={handleToggleEditing}>
          <span role="img" aria-label="Редактировать">
            🖊️
          </span>
          {editing ? "Сохранить" : "Редактировать"}
        </button>
        <button onClick={handleDelete}>
          <span role="img" aria-label="Удалить">
            🗑️
          </span>
          Удалить
        </button>
        <button
          className={`favorite__button ${
            post.favorite === true ? "active" : ""
          }`}
          onClick={handleToggleFavorite}
        >
          <span role="img" aria-label="В избранное">
            ⭐
          </span>
          {post.favorite === true ? "Из избранного" : "В избранное"}
        </button>
      </div>

      <input
        id={`${post.id}`}
        type="checkbox"
        className="post__checkbox"
        checked={post.selected ? true : false}
        onChange={handleToggleSelect}
      />

      {showComments && (
        <div className="comments__section">
          <PostComments post={post} />
        </div>
      )}
    </div>
  );
};

export default Post;
