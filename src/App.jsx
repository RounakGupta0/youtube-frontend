import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import NavBar from './components/NavBar'
import Login from './components/Login'
import AddVideo from './components/AddVideo'
import EditVideo from './components/EditVideo'
import ChannelVideo from './components/ChannelVideo'
import Video from './components/Video'
import Profile from './components/Profile'
import Signup from './components/SIgnup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<NavBar />} >
          <Route path='' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/add-video' element={<AddVideo />} />
          <Route path='/edit-video' element={<EditVideo />} />
          <Route path='/channel-video/:id' element={<ChannelVideo />} />
          <Route path='/video/:id' element={<Video />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App