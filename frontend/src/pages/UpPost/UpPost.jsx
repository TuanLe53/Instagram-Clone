import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import  AuthContext  from "../../context/AuthContext"
import { Button, Container, Input, InputGroup } from "rsuite"
import Picker from 'emoji-picker-react';

export default function UpPost() {
    let { authTokens, user } = useContext(AuthContext)
    const navigate = useNavigate()
    
    const [description, setDescription] = useState("")
    const [file, setFileList] = useState(null);

    const [showPicker, setShowPicker] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setDescription(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
      };

    const handleFileChange = (e) => {
        setFileList(e.target.files);
    };

    const remove = (name) => {
        setFileList(files.filter(item => item.name !== name))
    }
    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            return alert("None");
        } 
        let data = new FormData(e.target)
        data.append("created_by", user.user_id)

        files.forEach((file) => {
            data.append("images", file)
        })

        let response = await fetch("http://127.0.0.1:8000/api/upload/", {
            method: "POST",
            headers:{
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: data
        })
        if (response.status === 201) {
            alert("Success")
            navigate(`/profile/${user.username}`, {state: {user: user.username}})
        }else{
            alert('Something went wrong!')
        }
    }
    const files = file ? [...file] : [];

    return (
        <Container fluid>
            <form onSubmit={handleUpload} className="uppost-form">
                <legend>Upload</legend>
                <label>Images:</label><br />
                <input type='file' accept="image/*" multiple onChange={handleFileChange}></input>
                <hr/>
                <ul className="preview-imgs">
                    {files.map((file, i) => (
                        <li key={i}>
                            <div className="container">
                                <img src={URL.createObjectURL(file)} />
                                <p className="rm-btn" onClick={() => remove(file.name)}>REMOVE</p>
                            </div>
                            {/* {file.name} - {file.type} */}
                        </li>
                    ))}
                </ul>
                <label>Description: </label>
                <InputGroup inside>
                    <Input placeholder="Enter your description" name="description" value={description} onChange={setDescription}></Input><br />
                    <InputGroup.Addon>
                        <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} />    
                    </InputGroup.Addon>    
                </InputGroup>
                {showPicker && <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />}

                {files.length === 0
                    ?
                    <Button appearance="primary" type="submit" disabled>Upload</Button>
                    :
                    <Button appearance="primary" type="submit">Upload</Button>
                }
            </form>

        </Container>
    )
}