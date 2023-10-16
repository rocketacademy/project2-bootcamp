//-----------React-----------//
import { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../../firebase/firebase";
import { ref, onValue } from "firebase/database";

//-----------Components-----------//
import ContextHelper from "../Helpers/ContextHelper";
import { Post } from "./Post";

export function Feed(props) {
  const pairKey = ContextHelper("pairKey");
  const [posts, setPosts] = useState([]);

  // Pull posts data from firebase
  useEffect(() => {
    const postRef = ref(database, `rooms/${pairKey}/feed`);
    onValue(postRef, (data) => {
      let dataArray = [];
      if (data.val()) {
        dataArray = Object.keys(data.val()).map((key) => {
          return { key: key, val: data.val()[key] };
        });
      }
      setPosts(dataArray);
    });
  }, [pairKey]);

  // Map out posts based on filter
  const allPosts = posts.map((post, index) => {
    //if post tag set length + tagfilter length = length(combined set, do not show post) - means no intersection
    const tagsAsSet = new Set(post.val.tags.split(" "));
    if (
      props.tagFilter.size === 0 ||
      tagsAsSet.size + props.tagFilter.size !==
        new Set([...tagsAsSet, ...props.tagFilter]).size
    ) {
      return (
        <Post
          postContent={post}
          setPosts={props.setPosts}
          key={post.key}
          postIndex={index}
        />
      );
    }
  });

  return (
    <div>
      <div className="max-w-screen grid gap-3 bg-background sm:grid-cols-2">
        {allPosts}
      </div>
    </div>
  );
}
