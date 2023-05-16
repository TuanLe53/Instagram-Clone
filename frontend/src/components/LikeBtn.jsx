import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";


export default function LikeBtn({post}) {
    const [isLike, setIsLike] = useState()
    const { authTokens, user } = useContext(AuthContext)  
    const post_id = post.id

    const fetchData = async () => {
        let res = await fetch( `http://127.0.0.1:8000/api/post/${post_id}/like/${user.user_id}/`,{
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        
        if (res.status === 200) {
            setIsLike(true)
        } else if (res.status === 404) {
            setIsLike(false)
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()
        if (isLike) {
            fetch(`http://127.0.0.1:8000/api/post/${post_id}/like/${user.user_id}/`, {
                method: "DELETE",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            setIsLike(false)
        } else {
            fetch(`http://127.0.0.1:8000/api/post/${post_id}/like/${user.user_id}/`, {
                method: "POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            setIsLike(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
        {(isLike?
        <div onClick={handleClick} className="post-btn">
                    <input type="checkbox" id="liked" checked/>
                    <label>
                        <ion-icon name="heart"></ion-icon>
                    </label>
        </div>
        :
        <div onClick={handleClick} className="post-btn">
                    <input type="checkbox" id="liked" />
                    <label>
                        <ion-icon name="heart"></ion-icon>
                    </label>
        </div>
        )}
        </>
    )
}