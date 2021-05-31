import { Button, FormControl, List, TextField } from "@material-ui/core";
import { AddToPhotos, ExitToApp } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { TaskItem } from "./TaskItem";
import styles from "./App.module.css";
import { makeStyles } from "@material-ui/styles";
import { auth } from "./firebase";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "60%",
  },
});

const App: React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

  const classes = useStyles();

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

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("/login");
    });
    return () => {
      unSub();
    };
  }, [props.history]);

  const newTask = () => {
    db.collection("tasks").add({ title: input });
    // db登録後、新規の入力に備えて初期化する
    setInput("");
  };

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React</h1>
      <Button
        className={styles.app_logout}
        onClick={async () => {
          try {
            await auth.signOut();
            props.history.push("/login");
          } catch (error) {
            alert(error.message);
          }
        }}
      >
        <ExitToApp />
      </Button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{ shrink: true }}
          label="newtask"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotos />
      </button>
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
