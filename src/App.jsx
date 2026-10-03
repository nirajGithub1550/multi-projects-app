// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Autocomplete from './autocomplete2';
import TodoApp from './TodoApp';
import ProductsTable from './ProductsTable';
import NestedComments from './NestedComments';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        {/* Persistent Sidebar on the left */}
        <Sidebar />

        {/* Dynamic content changes based on current URL */}
        <main className="main-content">
          <Routes>
            {/* Redirect home '/' to '/search' by default */}
            <Route path="/" element={<Navigate to="/search" replace />} />
            
            <Route path="/search" element={<Autocomplete />} />
            <Route path="/todos" element={<TodoApp />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/comments" element={<NestedComments />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}