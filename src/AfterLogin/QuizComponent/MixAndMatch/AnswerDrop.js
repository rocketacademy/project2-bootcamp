import { Card } from "@mui/material";
import { useDrop } from "react-dnd";

export default function AnswerDrop(props) {
  const allAccept = [];
  for (let i = 0; i < 10; i++) {
    allAccept.push(`word${i}`);
  }
  const [, drop] = useDrop(
    () => ({
      accept: allAccept,
      drop: (item) => moveAnswer(item),
      collect: (monitor) => ({
        isOver: Boolean(monitor.isOver()),
      }),
    }),
    [props.i]
  );

  const moveAnswer = (item) => {
    props.setAnswer((prev) => {
      const updated = [...prev];
      updated[props.i] = item.value;
      return updated;
    });
  };

  return (
    <Card ref={drop} className="mix-and-match-question-card">
      {props.answer}
    </Card>
  );
}
