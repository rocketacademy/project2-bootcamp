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

  const isUsed = props.answer.some((word) => {
    return props.word === word;
  });

  return (
    !isUsed && (
      <Card
        ref={drag}
        className="mix-and-match-question-card"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {props.word}
      </Card>
    )
  );
}
