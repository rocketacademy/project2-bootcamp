//-----------React-----------//
import { useState } from "react";

//-----------Components-----------//
import { FilterButton } from "./FilterButton";

export function FilterButtonHolder(props) {
  const [filterText, setFilterText] = useState("");

  const filterChange = (e) => {
    setFilterText(e.target.value);
    props.setCustomFilter(e.target.value);
  };

  return (
    <div className="mx-1 flex justify-center text-center">
      {/* Default Filter Buttons */}
      <FilterButton
        filterTag="Dates"
        setTagFilter={props.setTagFilter}
        tagFilter={props.tagFilter}
      />
      <FilterButton
        filterTag="Milestones"
        setTagFilter={props.setTagFilter}
        tagFilter={props.tagFilter}
      />
      {/* <FilterButton filterTag = 'bucketlist' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} /> */}
      <input
        type="text"
        id="enterFilter"
        placeholder="Custom tags e.g. Travel"
        className="mx-1 w-[180px] rounded-lg border-[1px] border-text px-2 text-sm text-black"
        onChange={(e) => {
          filterChange(e);
        }}
        value={filterText}
      />
      <FilterButton
        filterTag="Clear"
        setTagFilter={props.setTagFilter}
        tagFilter={props.tagFilter}
        setFilterText={setFilterText}
        setCustomFilter={props.setCustomFilter}
      />
    </div>
  );
}
