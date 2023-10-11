//to add clicked/unclicked status later on
import {FilterButton} from './FilterButton'
//<FilterButtonHolder currentFilter={tagFilter} filters={availableFilters} setTagFilter = {setTagFilter}/>
export function FilterButtonHolder(props) {
    const filtersArray =  [...props.filters]
    const FilterButtons = filtersArray.map((filterTag) => (
        <FilterButton filterTag = {filterTag} setTagFilter = {props.setTagFilter} currentFilters = {props.currentFilters} />
        //<button onClick={handleFilterButton} className = 'bg-red-300' key = {filterTag} id = {filterTag}>{filterTag}</button>
    ))

    FilterButtons.push(
        <FilterButton filterTag = 'Clear' setTagFilter = {props.setTagFilter} currentFilters = {props.currentFilters} />
    )

    return (
    <div className = 'flex justify-center'>
        {FilterButtons}
    </div>
    )
}