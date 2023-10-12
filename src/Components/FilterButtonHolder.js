
import { useState } from "react"
import {FilterButton} from './FilterButton'

//<FilterButtonHolder tagFilter={tagFilter} availableFilters={availableFilters} setTagFilter = {setTagFilter}/>
export function FilterButtonHolder(props) {
    const [filterText, setFilterText] = useState('')
    //const filtersArray =  [...props.filters]
    // const FilterButtons = filtersArray.map((filterTag) => (
    //     <FilterButton filterTag = {filterTag} setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter />
    //     //<button onClick={handleFilterButton} className = 'bg-red-300' key = {filterTag} id = {filterTag}>{filterTag}</button>
    // ))

    // FilterButtons.push(
    //     <FilterButton filterTag = 'Clear' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} />
    // )

    const filterChange = (e) => {
        setFilterText(e.target.value);
        props.setCustomFilter(e.target.value)
      };

    return (
    <div className = 'flex justify-center'>
        {/* {FilterButtons} */}
        <FilterButton filterTag = 'Dates' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} />
        <FilterButton filterTag = 'Milestones' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} />
        <input
          type="text"
          id="enterFilter"
          placeholder="enter custom filter:"
          onChange={(e) => {
            filterChange(e);
          }}
          value={filterText}
          className="text-black"
        />
        <FilterButton 
        filterTag = 'Clear' 
        setTagFilter = {props.setTagFilter} 
        tagFilter = {props.tagFilter} 
        setFilterText = {setFilterText} 
        setCustomFilter = {props.setCustomFilter}
            
        />
    </div>
    )
}