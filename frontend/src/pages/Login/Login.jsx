import { Container, Header, Content, Form, ButtonToolbar, Button, Navbar, Panel, FlexboxGrid} from 'rsuite';
import AuthContext from "../../context/AuthContext";
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    let { loginUser } = useContext(AuthContext)

    
    return (
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
                            <Form fluid onSubmit={loginUser}>
                                <Form.Group>
                                    <Form.ControlLabel>Username</Form.ControlLabel>
                                    <Form.Control name="username" required/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.ControlLabel>Password</Form.ControlLabel>
                                    <Form.Control name="password" type="password" autoComplete="off" required/>
                                </Form.Group>
                                <Form.Group>
                                    <ButtonToolbar>
                                        <Button appearance="primary" type="submit">Sign in</Button>
                                        <Link to="/register">Register</Link>
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

export default Login