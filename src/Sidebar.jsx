// src/Sidebar.jsx
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dev Practice</h2>
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
      </nav>
    </aside>
  );
}