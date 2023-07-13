import { useState } from "react";
import ReactDOM from "react-dom";
import "./ActionButtons.css";
import { useSelector } from "react-redux";
import {
  checkOnSelect,
  deleteSelectedPosts,
  setFavoriteSelectedPosts,
} from "../features/posts/postsSlice";
import { useAppDispatch } from "../store";

const ActionButtonsModal = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal__content">
        <p className="modal__text">
          Вы уверены, что хотите выполнить действие?
        </p>
        <button onClick={onConfirm}>Да</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>,
    document.body
  );
};

const ActionButtons = () => {
  const isSomeSelect = useSelector(checkOnSelect);
  const dispatch = useAppDispatch();
  const [actionToDo, setActionToDo] = useState<null | "delete" | "favorite">(
    null
  );
  const [showModal, setShowModal] = useState(false);
  function handleDeleteClick() {
    setShowModal(true);
    setActionToDo("delete");
  }
  function handleFavoriteClick() {
    setShowModal(true);
    setActionToDo("favorite");
  }
  function handleConfirmAction() {
    setShowModal(false);
    if (actionToDo && actionToDo === "delete") {
      dispatch(deleteSelectedPosts());
    } else if (actionToDo && actionToDo === "favorite") {
      dispatch(setFavoriteSelectedPosts());
    }
  }
  function handleCancelAction() {
    setShowModal(false);
  }

  return (
    <>
      <div>
        {isSomeSelect &&
          ReactDOM.createPortal(
            <div className="portal-buttons">
              <button className="action-button" onClick={handleDeleteClick}>
                Удалить
              </button>
              <button className="action-button" onClick={handleFavoriteClick}>
                В избранное
              </button>
            </div>,
            document.body
          )}
      </div>
      {showModal && (
        <ActionButtonsModal
          onCancel={handleCancelAction}
          onConfirm={handleConfirmAction}
        />
      )}
    </>
  );
};

export default ActionButtons;
