import "./List.css";

const List = ({ list, listOrder }) => {
  let displayList = listOrder.map((pokemon) => {
    return (
      <button className="list-item" key={pokemon}>
        <img src={list[pokemon].imgURL} alt={pokemon} />
        <h2>{pokemon}</h2>
      </button>
    );
  });

  return <div id="list">{displayList}</div>;
};

export default List;
