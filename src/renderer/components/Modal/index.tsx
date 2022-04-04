import classNames from 'classnames';
import useEventListener from '@use-it/event-listener';
import './index.scss';

interface IModalProps {
  width?: string;
  isOpen: boolean;
  okLabel?: string;
  closeLabel?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onConfirm?: () => void;
  onClose?: () => void;
}

const Modal = ({
  children,
  isOpen,
  width,
  style,
  okLabel,
  closeLabel,
  onConfirm,
  onClose,
}: IModalProps) => {
  const rootClasses = classNames('modal', { show: isOpen });

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEventListener('keydown', onKeydown);

  return (
    <div className={rootClasses}>
      <div className="modal-content" style={{ ...style, width }}>
        <button className="close-icon" type="button" onClick={handleClose}>
          &times;
        </button>
        {children}
        <div className="modal-foot">
          <button type="button" className="confirm" onClick={handleConfirm}>
            {okLabel}
          </button>
          <button type="button" className="cancel" onClick={handleClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  width: 'auto',
  onConfirm: () => {},
  onClose: () => {},
  okLabel: '确认',
  closeLabel: '关闭',
  style: {},
};

export default Modal;
