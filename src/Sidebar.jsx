// src/Sidebar.jsx
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Multi Project</h2>
      <nav className="nav-links">
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          🔍 Debounced Search
        </NavLink>
        <NavLink
          to="/todos"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          ✅ Todo App
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          📦 Infinite Products
        </NavLink>
        <NavLink
          to="/comments"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          💬 Nested Comments
        </NavLink>
      </nav>
    </aside>
  );
}