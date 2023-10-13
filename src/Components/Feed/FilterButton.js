//WORK IN PROGRESS - need to figure out how to update own state and parent state at same time
//<FilterButton filterTag = {filterTag} setTagFilter = {setTagFilter} tagFilter = {props.tagFilter} />
//<FilterButton filterTag = 'Clear' setTagFilter = {props.setTagFilter} tagFilter = {props.tagFilter} 
//setFilterText = {setFilterText} setCustomFilter = {props.setCustomFilter}/>
import { useState } from "react"

export function FilterButton(props) {
    const [isClicked, setIsClicked] = useState(false)
    
    const handleFilterButton = (e) => { 
        //const [isClicked, setIsClicked] = useState([])
        const filterName = e.target.id
        if (filterName === 'Clear') {
            props.setTagFilter(new Set())
            props.setFilterText('')
            props.setCustomFilter('')
        } else if (props.tagFilter.has(filterName)){
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
    <button onClick={handleFilterButton} className = 'bg-blue-300 border-solid border-black rounded mx-1 border-2' key = {props.filterTag} id = {props.filterTag}>{props.filterTag}</button>
    )
}
