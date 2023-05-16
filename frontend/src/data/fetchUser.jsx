let get_user_profile = async (username, authTokens) => {
    let response = await fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
    })
    let data = await response.json()
    return data
}
export default get_user_profile