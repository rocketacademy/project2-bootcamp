import { Card } from "@mui/material";
import { useDrag } from "react-dnd";

export default function AnswerDrag(props) {
  const ItemTypes = {
    KNIGHT: "knight",
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card ref={drag} className="mix-and-match-question-card">
      {props.word}
    </Card>
  );
}
