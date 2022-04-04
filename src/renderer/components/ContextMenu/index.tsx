import React, { ReactElement, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import classNames from 'classnames';
import './index.scss';

interface IContextMenuProps {
  overlay: { label: string; onClick: (id?: string) => void }[];
  areaRef: React.MutableRefObject<HTMLElement | null>;
  className?: string;
  children: ReactElement;
}

const ContextMenu = ({
  overlay,
  areaRef,
  children,
  className,
}: IContextMenuProps) => {
  const [isShow, setIsShow] = useState(false);
  const [position, setPosition] = useState({ left: '0px', top: '0px' });
  const [selectedId, setSelectedId] = useState<string>();

  useEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      e.preventDefault();
      setPosition({
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
      });
      setIsShow(true);
      const target = e.target as HTMLElement;
      const { id } = target.dataset;
      if (id) {
        setSelectedId(id);
      }
    },
    areaRef.current
  );

  const rootClass = classNames('context-menu', className);

  useEventListener('click', () => {
    setIsShow(false);
  });

  return (
    <div className={rootClass}>
      {children}
      {isShow && (
        <div className="context-content" style={{ ...position }}>
          {overlay.map((item) => (
            <div
              className="menu-item"
              role="button"
              tabIndex={0}
              key={item.label}
              onClick={() => item.onClick(selectedId)}
              onKeyPress={() => {}}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ContextMenu.defaultProps = {
  className: '',
};

export default ContextMenu;
