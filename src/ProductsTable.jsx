// src/ProductsTable.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import './ProductsTable.css';

const LIMIT = 10; // Number of items to fetch per batch

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Sorting state: { key: 'title' | 'price' | 'rating', direction: 'asc' | 'desc' }
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // Ref attached to a dummy sentinel element at the very bottom of the table
  const observerTarget = useRef(null);

  // 1. FETCH DATA ON PAGE CHANGE
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const skip = page * LIMIT;
        const res = await fetch(
          `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}&select=id,title,category,price,rating`
        );
        const data = await res.json();

        // Append new data to existing items
        setProducts((prev) => [...prev, ...data.products]);

        // If we reached total products, stop observing
        if (skip + LIMIT >= data.total) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page]);

  // 2. INTERSECTION OBSERVER FOR INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If bottom sentinel is visible, not currently loading, and more items exist:
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 } // 1.0 means fully visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Always disconnect observer on re-render / unmount
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // 3. SORTING HANDLER
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 4. DERIVED SORTED DATA (useMemo avoids sorting unnecessarily)
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [products, sortConfig]);

  // Helper for sort arrow icons
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="table-container">
      <h2>Product Catalog (Infinite Scroll)</h2>
      <p className="hint">Click column headers to sort. Scroll down to load more.</p>

      <table className="products-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>ID{getSortIcon('id')}</th>
            <th onClick={() => requestSort('title')}>Product{getSortIcon('title')}</th>
            <th onClick={() => requestSort('category')}>Category{getSortIcon('category')}</th>
            <th onClick={() => requestSort('price')}>Price ($){getSortIcon('price')}</th>
            <th onClick={() => requestSort('rating')}>Rating{getSortIcon('rating')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><strong>{p.title}</strong></td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>⭐ {p.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sentinel element to trigger infinite scroll */}
      <div ref={observerTarget} className="sentinel">
        {loading && <p className="loading-text">Loading more items...</p>}
        {!hasMore && <p className="end-text">You have reached the end of the catalog.</p>}
      </div>
    </div>
  );
}