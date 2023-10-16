
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
    <div className = 'flex justify-end text-center mx-1'>
        {/* {FilterButtons} */}
        <FilterButton filterTag = 'dates' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} />
        <FilterButton filterTag = 'milestones' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} />
        {/* <FilterButton filterTag = 'bucketlist' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} /> */}
        <input
          type="text"
          id="enterFilter"
          placeholder="Custom filter"
          className = 'mx-1 text-black w-1/3'
          onChange={(e) => {
            filterChange(e);
          }}
          value={filterText}
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