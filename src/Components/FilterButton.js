//WORK IN PROGRESS - need to figure out how to update own state and parent state at same time
//<FilterButton filterTag = {filterTag} setTagFilter = {setTagFilter} currentFilters = {currentFilters} />
import { useState } from "react"

export function FilterButton(props) {
    const [isClicked, setIsClicked] = useState(false)
    
    const handleFilterButton = (e) => { 
        //const [isClicked, setIsClicked] = useState([])
        const filterName = e.target.id
        console.log(props.currentFilters)
        if (filterName === 'Clear') {
            props.setTagFilter(new Set())
        } else if (props.currentFilters.has(filterName)){
            setIsClicked(false)
            props.setTagFilter((prevState) => {
                prevState.delete(filterName)
                return new Set([...(prevState)])
            })
        } else {
            setIsClicked(true)
            props.setTagFilter((prevState) => {
            return (new Set([filterName, ...prevState]))
        })
    }}

    return  (
        //some styling can be added later based on whether isClicked is true
    <button onClick={handleFilterButton} className = 'bg-red-300' key = {props.filterTag} id = {props.filterTag}>{props.filterTag}</button>
    )
}
