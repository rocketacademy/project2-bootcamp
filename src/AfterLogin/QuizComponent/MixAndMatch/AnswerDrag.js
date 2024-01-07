import { Card } from "@mui/material";
import { useDrag } from "react-dnd";

export default function AnswerDrag(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.ItemTypes.WORD,
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
  }));

  return (
    <Card
      ref={drag}
      className="mix-and-match-question-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {props.word}
    </Card>
  );
}
