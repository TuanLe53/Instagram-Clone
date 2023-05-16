import { useState, useContext, useEffect } from "react"
import AuthContext from "../context/AuthContext"
import ReactTimeAgo from "react-time-ago"
import {Stack, InputGroup, Input, Avatar, Grid, Loader, Row, Col} from "rsuite"
import get_user_profile from "../data/fetchUser"
import Picker from 'emoji-picker-react';
import { Link } from "react-router-dom"


export default function Comment({ comment, replies, post, parent }) {
    let { authTokens, user } = useContext(AuthContext)

    const [profile, setProfile] = useState()
    const [repliesList, setRepliesList] = useState(replies)
    const [isReply, setIsReply] = useState(false)
    const [text, setText] = useState("")
    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setText(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        let data = new FormData(e.target)
        data.append("post", post.id)
        data.append("user", user.user_id)
        data.append("parent_comment", (parent ? parent : comment.id))
        let res = await fetch(`http://127.0.0.1:8000/api/post/comment/${post.id}/`, {
            method: "POST",
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: data
        })
        let new_comment = await res.json()
        setText("")
        setIsReply(false)
        setRepliesList([...repliesList, new_comment])
    }

    useEffect(() => {
        get_user_profile(comment.user, authTokens).then((data) => setProfile(data))
    }, [])

    return (
        <Grid className="comment">
            <Row className="comment-content">
                <Col xs={1} className="comment-owner-avt">
                    <Link to={`/profile/${comment.user}`} state={{ user: comment.user }} >
                        {profile ? <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} circle /> : <Loader /> }
                    </Link>
                </Col>
                
                <Col xs={8}>
                    <div>
                        <p>
                            <span className="comment-owner">
                                <Link to={`/profile/${comment.user}`} state={{ user: comment.user }} >{comment.user} </Link>
                            </span>
                            {comment.content}
                        </p>
                    </div>
                    <div>
                        <Stack spacing={10} className="sub">
                            <ReactTimeAgo date={comment.created_at} locale="en-US" />
                            <p onClick={() => setIsReply(!isReply)}>Reply</p>
                        </Stack>
                    </div>
                </Col>
            </Row>
            {isReply && (
                <div>
                    <form onSubmit={handleSubmit} className="reply-form">
                        <InputGroup inside>
                            <Input name="content" placeholder="Add a comment" value={text} onChange={setText}></Input>
                            <InputGroup.Addon>
                                <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} />    
                            </InputGroup.Addon>
                        </InputGroup>
                        {showPicker && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />}
                    </form>
                </div>
            )}
            {repliesList.length > 0 && (
                <div className="reply-comment">
                    {repliesList.map((reply) => (
                        <Comment comment={reply} key={reply.id} replies={[]} post={post} parent={comment.id}/>
                    ))}
                </div>
            )}
        </Grid>
    )
}