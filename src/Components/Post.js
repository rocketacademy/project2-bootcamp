import { useState, useEffect } from "react";
import { database } from "../firebase/firebase";
import { onChildAdded, push, ref } from "firebase/database";
import { Composer } from "./Composer";

const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

//<Post postContent={post} setPosts={props.setPosts} key={post.key} postIndex={index} />
export function Post(props) {
    const [commentInput, setCommentInput] = useState({})
    const [commentList, setCommentList] = useState([])
    const DB_FEED_KEY = `feed`;

    // /placeholderforuserid/${props.postContent.key}/comments

    useEffect(() => { // whenever app renders
        const commentRef = ref(database, `${DB_FEED_KEY}/${DUMMY_PAIRID}/${props.postContent.key}/comments`); //setup reference 
        onChildAdded(commentRef, (data) => { //setup listener
            setCommentList((prevComments) => [...prevComments, { key: data.key, val: data.val() }]);
        });
    }, []);

    const writeComment = () => {
        const commentRef = ref(database, `${DB_FEED_KEY}/${DUMMY_PAIRID}/${props.postContent.key}/comments`);
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
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={comment.key} >
            {comment.val.commentingUser} : {comment.val.commentText}  
        </div>
    ))

    return (      // to work out the edit button later
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={props.postContent.key}>
        {console.log(props.postContent.val)}
        <button onClick={() => document.getElementById("editPost").showModal()}> Edit </button>
        <dialog id="editPost" className = "modal">
        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <Composer key = {props.postContent.val.date} postContent = {props.postContent}/>
        </dialog>
        <br />
            {props.postContent.val.user}
            {props.postContent.val.file ? <img src={props.postContent.val.file} alt='Post message' /> : null}
            {props.postContent.val.message}
            <br />
            {props.postContent.val.date}
            <br />
            Tags: {props.postContent.val.tags}
            <br />
            <input
              type='text'
              id='Comment'
              placeholder='Comment?'
              onChange={(e) => {setCommentInput({
                commentingUser: 'placeholder for context', 
                commentText: e.target.value,
                })}}
              value={commentInput.commentText}
              className = 'text-black'
            />
            <button onClick={writeComment}>Post</button>
            {commentListItems}
        </div>

    )
}