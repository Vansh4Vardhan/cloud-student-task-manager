import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskName.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? {
                ...task,
                name: taskName,
                priority,
                dueDate,
              }
            : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: taskName,
          priority,
          dueDate,
          completed: false,
        },
      ]);
    }

    setTaskName("");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const editTask = (task) => {
    setTaskName(task.name);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.completed
        : !task.completed;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container">
      <h1>Student Task Manager</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={addTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search Tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${
              task.completed ? "completed" : ""
            }`}
          >
            <h3>{task.name}</h3>

            <p>Priority: {task.priority}</p>

            <p>Due: {task.dueDate || "Not Set"}</p>

            <p>
              Status:
              {task.completed
                ? " Completed"
                : " Pending"}
            </p>

            <div className="buttons">
              <button onClick={() => toggleComplete(task.id)}>
                Toggle
              </button>

              <button onClick={() => editTask(task)}>
                Edit
              </button>

              <button onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;