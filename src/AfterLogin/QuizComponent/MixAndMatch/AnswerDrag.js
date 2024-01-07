import { Card } from "@mui/material";
import { useDrag } from "react-dnd";

export default function AnswerDrag(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: `word${props.i}`,
    item: { value: props.word },
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
