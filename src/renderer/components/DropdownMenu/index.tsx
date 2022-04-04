import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './index.scss';

interface IDropdownItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const DropdownItem = ({ children, onClick }: IDropdownItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    // event.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className="menu-item"
      role="button"
      tabIndex={0}
      onKeyPress={() => {}}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
DropdownItem.defaultProps = {
  onClick: () => {},
};

interface IDropdownMenuProps {
  children: JSX.Element;
  overlay: JSX.Element;
  className?: string;
}

const DropdownMenu = ({ children, overlay, className }: IDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const contentStyle: CSSProperties = {
    right: 0,
    top: dropdownRef.current?.offsetHeight,
  };

  const rootClass = classNames('dropdown-menu', className);
  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      window.addEventListener('click', closeMenu, false);
    }
    return () => {
      window.removeEventListener('click', closeMenu, false);
    };
  }, [open]);

  return (
    <div className={rootClass} ref={dropdownRef}>
      <div
        role="button"
        tabIndex={0}
        onKeyPress={() => {}}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
      </div>
      {open && (
        <div className="dropdown-content" style={contentStyle}>
          {overlay}
        </div>
      )}
    </div>
  );
};

DropdownMenu.defaultProps = {
  className: '',
};

export default DropdownMenu;
export { DropdownItem };
