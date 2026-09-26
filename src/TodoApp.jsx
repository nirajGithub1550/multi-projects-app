// src/TodoApp.jsx
import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // 1. ADD TODO
  const handleAdd = (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    if (!text.trim()) return; // Don't add empty todos

    const newTodo = {
      id: Date.now(), // Simple unique ID
      text: text.trim(),
      completed: false,
    };

    // Use spread operator to create a NEW array (immutability)
    setTodos([...todos, newTodo]);
    setText(''); // Reset input
  };

  // 2. TOGGLE COMPLETE
  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. DELETE TODO
  const handleDelete = (id) => {
    // Filter returns a NEW array without the deleted item
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Todo List</h2>

      {/* Form ensures "Enter" key works automatically */}
      <form onSubmit={handleAdd} style={styles.form}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul style={styles.list}>
        {todos.length === 0 ? (
          <p style={{ color: '#888' }}>No tasks yet!</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} style={styles.item}>
              <span
                onClick={() => handleToggle(todo.id)}
                style={{
                  ...styles.text,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#aaa' : '#333',
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                style={styles.deleteButton}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// Simple inline styles to keep it all in one file
const styles = {
  container: { maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' },
  form: { display: 'flex', gap: '8px', marginBottom: '20px' },
  input: { flex: 1, padding: '8px 12px', fontSize: '16px' },
  addButton: { padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' },
  text: { cursor: 'pointer', flex: 1 },
  deleteButton: { background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '16px' }
};