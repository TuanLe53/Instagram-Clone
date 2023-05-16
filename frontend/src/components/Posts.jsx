import { useState, useEffect } from "react";
import Post from "./Post"
function Posts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/posts/')
            .then(res => res.json())
            .then(res => {
                setPosts(res)
            })
    }, [])

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <Post post={post} />
                </li>
            ))}
        </ul>
    )
}

export default Posts