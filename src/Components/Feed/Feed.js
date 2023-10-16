import {Post} from './Post'

//<Feed posts={posts} setPosts={setPosts} />
export function Feed(props) {
    // const [tagFilter, setTagFilter] = useState(new Set()) // this is the active filters for post; pass setTagFilter to the FilterButtonHolder for button creation

    const posts = props.posts.map((post, index) => {
        //if post tag set length + tagfilter length = length(combined set, do not show post) - means no intersection
        const tagsAsSet = new Set(post.val.tags.split(' '))
        if (props.tagFilter.size === 0 || (tagsAsSet.size + props.tagFilter.size) !== new Set([...tagsAsSet, ...props.tagFilter]).size) {
            return <Post postContent={post} setPosts={props.setPosts} key={post.key} postIndex={index} />
        }
    })

    // const availableFilters = props.posts.reduce((acc, post) => {
    //     const tagsAsSet = new Set(post.val.tags.split(' '))
    //     return new Set([...acc, ...tagsAsSet])     
    // }, new Set())

    return (
        <div>
            {/* <div>
                <FilterButtonHolder currentFilters={tagFilter} filters={availableFilters} setTagFilter = {setTagFilter}/>
            </div> */}
            <div className='flex flex-col max-w-screen bg-background'>
                {posts}
            </div>
        </div>

    )
}