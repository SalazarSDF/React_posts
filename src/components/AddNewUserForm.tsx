import { useState } from "react";
import ReactDOM from "react-dom";
import "./AddNewUserForm.css";
import { useSelector } from "react-redux";
import { getAllUsers } from "../features/users/usersSlice";
import { useAppDispatch } from "../store";
import { postAdded } from "../features/posts/postsSlice";

const AddNewUserForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSelectInvalid, setIsSelectInvalid] = useState(false);

  const dispatch = useAppDispatch();
  const users = useSelector(getAllUsers);

  const handleSave = () => {
    if (selectedUser === "" || !selectedUser) {
      setIsSelectInvalid(true);
      return;
    }
    //onSave({ title, text, selectedUser });

    dispatch(postAdded({ title, body, userId: Number(selectedUser) }));

    setTitle("");
    setBody("");
    setSelectedUser("");
    setShowModal(false);
  };

  return (
    <div>
      <button className="default-button" onClick={() => setShowModal(true)}>
        Добавить Новый Пост
      </button>
      {showModal &&
        ReactDOM.createPortal(
          <div className="user-form__overlay">
            <div className="user-form__content">
              <h2 className="user-form__header">Добавить Новый Пост</h2>
              <input
                className="default-fields"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="default-fields user-form__textarea"
                placeholder="Text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
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
              {isSelectInvalid && (
                <p className="error-message">Выбирите юзера.</p>
              )}
              <div className="user-form__button-group">
                <button className="default-button" onClick={handleSave}>
                  Сохранить
                </button>
                <button
                  className="default-button"
                  onClick={() => setShowModal(false)}
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AddNewUserForm;
