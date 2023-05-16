import { useContext, useEffect, useState } from "react"
import {useLocation} from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import { Col, Container, Content, Grid, Header, Modal, Row, Stack, Button, Loader, Input, InputGroup } from "rsuite"
import { Link } from "react-router-dom"
import Picker from 'emoji-picker-react';
import Avatar from 'react-avatar';
import FollowBtn from "../../components/FollowBtn";
import InboxBtn from "../../components/InboxBtn";
import ProfilePost from "../../components/ProfilePost";
import get_user_profile from "../../data/fetchUser";

export default function Profile() {
    const location = useLocation()
    const user_profile = location.state?.user

    let { authTokens, user } = useContext(AuthContext)
    const[profile, setProfile] = useState()

    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const updateAvatar = async (e) => {
        e.preventDefault()
        let data = new FormData()
        data.append("avatar_img", file)

        let res = await fetch(`http://127.0.0.1:8000/api/profile/${user.username}/update-avatar/`, {
            method: 'PUT',
            headers: {
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: data
        })
        if (res.status === 200) {
            alert("Success")
        } else {
            alert("Failed")
        }
        get_user_profile(user_profile, authTokens).then((data) => setProfile(data))
        setOpen(false)
    }

    useEffect(() => {
        get_user_profile(user_profile, authTokens).then((data) => setProfile(data))
    }, [user_profile])

    return (
        <>

            {profile ?
                <>
                    <Container className="profile">
                        <Header>
                            <Grid fluid>
                                <Row>
                                    <Col>
                                        <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} round={true} size={150} onClick={() => setOpen(true)} />
                                    </Col>
                                    <Col>
                                        <Stack spacing={10}>
                                            <p>{user_profile}</p>
                                            {user.username === user_profile ? <Button appearance="primary" onClick={()=> setIsEdit(true)}>Edit Profile</Button> :
                                            <Stack spacing={10}>    
                                                <FollowBtn profile={{user_profile: user_profile}} />
                                                <InboxBtn />
                                            </Stack>
                                            }                                
                                        </Stack>
                                        <Stack spacing={20}>
                                            <Followers user_profile={user_profile} authTokens={authTokens} />
                                            <Followings user_profile={user_profile} authTokens={authTokens} />
                                        </Stack>
                                        <p>
                                            {profile.bio}
                                        </p>
                                        <p>{profile.location}</p>
                                    </Col>
                                </Row>
                            </Grid>
                        </Header>
                        <Content>
                            <ProfilePost profile={{user_profile: user_profile}}/>
                        </Content>
                    </Container>
            
                    {user.username === user_profile ?
                            <Modal open={open} onClose={() => setOpen(false)} className="avatar-box-update">
                                <Modal.Header>
                                    <Modal.Title>Update Avatar</Modal.Title>
                                </Modal.Header>
                        
                                <Modal.Body>
                                    <Container>
                                        <img src={"http://127.0.0.1:8000/" + profile.avatar_img} />
                                    </Container>
                        
                                    <form onSubmit={updateAvatar}>
                                        <label>Change Avatar</label><br />
                                        <input type="file" onChange={handleFileChange} name="avatar_img" /><br />
                                        <Button appearance="primary" type="submit">Upload</Button>
                                    </form>
                                </Modal.Body>
                        
                                <Modal.Footer>
                                    <Button onClick={() => setOpen(false)} appearance="subtle">Cancel</Button>
                                </Modal.Footer>
                            </Modal>
                        :
                        <Modal open={open} onClose={() => setOpen(false)} className="avatar-box">
                            <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} round={true} size={500} />
                        </Modal>
                    }

                    <Modal open={isEdit} onClose={() => setIsEdit(false)} className="edit-profile">
                        <EditProfileForm user_profile={user_profile} authTokens={authTokens} setIsEdit={setIsEdit} setProfile={setProfile} />
                    </Modal>

                </>
                :
                <>
                    <Loader />
                </>
            }
        </>
    )
}


