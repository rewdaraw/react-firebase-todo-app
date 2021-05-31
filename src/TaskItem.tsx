import React, { useState } from "react";
import { db } from "./firebase";
import { Grid, ListItem, TextField } from "@material-ui/core";
import { DeleteOutlined, EditOutlined } from "@material-ui/icons";
import styles from "./TaskItem.module.css";

interface Props {
  id: string;
  title: string;
}

export const TaskItem: React.VFC<Props> = (props) => {
  const [title, setTitle] = useState(props.title);

  const editTask = () => {
    db.collection("tasks").doc(props.id).set({ title: title }, { merge: true });
  };

  const deleteTask = () => {
    db.collection("tasks").doc(props.id).delete();
  };

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justify="flex-end">
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Edit task"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </Grid>
      <button className={styles.taskitem_icon} onClick={editTask}>
        <EditOutlined />
      </button>
      <button className={styles.taskitem_icon} onClick={deleteTask}>
        <DeleteOutlined />
      </button>
    </ListItem>
  );
};
