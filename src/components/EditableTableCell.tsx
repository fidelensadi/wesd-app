import React, { useState, useEffect, useRef } from 'react';

interface EditableTableCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'date';
}

export const EditableTableCell: React.FC<EditableTableCellProps> = ({
  value,
  isEditing,
  onChange,
  type = 'text'
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  if (!isEditing) {
    return <span className="text-sm text-gray-900">{value}</span>;
  }

  return (
    <input
      ref={inputRef}
      type={type}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => onChange(editValue)}
      className="w-full px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    />
  );
};