function EditProfileForm({user_profile, authTokens, setIsEdit, setProfile}) {
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")

    const [showPickerBio, setShowPickerBio] = useState(false);
    const [showPickerLocation, setShowPickerLocation] = useState(false);

    const onEmojiClickBio = (e, emojiObject) => {
        setBio(prevInput => prevInput + emojiObject.emoji);
        setShowPickerBio(false);
    };
    const onEmojiClickLocation = (e, emojiObject) => {
        setLocation(prevInput => prevInput + emojiObject.emoji);
        setShowPickerLocation(false);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        let data = new FormData(e.target)
        let res = await fetch(`http://127.0.0.1:8000/api/profile/${user_profile}/edit-profile/`, {
            method: "PATCH",
            headers: {
                'Authorization': 'Bearer ' + String(authTokens.access),
            },
            body: data
        })

        if (res.status === 200) {
            alert("Success")
            setIsEdit(false)
            get_user_profile(user_profile, authTokens).then((data) => setProfile(data))
        }
        else {
            alert("Something went wrong!")
            setIsEdit(false)
        }
    }
    
    return (
        <>
            <Modal.Header>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <form onSubmit={handleSubmit}>
                        <label>Bio: </label>
                        <InputGroup inside>
                            <Input placeholder="Leave this filed blank if you want to delete the previous one." name="bio" value={bio} onChange={setBio}></Input><br />
                            <InputGroup.Addon>
                                <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPickerBio(val => !val)} />    
                            </InputGroup.Addon>    
                        </InputGroup>
                        {showPickerBio && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClickBio} />}
                        <label>Location: </label>
                        <InputGroup inside>
                            <Input placeholder="Leave this filed blank if you want to delete the previous one." name="location" value={location} onChange={setLocation}></Input><br />
                            <InputGroup.Addon>
                                <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPickerLocation(val => !val)} />    
                            </InputGroup.Addon>    
                        </InputGroup>
                        {showPickerLocation && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClickLocation} />}
                        <Button type="submit" appearance="primary">Save</Button>
                    </form>
                </Container>
            </Modal.Body>
        </>
    )
}


function Followers({user_profile, authTokens}) {
    const [followers, setFollowers] = useState([])
    const [showFollowers, setShowFollowers] = useState(false)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/profile/${user_profile}/follower/`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        }).then(res => res.json())
            .then(res => {
            setFollowers(res)
        })
    }, [user_profile])

    return (
        <>
            <p onClick={() => setShowFollowers(true)}>{followers.length} Followers</p>

            <Modal open={showFollowers} onClose={() => setShowFollowers(false)} className="Followers" size="xs">
                <Modal.Header>
                    Followers
                </Modal.Header>
                <Modal.Body>
                {followers.length === 0
                        ?
                        <p>0 Follower</p>
                        :
                        followers.map((follower) => (
                            <FollowerUser user={follower} authTokens={authTokens} key={follower.id}/>
                        ))
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

function Followings({user_profile, authTokens}) {
    const [followings, setFollowings] = useState([])
    const [showFollowings, setShowFollowings] = useState(false)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/profile/${user_profile}/following/`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        }).then(res => res.json())
            .then(res => {
            setFollowings(res)
        })
    }, [user_profile])

    return (
        <>
            <p onClick={() => setShowFollowings(true)}>{followings.length} Followings</p>

            <Modal open={showFollowings} onClose={() => setShowFollowings(false)} className="Followers" size="xs">
                <Modal.Header>
                    Followings
                </Modal.Header>
                <Modal.Body>
                {followings.length === 0
                        ?
                        <p>0 Following</p>
                        :
                        followings.map((follower) => (
                            <FollowingUser user={follower} authTokens={authTokens} key={follower.id}/>
                        ))
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

function FollowerUser({user, authTokens}) {
    const [followUser, setFollowUser] = useState()
    useEffect(() => {
        get_user_profile(user.follower, authTokens).then((data) => setFollowUser(data))
    }, [])

    return (
        <Link to={`/profile/${user.follower}`} state={{ user: user.follower }} >
            <Stack spacing={10}>
                {followUser ? <Avatar src={"http://127.0.0.1:8000/" + followUser.avatar_img} round={true} size={40} /> : <Loader /> }
                <p>{user.follower}</p>
                <FollowBtn profile={{user_profile: user.follower}} />
            </Stack>
        </Link>
    )
}
function FollowingUser({user, authTokens}) {
    const [followUser, setFollowUser] = useState()
    useEffect(() => {
        get_user_profile(user.user, authTokens).then((data) => setFollowUser(data))
    }, [])

    return (
        <Link to={`/profile/${user.user}`} state={{ user: user.user }} >
            <Stack spacing={10}>
                {followUser ? <Avatar src={"http://127.0.0.1:8000/" + followUser.avatar_img} round={true} size={40} /> : <Loader /> }
                <p>{user.user}</p>
                <FollowBtn profile={{user_profile: user.user}} />
            </Stack>
        </Link>
    )
}