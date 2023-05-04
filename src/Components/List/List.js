import { useContext } from "react";
import "./List.css";
import { NavContext, UserContext } from "../../App";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";

const List = ({ list, listOrder, setOrder, id }) => {
  const { navigate } = useContext(NavContext);
  const { user } = useContext(UserContext);

  const handleClick = (e) => {
    const label = e.target.id;
    let index = Number(label.charAt(0));
    const reorderedList = [...listOrder];
    const targetItem = reorderedList.splice(index, 1);
    if (label.includes("up")) {
      reorderedList.splice(index - 1, 0, ...targetItem);
    } else if (label.includes("down")) {
      reorderedList.splice(index + 1, 0, ...targetItem);
    }
    const listOrderRef = ref(
      database,
      "users/" + user.uid + "/" + id + "order"
    );
    set(listOrderRef, reorderedList);
    setOrder(reorderedList);
  };

  let displayList;
  if (list) {
    displayList = listOrder.map((pokemon, index) => (
      <div className="list-item" key={pokemon}>
        <div
          className="list-item-button"
          onClick={() => {
            navigate("profile/" + id + "-" + pokemon);
          }}
        >
          <h2 className="rank">{index + 1}</h2>
          <h2>{list[pokemon].name}</h2>
          <img src={list[pokemon].imgURL} alt={list[pokemon].name} />
        </div>
        <div className="rank-panel">
          <button onClick={handleClick} id={index + "up"}>
            ⬆
          </button>

          <button onClick={handleClick} id={index + "down"} index={index}>
            ⬇
          </button>
        </div>
      </div>
    ));
  } else {
    displayList = "";
  }
  return <div id="list">{displayList}</div>;
};

export default List;
