import React from 'react';
import type { ChangeEvent } from 'react';

interface PhoneInputFieldProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter phone number',
  className = '',
  required = false,
  disabled = false,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const validChars = /^[+0-9()\-\. #*,;–]*$/;
    
    if ((validChars.test(inputValue) || inputValue === '') && inputValue.length <= 20) {
      onChange(inputValue);
    }
  };

  return (
    <input
      type="tel"
      id={id}
      name={name}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      required={required}
      disabled={disabled}
      autoComplete="tel"
      maxLength={20}
    />
  );
};

export default PhoneInputField;
