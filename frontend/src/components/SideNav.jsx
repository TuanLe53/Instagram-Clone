import { useContext, forwardRef, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {  Drawer, Input, Nav } from "rsuite"
import HomeIcon from '@rsuite/icons/legacy/Home';
import MessageIcon from '@rsuite/icons/Message';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ExitIcon from '@rsuite/icons/Exit';
import AdminIcon from '@rsuite/icons/Admin';
import SearchIcon from '@rsuite/icons/Search';
import AuthContext from "../context/AuthContext";
import { debounce } from "lodash";
import ProfileIcon from "./ProfileIcon";

const NavLink = forwardRef(({ href, children, ...rest }, ref) => (
    <Link ref={ref} to={href} {...rest}>
        {children}
    </Link>
  ));

const SideNav = ({ active, onSelect, ...props }) => {
    let { user, logoutUser } = useContext(AuthContext)
    const [openSearchBar, setOpenSearchBar] = useState(false)

    return (
    <>
        <Nav {...props} vertical activeKey={active} onSelect={onSelect} style={{ width: 100 }} >
            <Nav.Item as={NavLink} eventKey="home" icon={<HomeIcon />} href="/">
                Home
            </Nav.Item>
            <Nav.Item eventKey="search" icon={<SearchIcon />} onClick={() => setOpenSearchBar(true)}>
                Search
            </Nav.Item>
                
            <Nav.Item icon={<AdminIcon />} eventKey="profile" as={NavLink} href={(user ? `/profile/${user.username}` : `/`)} state={(user ? { user: user.username } : { user: null })}>
                Profile
            </Nav.Item>
                
            {/* <Nav.Item eventKey="messages" icon={<MessageIcon />} as={NavLink} href="/chat/:chatId">
                Messages
            </Nav.Item> */}
                
            <Nav.Item eventKey="upload" icon={<FileUploadIcon />} as={NavLink} href="/upload">
                Upload
            </Nav.Item>
                
            <Nav.Item eventKey="logout" icon={<ExitIcon />} onClick={logoutUser}>
                Logout
            </Nav.Item>
        </Nav>
        <Drawer open={openSearchBar} onClose={() => setOpenSearchBar(false)} placement="left" size="xs">
            <SearchBar />
        </Drawer>
    </>
    );
  };

export default SideNav

function SearchBar() {
    const [data, setData] = useState([])
    const [username, setUsername] = useState("")

    const searchUser = () => {
        fetch(`http://127.0.0.1:8000/api/search/?username=${username}`)
            .then(res => res.json())
            .then(res => {
                setData(res)
            })
    }

    const debounceSearch = debounce(searchUser, 700)

    useEffect(() => {
        debounceSearch()
    }, [username])

    return (
        <>
            <Drawer.Header>
                <Input value={username} onChange={setUsername} placeholder="Enter username" />
            </Drawer.Header>
            <Drawer.Body className="search-list">
                {data.map((user) => (
                    <ProfileIcon profile={user} />
                ))}
            </Drawer.Body>
        </>
    )
}