import { useState, useReducer, memo } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { selectUserById, getAllUsers } from "../users/usersSlice";
import PostComments from "./PostComments";
import "./Post.css";
import {
  fetchPostComments,
  selectPostHandler,
  favoritePostHandler,
  TPost,
  changePostBodyUserAndTitle,
  deletePostById,
} from "./postsSlice";
import Modal from "../../components/Modal";

type TPostState = {
  postBody?: string;
  postTitle?: string;
  postUserId?: number;
};

enum TPostActionKind {
  "change_post_body" = "change_post_body",
  "change_post_title" = "change_post_title",
  "change_post_user_id" = "change_post_user_id",
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
    case "change_post_user_id": {
      return {
        ...state,
        postUserId: action.payload.postUserId,
      };
    }
    default:
      return state;
  }
}

const Post = memo(({ post }: { post: TPost }) => {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalForDeletePost, setShowModalForDeletePost] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) =>
    selectUserById(state, post.userId)
  );
  const users = useSelector(getAllUsers);

  const [isSelectInvalid, setIsSelectInvalid] = useState(false);

  const [postValue, dispatchChangePostValue] = useReducer(changePostValue, {
    postBody: post.body,
    postUserId: post.userId,
    postTitle: post.title,
  });

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!post.comments) {
      void dispatch(fetchPostComments(post.id));
    }
  };

  const confirmChange = () => {
    const { postBody, postUserId, postTitle } = postValue;
    if (!postUserId) {
      setIsSelectInvalid(true);
      return;
    }
    dispatch(
      changePostBodyUserAndTitle({
        postId: post.id,
        newPostBody: postBody ? postBody : "",
        newPostUserId: postUserId,
        newPostTitle: postTitle ? postTitle : "",
      })
    );
    setShowModal(false);
  };

  const cancelChange = () => {
    setShowModal(false);
    dispatchChangePostValue({
      type: TPostActionKind.change_post_title,
      payload: { postTitle: post.title },
    });

    dispatchChangePostValue({
      type: TPostActionKind.change_post_body,
      payload: { postBody: post.body },
    });

    dispatchChangePostValue({
      type: TPostActionKind.change_post_user_id,
      payload: {
        postUserId: post.userId,
      },
    });
  };

  const handleToggleEditing = () => {
    setEditing(!editing);
    if (editing) {
      setShowModal(true);
    }
  };

  const onConfirmDeletePost = () => {
    dispatch(deletePostById({ postId: post.id }));
    setShowModalForDeletePost(false);
  };
  const onCancelDeletePost = () => {
    setShowModalForDeletePost(false);
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
      | React.ChangeEvent<HTMLSelectElement>
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
        if (value === "" || !postValue.postUserId) {
          setIsSelectInvalid(true);
          break;
        }
        dispatchChangePostValue({
          type: TPostActionKind.change_post_user_id,
          payload: { postUserId: Number(value) },
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
      <p>id: {post.id}</p>
      {editing ? (
        <div className="post__input-title">
          <label>Заголовок: </label>
          <input
            type="text"
            name="postTitle"
            value={postValue.postTitle}
            onChange={(e) => handleInputChange(e)}
            placeholder="Title"
            className="default-fields"
          />
        </div>
      ) : (
        <h1 className="post__title">{postValue.postTitle}</h1>
      )}
      {editing ? (
        <div className="post__input-username">
          <label>Имя пользователя: </label>
          <select
            name="postUserName"
            placeholder="select user"
            value={postValue.postUserId}
            onChange={handleInputChange}
            className={`default-fields default-fields_select ${
              isSelectInvalid ? "select-invalid" : ""
            }`}
          >
            <option className="default-fields_select_option" value="">
              Select User
            </option>
            {users.map((user) => (
              <option
                className="default-fields_select_option"
                key={user.id}
                value={user.id}
              >{`${user.firstName} ${user.lastName}`}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="post__user">
          <img
            className="post__user-image"
            src={user?.image}
            alt="user photo"
          />
          <p className="post__user-name">
            {user
              ? `${user.firstName} ${user.lastName}`
              : "Неизвестный пользователь."}
          </p>
        </div>
      )}
      {editing ? (
        <div className="post__input-textarea">
          <label>Текст поста: </label>
          <textarea
            name="postBody"
            value={postValue.postBody}
            onChange={handleInputChange}
            placeholder="Post text"
            className="default-fields"
          />
        </div>
      ) : (
        <p className="post__text">{postValue.postBody}</p>
      )}

      <div className="post__buttons">
        <button
          className={`post__button comment__button ${
            showComments ? "active_comm" : ""
          }`}
          onClick={handleToggleComments}
        >
          <span role="img" aria-label="Комментарии">
            💬
          </span>
          Комментарии
        </button>
        <button className="post__button" onClick={handleToggleEditing}>
          <span role="img" aria-label="Редактировать">
            🖊️
          </span>
          {editing ? "Сохранить" : "Редактировать"}
        </button>
        <button
          className="post__button"
          onClick={() => setShowModalForDeletePost(true)}
        >
          <span role="img" aria-label="Удалить">
            🗑️
          </span>
          Удалить
        </button>
        <button
          className={` post__button favorite__button ${
            post.favorite === true ? "active_fav" : ""
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
      {showModal && <Modal onConfirm={confirmChange} onCancel={cancelChange} />}
      {showModalForDeletePost && (
        <Modal onConfirm={onConfirmDeletePost} onCancel={onCancelDeletePost} />
      )}
    </div>
  );
});

export default Post;
