import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Reset from './Reset';
import FriendProfile from './FriendProfile';
import News from './News';
import Chat from './Chat';
import EditProfile from './EditProfile';
import RightSide from '../RightSideBar/RightSide';
import Mobs from './Mobs';

const Pages = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/reset' element={<Reset />}></Route>
        <Route path='/profile/:id' element={<FriendProfile />}></Route>
        <Route path='/profile/:name' element={<FriendProfile />}></Route>
        <Route path='/news' element={<News />}></Route>
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/rightSide" element={<RightSide />} />
        <Route path="/mobs" element={<Mobs />} />
      </Routes>
    </div>
  )
}

export default Pages