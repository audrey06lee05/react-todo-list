import React, { useState, useEffect } from "react";
import "./App.css";
import { MdDelete } from "react-icons/md"; //importing delete button icon
import { FaCheckCircle } from "react-icons/fa"; // import check button icon
import { MdEdit } from "react-icons/md"; // import edit button icon
import { MdRestore } from "react-icons/md"; // import restore button icon

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr)); //save it to local storage
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleRestoreCompletedTodo = (index) => {
    let restoredTodo = completedTodos[index];
    let updatedTodos = [...allTodos, restoredTodo];
    let updatedCompletedTodos = [...completedTodos];
    updatedCompletedTodos.splice(index, 1);

    setTodos(updatedTodos);
    setCompletedTodos(updatedCompletedTodos);

    localStorage.setItem("todolist", JSON.stringify(updatedTodos));
    localStorage.setItem(
      "completedTodos",
      JSON.stringify(updatedCompletedTodos)
    );
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn =
      yyyy + "-" + mm + "-" + dd + " at " + h + ":" + m + ":" + s;

    let filterdItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filterdItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (ind, item) => {
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateDate = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, dueDate: value };
    });
  };

  const handleUpdateTodo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    localStorage.setItem("todolist", JSON.stringify(newToDo));
    setCurrentEdit(null);
    setCurrentEditedItem({});
  };

  // Initial input
  return (
    <div className="App">
      <h1>My Todo List</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What is the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What is the task description?"
            />
          </div>
          <div className="todo-input-item">
            <label>Due Date</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              placeholder="What is the task due date?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area"> //todo/completed tab
          <button
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
              //edit screen
          {isCompleteScreen === false && 
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit_wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <input
                      type="date"
                      placeholder="Updated Date"
                      onChange={(e) => handleUpdateDate(e.target.value)}
                      value={currentEditedItem.dueDate}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateTodo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else { //show item on todo tab
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p id="due-date">Due date: {item.dueDate}</p>
                    </div>
                    <div>
                      <MdDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <MdEdit
                        className="edit-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                      <FaCheckCircle
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Completed?"
                      />
                    </div>
                  </div>
                );
              }
            })}
            //completed tab
          {isCompleteScreen === true && 
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p id="due-date">Due date: {item.dueDate}</p>
                    <p>
                      <small>Completed on: {item.completedOn}</small>
                    </p>
                  </div>
                  <div>
                    <MdDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                    <MdRestore
                      className="restore-icon"
                      onClick={() => handleRestoreCompletedTodo(index)}
                      title="Restore?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
