import { useContext, useEffect, useState } from "react"
import { Button } from "rsuite"
import AuthContext from "../context/AuthContext"

export default function FollowBtn({profile}){
    const [isFollow, setIsFollow] = useState()
    const { authTokens, user } = useContext(AuthContext)

    const fetchData = async () => {
        let res = await fetch( `http://127.0.0.1:8000/api/profile/${profile.user_profile}/follow/${user.user_id}/`,{
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        
        if (res.status === 200) {
            setIsFollow(true)
        } else if (res.status === 404) {
            setIsFollow(false)
        }   
    }

    const handleClick = async (e) => {
        e.preventDefault()
        if (isFollow) {
            fetch(`http://127.0.0.1:8000/api/profile/${profile.user_profile}/follow/${user.user_id}/`, {
                method: "DELETE",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            setIsFollow(false)
        } else {
            fetch(`http://127.0.0.1:8000/api/profile/${profile.user_profile}/follow/${user.user_id}/`, {
                method: "POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            setIsFollow(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            
            {(isFollow?
                <>
                    <Button appearance="primary" size="lg" onClick={handleClick}>Unfollow</Button>
                </>
                :
                <>
                    <Button appearance="primary" size="lg" onClick={handleClick}>Follow</Button>
                </>
            )}
        </>
    )
}
