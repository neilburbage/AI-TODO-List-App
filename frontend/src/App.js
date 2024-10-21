import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      console.log("Fetching todos from:", `${API_URL}/api/todos`);
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    await axios.post(`${API_URL}/api/todos`, { text: newTodo });
    setNewTodo("");
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    await axios.put(`${API_URL}/api/todos/${id}`, {
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/api/todos/${id}`);
    fetchTodos();
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: chatInput,
      });
      setChatResponse(response.data.content);
    } catch (error) {
      console.error("Error calling chat API:", error);
      setChatResponse("Sorry, there was an error processing your request.");
    }
    setChatInput("");
  };

  return (
    <div className="App">
      <h1>AI-Powered TO DO List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button type="submit" className="todo-submit">
          Add
        </button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              className="todo-text"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="todo-delete">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="chat-container">
        <h2>AI Chat Assistant</h2>
        <form onSubmit={handleChat}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask the AI about your todos"
            className="chat-input"
          />
          <button type="submit" className="chat-submit">
            Send
          </button>
        </form>
        {chatResponse && <div className="chat-response">{chatResponse}</div>}
      </div>
    </div>
  );
}

export default App;
