import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import axios from "axios";
import { useEffect } from "react";
import { getTodos, patchTodo} from "../utils/api";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos().then((remoteTodos) => {
      setTodos(remoteTodos);
    });
  }, []);

  // Metodo POST
  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    axios.post("http://localhost:3000/v1/to-dos", {
      ...todo,
      title: todo.text,
    })
      .then(() => {
        getTodos().then((remoteTodos) => {
          setTodos(remoteTodos);
        });
      });
  };

  // Metodo GET
  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // Metodo Patch
  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    patchTodo(todoId, newValue).then(() => {
      getTodos().then((remoteTodos) => {
        setTodos(remoteTodos);
      });
    });
  };

  // Metodo Delete
  const removeTodo = (id) => {
    axios.delete(`http://localhost:3000/v1/to-dos/${id}`).then(() => {
      getTodos().then((remoteTodos) => {
        setTodos(remoteTodos);
      })
    });
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.is_done = !todo.is_done;
        patchTodo(id, {...todo});
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>Que planeas hacer Hoy?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
