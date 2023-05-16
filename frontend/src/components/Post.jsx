import {Button, Carousel, Container, Content, Footer, Header, Input, InputGroup, Modal, Stack, Loader} from "rsuite"
import ReactTimeAgo from 'react-time-ago'
import {Link} from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import Avatar from "react-avatar"
import AuthContext from "../context/AuthContext"
import Picker from 'emoji-picker-react';
import LikeBtn from "./LikeBtn"
import PostDetail from "./PostDetail"
import get_user_profile from "../data/fetchUser"

function Post({post}) {
    let { authTokens, user } = useContext(AuthContext)
    
    const [profile, setProfile] = useState()
    const [comment, setComment] = useState("")
    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setComment(prevInput => prevInput + emojiObject.emoji);
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
        setComment("")
    }

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        get_user_profile(post.created_by, authTokens).then((data) => setProfile(data))
    }, [])

    return (
        <Container fluid className="post">
            <Header>           
                <Stack justifyContent={"space-between"}>
                    <Link to={`/profile/${post.created_by}`} state={{ user: post.created_by }}>
                        <Stack spacing={10}>
                            {profile ? <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} round={true} size={40} /> : <Loader /> }
                            <h4>{post.created_by}</h4>
                        </Stack>
                    </Link>
                    <ReactTimeAgo date={post.created_at} locale="en-US" />
                </Stack>
            </Header>

            <Content>
                <Carousel shape="bar">
                    {post.images.map((img) => (
                        <img key={img.id} src={"http://127.0.0.1:8000/" + img.image}/>
                    ))}
                </Carousel>
            </Content>

            <Footer>
                <Stack spacing={5}>
                    <LikeBtn post={post} />
                    <Button onClick={handleOpen} className="post-btn">
                        <span class="material-symbols-outlined">chat_bubble</span>
                    </Button>
                </Stack>
                
                <Stack spacing={6} className="post-description">
                    <Link to={`/profile/${post.created_by}`} state={{ user: post.created_by }}>
                        <h4>{post.created_by}</h4>
                    </Link>
                    <p>{post.description}</p>
                </Stack>
                <p onClick={handleOpen} className="view-comment">View all comment</p>
                <form onSubmit={handleSubmit}>
                    <InputGroup inside>
                        <Input name="content" placeholder="Add a comment" value={comment} onChange={setComment}></Input>
                        <InputGroup.Addon>
                            <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} />    
                        </InputGroup.Addon>
                    </InputGroup>
                {showPicker && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />}
                </form>
            </Footer>
            
            <Modal open={open} onClose={handleClose} size="lg">
                <PostDetail open={open} post={post}/>
            </Modal>

        </Container>
    )
}

export default Post