import { Stack } from "rsuite"
import FollowBtn from "./FollowBtn"
import { Link } from "react-router-dom"
import Avatar from "react-avatar"

export default function ProfileIcon({ profile }) {
    
    return (
        <Link to={`/profile/${profile.user}`} state={{ user: profile.user }} >
            <Stack spacing={70}>
                <Stack spacing={10}>
                    <Avatar src={"http://127.0.0.1:8000/" + profile.avatar_img} round={true} size={40} />
                    <p>{profile.user}</p>
                </Stack>
                <FollowBtn profile={{ user_profile: profile.user }} />
            </Stack>
        </Link>
    )
}