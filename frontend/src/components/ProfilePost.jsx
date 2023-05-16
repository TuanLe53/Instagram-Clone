import { useEffect, useState } from "react"
import { Grid, Row, Col, Modal, Divider } from "rsuite"
import PostDetail from "./PostDetail"

export default function ProfilePost({profile}){
    const [value, setValue] = useState([])
    let user_profile = profile.user_profile

    const [selectedPost, setSelectedPost] = useState({})

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/posts/${user_profile}/`)
            .then(res => res.json())
            .then(res => {
                setValue(res)
            })
    }, [user_profile])


    return (
        <>
            
            {(value.length === 0 ?
                <>
                    <Divider>Posts</Divider>
                    <h1 style={{textAlign: "center", fontSize: "3rem"}}>No Post Yet</h1>
                </>
                :
                <>
                    <Divider>{value.length} {value.length === 1 ? "Post" : "Posts"}</Divider>
                    <Grid fluid>
                        <Row>
                            {value.map((post) => (
                                <Col xs={8} className="profile-post" onClick={() => {
                                    setSelectedPost(post)
                                    handleOpen()
                                }} key={post.id}>
                                <img src={"http://127.0.0.1:8000/" + post.images[0].image} />
                            </Col>
                            ))}
                        </Row>
                        <Modal open={open} onClose={handleClose} size="lg">
                            <PostDetail open={open} post={selectedPost}/>
                        </Modal>
                    </Grid>
                </>
            )}
        </>
    )
}
