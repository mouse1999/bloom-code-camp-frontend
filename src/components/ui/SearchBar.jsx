
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Reusable Input component
const Input = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 200px;
  transition: width 0.3s, border-color 0.3s;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    width: 250px;
    border-color: ${props => props.theme.primary || '#4CAF50'};
  }

  /* Tablet view (typically 768px and below) */
  @media (max-width: 768px) {
    width: 160px;
    padding: 0.4rem 0.8rem 0.4rem 2.2rem;
    font-size: 0.9rem;

    &:focus {
      width: 200px;
    }
    & {
      font-size: 0.8rem;
    }  
    
  }

  /* Mobile view (typically 480px and below) */
  @media (max-width: 480px) {
    width: 120px;
    padding: 0.3rem 0.6rem 0.3rem 2rem;
    font-size: 0.85rem;

    &:focus {
      width: 150px;
    }
    & {
      font-size: 0.7rem;
    } 
  }
`;

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &::before {
    content: "🔍";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  /* Adjust search icon position for smaller screens */
  @media (max-width: 768px) {
    &::before {
      left: 8px;
      font-size: 0.9em;
    }
  }

  @media (max-width: 480px) {
    &::before {
      left: 6px;
      font-size: 0.8em;
    }
  }
`;
const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 1rem;
  padding: 0;
  margin: 0;
  display: ${props => props.$visible ? 'block' : 'none'};
  outline: none; /* Removes the default focus outline */

  &:hover {
    color: #666;
  }

  /* Remove any active/focus styles completely */
  &:active, &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  /* Optional: Add a subtle effect when clicked */
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SearchBar = ({ 
  placeholder = 'Search assignments...', 
  setQuery,
  delay = 300, // Add debounce delay as prop
  initialValue = '' // Add initialValue prop
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Focus the input on mount (optional)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle input change with debounce
  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set new timer
    timerRef.current = setTimeout(() => {
      setQuery(value);
    }, delay);
  };

  // Clear search input
  const handleClear = () => {
    setInputValue('');
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <SearchBarContainer>
      <Input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder} 
        aria-label="Search assignments"
        onChange={handleChange}
        value={inputValue}
      />
      <ClearButton 
        $visible={inputValue.length > 0}
        onClick={handleClear}
        aria-label="Clear search"
      >
        ×
      </ClearButton>
    </SearchBarContainer>
  );
};

export default SearchBar;