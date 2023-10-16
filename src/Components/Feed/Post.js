import { useState, useEffect } from "react";
import { database } from "../../firebase/firebase";
import { onChildAdded, push, ref } from "firebase/database";
import {MultiFileComposer} from './MultiFileComposer.js'
import {ImageCarousel} from './ImageCarousel';

const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

//<Post postContent={post} setPosts={props.setPosts} key={post.key} postIndex={index} />
export function Post(props) {
    console.log(props.postContent)
    const [commentInput, setCommentInput] = useState({})
    const [commentList, setCommentList] = useState([])
    const DB_FEED_KEY = `feed`;

    // /placeholderforuserid/${props.postContent.key}/comments

    useEffect(() => { // whenever app renders
        const commentRef = ref(database, `rooms/${DUMMY_PAIRID}/${DB_FEED_KEY}/${props.postContent.key}/comments`); //setup reference 
        onChildAdded(commentRef, (data) => { //setup listener
            setCommentList((prevComments) => [...prevComments, { key: data.key, val: data.val() }]);
        });
    }, []);

    const writeComment = () => {
        const commentRef = ref(database, `rooms/${DUMMY_PAIRID}/${DB_FEED_KEY}/${props.postContent.key}/comments`);
        push(commentRef, commentInput
        ).then(() => {
            //reset form after submit
            setCommentInput({
                commentingUser: DUMMY_USERID,
                commentText: '',
            });
        });
    };

    const commentListItems = commentList.map((comment) => (
        <div className=' bg-green-300 p-1 m-1 border-black border' key={comment.key} >
            {comment.val.commentingUser} : {comment.val.commentText}  
        </div>
    ))

    return (      // to work out the edit button later
        <div className=' bg-text m-2 max-h-1/5 border-black border font-fontspring' key={props.postContent.key}>
            {/* {props.postContent.val.file ? <img src={props.postContent.val.file} alt='Post message' /> : null} */}
            {props.postContent.val.files ? <ImageCarousel urlArray = {props.postContent.val.files ? props.postContent.val.files:[]} />: null}
            {props.postContent.val.message}
            <br />
            <div className = 'flex justify-between'>
            <p className = 'font-bold'>-{props.postContent.val.user} </p>
            <p>{props.postContent.val.date}</p>
            </div>
            <div className = 'flex flex-row flex-wrap justify-center'>
            Tags: {props.postContent.val.tags.split(' ').map((tag)=><p className = 'bg-blue-300 border-solid border-black rounded mx-1 border-2'>{tag}</p>)}
            </div>
            {commentListItems}
            <div className='flex justify-between'>
                <button
                    onClick={() => document.getElementById("commentComposer").showModal()}
                    className='text-left mx-1 bg-blue-300 max-h-6 w-1/5'
                >
                    Comment
                </button>
                <dialog id="commentComposer" className="modal">
                    <form method="dialog">
                        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <div>
                    <input // comment modal rather than a comment input, so one comment button and one edit
                        type='text'
                        placeholder='Comment?'
                        onChange={(e) => {
                            setCommentInput({
                                commentingUser: DUMMY_USERID,
                                commentText: e.target.value,
                            })
                        }}
                        value={commentInput.commentText}
                        className='text-black p-1'
                    />
                    <button onClick={writeComment} className = 'bg-window border-2 border-black p-1'>Post</button>
                    </div>
                </dialog>
                <button onClick={() => document.getElementById(`editPost-${props.postContent.key}`).showModal()}> Edit </button>
            </div>
            <dialog id={`editPost-${props.postContent.key}`} className="modal">
                <form method='dialog'>
                    <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                </form>
                {console.log(props.postContent.val.files ? props.postContent.val.files : 'foo')}

                <MultiFileComposer key={`composer-${props.postContent.key}`} postContent={props.postContent} />
                {/* this is a lot of composer components rendered- should i explore just selectively rendering one? */}
            </dialog>
        
        </div>

    )
}