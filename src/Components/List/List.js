import "./List.css";

const List = ({ list, listOrder }) => {
  let displayList = listOrder.map((pokemon) => {
    return (
      <div className="list-item" key={pokemon}>
        <img src={list[pokemon].imgURL} alt={pokemon} />
        <h2>{pokemon}</h2>
      </div>
    );
  });

  return <div id="list">{displayList}</div>;
};

export default List;
