import ReactDOM from "react-dom";
import "./Modal.css";
const Modal = ({
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
        <div className="modal__buttons">
          <button className="default-button" onClick={onConfirm}>
            Да
          </button>
          <button className="default-button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
