import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import "rsuite/dist/rsuite-no-reset.min.css";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./utils/PrivateRoute"
import Home from "./pages/Home/Home"
import Profile from './pages/Profile/Profile'
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Layout from './pages/Layout';
import UpPost from './pages/UpPost/UpPost';

function App() {

  return (
    <BrowserRouter>
      
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute component={Home} />} />
            <Route path="/profile/:id" element={<PrivateRoute component={Profile} />} />
            <Route path="/upload" element={<PrivateRoute component={UpPost} />} />

          </Route>

          <Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Route>

        </Routes>
      </AuthProvider>

    </BrowserRouter>
  )
}

export default App
