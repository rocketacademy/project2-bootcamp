import {Post} from './Post'
import {FilterButtonHolder} from './FilterButtonHolder'
import { useState } from "react";

//<Feed posts={posts} setPosts={setPosts} />
export function Feed(props) {
    const [tagFilter, setTagFilter] = useState(new Set()) // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation

    const posts = props.posts.map((post, index) => {
        //if post tag set length + tagfilter length = length(combined set, do not show post) - means no intersection
        const tagsAsSet = new Set(post.val.tags.split(' '))
        if (tagFilter.size === 0 || (tagsAsSet.size + tagFilter.size) !== new Set([...tagsAsSet, ...tagFilter]).size) {
            return <Post postContent={post} setPosts={props.setPosts} key={post.key} postIndex={index} />
        }
    })

    const availableFilters = props.posts.reduce((acc, post) => {
        const tagsAsSet = new Set(post.val.tags.split(' '))
        return new Set([...acc, ...tagsAsSet])     
    }, new Set())

    return (
        <div>
            <div>
                <FilterButtonHolder currentFilters={tagFilter} filters={availableFilters} setTagFilter = {setTagFilter}/>
            </div>
            <div className='flex flex-row flex-wrap max-w-screen justify-center bg-red-300'>
                {posts}
            </div>
        </div>

    )
}