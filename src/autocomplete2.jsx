import React from 'react';
import { useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './Autocomplete.css';

export default function Autocomplete2() {
    const [results, setResults] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        // This is a placeholder for the Autocomplete2 component logic.
        // You can implement similar functionality as in Autocomplete.jsx here.

        // Don't fetch if input is empty or whitespace
        if (!debouncedQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        const controller = new AbortController();
        setIsLoading(true);
        async function fetchData() {
            try {
                const res = await fetch(
                    `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(debouncedQuery)}`,
                    { signal: controller.signal }
                );
                const data = await res.json();
                console.log('Fetched data:', data);
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        // Cleanup: cancel request if component re-renders/unmounts
        return () => controller.abort();
    }, [debouncedQuery]);


    return (
        <div className="autocomplete-container">
            <div clsassName="input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />
                {isLoading && <div className="spinner"></div>}
            </div>
            {/* suggestion dropdown */}
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