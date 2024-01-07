import { Card } from "@mui/material";
import { useDrop } from "react-dnd";

export default function AnswerDrop(props) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: props.ItemTypes.WORD,
      drop: () => moveAnswer(props.i),
      collect: (monitor) => ({
        isOver: Boolean(monitor.isOver()),
      }),
    }),
    [props.i]
  );

  const moveAnswer = () => {
    console.log(props.i);
  };

  return <Card ref={drop} className="mix-and-match-question-card"></Card>;
}
