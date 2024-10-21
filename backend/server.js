// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// TODO list array
let todos = [];

// GET all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST a new todo
app.post("/api/todos", (req, res) => {
  try {
    const newTodo = {
      id: Date.now(),
      text: req.body.text,
      completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error adding new todo:", error);
    res.status(500).json({ message: "Error adding new todo" });
  }
});

// PUT (update) a todo
app.put("/api/todos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...req.body };
      res.json(todos[index]);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Error updating todo" });
  }
});

// DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    todos = todos.filter((todo) => todo.id !== id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// OpenAI chat completion endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: req.body.message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
