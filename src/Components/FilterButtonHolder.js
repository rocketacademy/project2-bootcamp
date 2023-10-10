//to add clicked/unclicked status later on
import {FilterButton} from './FilterButton'
//<FilterButtonHolder currentFilter={tagFilter} filters={availableFilters} setTagFilter = {setTagFilter}/>
export function FilterButtonHolder(props) {

    // const handleFilterButton = (e) => { 
    //     //const [isClicked, setIsClicked] = useState([])
    //     const filterName = e.target.id
    //     console.log(props.currentFilters)
    //     if (filterName === 'clearFilter') {
    //         props.setTagFilter(new Set())
    //     } else if (props.currentFilters.has(filterName)){
    //         props.setTagFilter((prevState) => {
    //             prevState.delete(filterName)
    //             return new Set([...(prevState)])
    //         })
    //     } else {
    //         props.setTagFilter((prevState) => {
    //         return (new Set([filterName, ...prevState]))
    //     })
    // }}

    const filtersArray =  [...props.filters]
    const FilterButtons = filtersArray.map((filterTag) => (
        <FilterButton filterTag = {filterTag} setTagFilter = {props.setTagFilter} currentFilters = {props.currentFilters} />
        //<button onClick={handleFilterButton} className = 'bg-red-300' key = {filterTag} id = {filterTag}>{filterTag}</button>
    ))// need to troubleshoot button onClick not working - not running at all - also refactor the buttons later

    FilterButtons.push(
        <FilterButton filterTag = 'Clear' setTagFilter = {props.setTagFilter} currentFilters = {props.currentFilters} />
        // <button onClick = {handleFilterButton} className = 'bg-red-300' key = 'Clear' id = 'Clear'>Clear</button>
    )

    return (
    <div className = 'flex justify-center'>
        {FilterButtons}
    </div>
    )
}