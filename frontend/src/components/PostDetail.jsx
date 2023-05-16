import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import Comment from "./Comment"
import { Container, Content, Footer, InputGroup, Input, Grid, Row, Col, Carousel, Header, Stack, Avatar, Loader, Modal } from "rsuite"
import get_user_profile from "../data/fetchUser"
import Picker from 'emoji-picker-react';
import { Link } from "react-router-dom"
import LikeBtn from "./LikeBtn"
import ReactTimeAgo from 'react-time-ago'

export default function PostDetail({open, post}) {
    let { authTokens, user } = useContext(AuthContext)
    const [profile, setProfile] = useState()
    const [likeCount, setLikeCount] = useState([])
    const [comments, setComments] = useState([])
    const rootComments = comments.filter((comment) => comment.parent_comment === null)
    const [showLikeList, setShowLikeList] = useState(false)

    const fetchData = async () => {
        let res = await fetch(`http://127.0.0.1:8000/api/post/comment/${post.id}/`, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
        })
        let data = await res.json()
        setComments(data)
    }
    const fetchLikeCount = () => {
        fetch(`http://127.0.0.1:8000/api/post/like-count/${post.id}/`)
            .then(res => res.json())
            .then(res => {
                setLikeCount(res)
            })
    }

    const getReplies = (comment_id) =>
    comments
      .filter((comment) => comment.parent_comment === comment_id)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    
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
        let res = await fetch(`http://127.0.0.1:8000/api/post/comment/${post.id}/`, {
            method: "POST",
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: data
        })
        let new_comment = await res.json()
        setText("")
        setComments([...comments, new_comment])
    }

    useEffect(() => {
        if (open) {
            fetchLikeCount()
            fetchData()
            get_user_profile(post.created_by, authTokens).then(data => setProfile(data))
        }
    }, [])
    return (
        <Grid className="post-container">
            <Row>
                <Col xs={12}>
                    <Carousel shape="bar">
                        {post.images.map((img) => (
                            <img key={img.id} src={"http://127.0.0.1:8000/" + img.image}/>
                        ))}
                    </Carousel>
                </Col>
                <Col xs={11}>
                    <Container>
                        <Header>
                            <Link to={`/profile/${post.created_by}`} state={{ user: post.created_by }}>
                                <Stack spacing={5}>
                                    {profile ? <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} circle /> : <Loader /> }
                                    <h4>{post.created_by}</h4>
                                </Stack>
                            </Link>
                            <p className="post-description">{post.description}</p>
                        </Header>
                        <Content className="comments-container">
                            <ul>
                                {rootComments.map((comment) => (
                                    <Comment key={comment.id} comment={comment} replies={getReplies(comment.id)} post={post} />
                                ))}
                            </ul>
                        </Content>
                        <Footer>
                            <Stack spacing={5} className="post-detail-group-btn">
                                <LikeBtn post={post} />
                                {likeCount.length !== 0 && (<p onClick={() => setShowLikeList(true)}>{likeCount.length}</p>)}
                            </Stack>
                            <form onSubmit={handleSubmit}>
                                <InputGroup inside>
                                    <Input name="content" placeholder="Add a comment" value={text} onChange={setText}></Input>
                                    <InputGroup.Addon>
                                        <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} />    
                                    </InputGroup.Addon>
                                </InputGroup>
                                {showPicker && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />}
                            </form>
                        </Footer>
                    </Container>
                </Col>
            </Row>

            <Modal open={showLikeList} onClose={() => setShowLikeList(false)} size="xs">
                <Modal.Body>
                    {likeCount.map((like) => (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Link to={`/profile/${like.user}`} state={{ user: like.user }} >
                                <h4>{like.user}</h4>
                            </Link>
                            <ReactTimeAgo date={like.created_at} locale="en-US" />
                        </div>
                    ))}
                </Modal.Body>
            </Modal>

        </Grid>
    )
}