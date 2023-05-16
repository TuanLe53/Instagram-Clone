import { Container, Sidebar } from 'rsuite';
import { Outlet } from "react-router-dom";
import SideNav from '../components/SideNav';
import { useState } from 'react';

function Layout() {
    const [active, setActive] = useState('home');

    return (
        <Container >
            <Sidebar className='side-nav'>
                <h1>Social App</h1>
                <SideNav active={active} onSelect={setActive} />
            </Sidebar>
            <Container className='main-content'>
                <Outlet/>
            </Container>
        </Container>
    )
}

export default Layout