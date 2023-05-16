import { Container, Content, Sidebar, Stack } from "rsuite"
import Posts from "../../components/Posts"
import { useContext, useEffect, useState } from "react"
import Avatar from "react-avatar"
import FollowBtn from "../../components/FollowBtn"
import ProfileIcon from "../../components/ProfileIcon"
import AuthContext from "../../context/AuthContext"

function Home() {
    
    return (
        <Container>
            <Container className="This-is-main">
                <Content>
                    <Posts />
                </Content>
            </Container>
            <Sidebar>
                <SuggestedUser />
            </Sidebar>
        </Container>
    )
}

export default Home

function SuggestedUser() {
    const [userList, setUserList] = useState([])
    const {user} = useContext(AuthContext)
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/suggested-user/${user.username}/`)
            .then(res => res.json())
            .then(res => {
                setUserList(res)
            })
    }, [])

    return (
        <>
            <h2>Suggested for you</h2>
            {userList.map((profile) => (
                <ProfileIcon profile={profile} />
            ))}
        </>
    )
}