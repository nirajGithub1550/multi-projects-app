// Autocomplete.jsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './Autocomplete.css';

export default function Autocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce the user input by 400ms
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    // Don't fetch if input is empty or whitespace
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // AbortController cancels pending requests if debouncedQuery changes again
    const controller = new AbortController();

    async function fetchUsers() {
      setIsLoading(true);
      try {
        // JSONPlaceholder supports filtering via query parameters: `?q=...`
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();

    // Cleanup: cancel request if component re-renders/unmounts
    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSelect = (user) => {
    setQuery(user.name);
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-container">
      <div className="input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search users (e.g., Leanne, Ervin)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {isLoading && <div className="spinner"></div>}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <ul className="suggestions-list">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user.id}
                className="suggestion-item"
                onClick={() => handleSelect(user)}
              >
                <strong>{user.name}</strong>
                <span className="user-email">{user.email}</span>
              </li>
            ))
          ) : (
            <li className="no-results">No users found</li>
          )}
        </ul>
      )}
    </div>
  );
}