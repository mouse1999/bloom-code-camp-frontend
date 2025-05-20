
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Reusable Input component
const Input = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 12.5rem;
  transition: width 0.3s, border-color 0.3s;
  font-size: 0.95rem;
  outline: none;
  padding-right: 2rem; /* Add space for clear button */

  &:focus {
    width: 14.375rem;
    border-color: ${props => props.theme.primary || '#4CAF50'};
  }

  @media (max-width: 768px) {
    width: 10rem;
    padding: 0.4rem 0.8rem 0.4rem 2.2rem;
    font-size: 0.9rem;

    &:focus {
      width: 12.5rem;
    }
  }

  @media (max-width: 480px) {
    width: 7.5rem;
    padding: 0.3rem 0.6rem 0.3rem 2rem;
    font-size: 0.85rem;

    &:focus {
      width: 9.375rem;
    }
  }
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: fit-content; /* Container shrinks to fit content */

  &::before {
    content: "🔍";
    position: absolute;
    left: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    &::before {
      left: 0.5rem;
      font-size: 0.9em;
    }
  }

  @media (max-width: 480px) {
    &::before {
      left: 0.375rem;
      font-size: 0.8em;
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1.2rem;
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
  outline: none;
  z-index: 1000;
  
  &:hover {
    color: #666;
  }

  &:active, &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    right: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    right: 0.8rem;
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

  
  useEffect(() => {
    // Focus the input on mount
    inputRef.current?.focus();
  
    // Cleanup 
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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