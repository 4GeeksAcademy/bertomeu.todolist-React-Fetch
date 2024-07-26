import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const urlTodosAPI = "https://playground.4geeks.com/todo/"

    useEffect(() => {
        addUser();
    }, []);

    const addUser = () => {
        fetch(urlTodosAPI + "users/bertomeu", {
            method: "GET"
        })
            .then(response =>
                response.status === 404
                    ? fetch(urlTodosAPI + "users/bertomeu", { method: "POST" })
                    : response.ok
                        ? response.json()
                        : null
            )
            .then((data) => {
                getTodos(data.todos);
            })
            .catch((err) => { err })    
    };

    

    function getTodos() {
        fetch(urlTodosAPI + "users/bertomeu", {
            method: "GET",
        })
            .then(response => response.json())
            .then((data) => {
                setTodos(data.todos);
            })
            .catch((err) => { err })
    }
    function addTodo() {
        let newTodo = {
            label: input,
            is_done: false
        }
        fetch(urlTodosAPI + "todos/bertomeu", {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(() => {
                getTodos();
                setInput("");
            })
            .catch((err) => {
                console.error(err);
            });
    }
    function deleteTodo(todoId) {
        fetch(urlTodosAPI + `todos/${todoId}`, {
            method: "DELETE",
        })
            .then(() => {
                getTodos();
            })
            .catch((err) => {
                console.error(err);
            });
    }
    function clearTodos() {
        todos.map((todo, index) => {
            fetch(urlTodosAPI + `todos/${todo.id}`, {
                method: "DELETE",
            })
                .then(() => {
                    if (index === todos.length - 1) {
                        getTodos();
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }
    return (
        <div className="container">
            <h1 className="text-center" style={{ fontSize: "80px" }} >ToDo List</h1>
            <div className="border border-white border-5 rounded-pill p-3 bg-white fs-2">
                <input
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTodo();
                        }
                    }}
                    placeholder="What needs to be done?"
                />
            </div>
            {todos.map((item, index) => (
                <div key={index} className="task border border-white border-5 mt-3 rounded-pill p-3 bg-white fs-3 d-flex justify-content-between align-items-center" >
                    {item.label}
                    <i className="fas fa-trash-alt icon" onClick={() => deleteTodo(item.id)} ></i>
                </div>
            ))}
            <div className="mt-3 fs-3 d-flex justify-content-evenly" >
                {todos.length === 0 ? "No tasks, add tasks" : `${todos.length} tasks`}
                <button className="btn btn-danger rounded-pill fs-4" onClick={clearTodos} >Clear All</button>
            </div>
        </div>
    );
}
export default TodoList

