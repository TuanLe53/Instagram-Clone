import { Container, Header, Content, Footer, Form, ButtonToolbar, Button, Navbar, Panel, FlexboxGrid} from 'rsuite';
import { useNavigate, Link } from 'react-router-dom'
import { useRef, useState } from "react"

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    })

    const handleData = (e) => setFormData(e);

    const formRef = useRef()

    const navigate = useNavigate()

    const submit = async (form, e) => {
        e.preventDefault()
        if (formData.password !== formData.password2) {
            return alert("Password do not match")
        }
        let response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if(response.status === 201){
            alert("Success")
            navigate("/login")
        }else{
            alert('Something went wrong!')
        }
    }

    return(
    <Container>
        <Header>
            <Navbar appearance="inverse">
                <Navbar.Brand>
                    <a style={{ color: '#fff' }}>Social Media</a>
                </Navbar.Brand>
            </Navbar>
        </Header>
        <Content>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>Login</h3>} bordered>
                        <Form fluid onChange={handleData} onSubmit={submit} ref={formRef}>
                            <Form.Group>
                                <Form.ControlLabel>Username</Form.ControlLabel>
                                <Form.Control name="username"  required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Email address</Form.ControlLabel>
                                <Form.Control name="email" type='email' required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control name="password" type="password" autoComplete="off" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Confirm password</Form.ControlLabel>
                                <Form.Control name="password2" type="password" autoComplete="off" required/>
                            </Form.Group>
                            <Form.Group>
                                <ButtonToolbar>
                                        <Button appearance="primary" type='submit'>Register</Button>
                                        <Link to="/login">Login</Link>
                                </ButtonToolbar>
                            </Form.Group>
                        </Form>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    </Container>
    )    
}

export default Register