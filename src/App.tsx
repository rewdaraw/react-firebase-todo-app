import { FormControl, TextField } from "@material-ui/core";
import { AddToPhotos } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });

    // cleanup関数を実行する(メモリリークを防ぐため)
    // unSubの中にdb.collection()から返ってきたサブスクリプションを停止させる関数が入っているので実行する
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    // db登録後、新規の入力に備えて初期化する
    setInput("");
  };

  return (
    <div className="App">
      <h1>Todo App by React</h1>
      <FormControl>
        <TextField
          InputLabelProps={{ shrink: true }}
          label="newtask"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotos />
      </button>

      {tasks.map((task) => (
        <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  );
};

export default App;
