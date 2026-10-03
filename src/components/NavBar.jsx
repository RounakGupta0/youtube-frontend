import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const NavBar = () => {
    const [isLogin,setLogin] = useState(localStorage.getItem('isLogin'))

    const navigate = useNavigate()

    const loginStateHandler = (state) => {
        setLogin(state)
    }

    const logout = () => {
        localStorage.clear()
        setLogin(localStorage.getItem('isLogin'))
        navigate('/login')
    }

    return (
        <div>
            <div className='navbar'>
                <div className='navLogo-wrapper'>
                    <h1 className='logo-text' ><span className='logo'>SBS</span> Tube</h1>
                </div>
                <div className='link-wrapper'>
                    <Link className='link-elements' to='/home'>Home</Link>
                    {!isLogin &&<Link className='link-elements' to='/login'>Login</Link>}
                    {isLogin && <Link className='link-elements' to='/add-video'>Upload Video</Link>}
                    {isLogin && <Link className='link-elements' to='/profile'>{localStorage.getItem('channelName')}</Link>}
                    {isLogin && <Link className='logout link-elements' onClick={logout} to='/login'><span ><i className="fa-solid fa-right-from-bracket"></i></span>Logout</Link>}
                </div>
            </div>
 
            <div className='content-body'>
                <Outlet context={{loginStateHandler}}/>
            </div>
        </div>
    )
}

export default NavBar