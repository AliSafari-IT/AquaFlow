import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
}

interface CustomDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export default function CustomDropdown({ trigger, items, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={handleTriggerClick}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <button
              key={item.id}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
