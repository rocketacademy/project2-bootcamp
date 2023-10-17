//-----------React-----------//
import { useState } from "react";

export function FilterButton(props) {
  const [isClicked, setIsClicked] = useState(false);

  const handleFilterButton = (e) => {
    const filterName = e.target.id;
    if (filterName === "clear") {
      props.setTagFilter(new Set());
      props.setFilterText("");
      props.setCustomFilter("");
    } else if (props.tagFilter.has(filterName)) {
      setIsClicked(false);
      props.setTagFilter((prevState) => {
        prevState.delete(filterName);
        return new Set([...prevState]);
      });
    } else {
      setIsClicked(true);
      props.setTagFilter((prevState) => {
        return new Set([filterName, ...prevState]);
      });
    }
  };

  return (
    <button
      onClick={handleFilterButton}
      className={`mx-1 rounded bg-text px-2 text-sm ${
        isClicked && `border-2 border-accent`
      }`}
      key={props.filterTag}
      id={props.filterTag}
    >
      {props.filterTag}
    </button>
  );
}
