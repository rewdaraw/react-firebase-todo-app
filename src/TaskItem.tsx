import React from "react";
import "firebase";
import { ListItem } from "@material-ui/core";

interface Props {
  id: string;
  title: string;
}

export const TaskItem: React.VFC<Props> = (props) => {
  const { id, title } = props;
  return (
    <div>
      <ListItem>
        <h2>{title}</h2>
      </ListItem>
    </div>
  );
};
