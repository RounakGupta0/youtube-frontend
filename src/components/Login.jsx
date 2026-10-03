import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import swal from 'sweetalert'

const Login = () => {
  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)

  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL
  // console.log(apiUrl)

  const { loginStateHandler } = useOutletContext()

  const submitHandler = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      console.log(channelName, email, password, description)
      const res = await axios.post(`${apiUrl}/user/login`, {
        email: email,
        password: password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('channelId', res.data.channelId)
      localStorage.setItem('channelName', res.data.channelName)
      localStorage.setItem('isLogin', true)
      loginStateHandler(true)
      console.log(res)
      navigate('/home')
      setLoading(false)
    }
    catch (err) {
      await swal("Error!", "Something Went Wrong...", "error");
      console.log(err.message)
      setLoading(false)
    }
  }

  return (
    <div className='authForm-wrapper'>
      <form onSubmit={submitHandler} className='authForm'>
        <h2>Login</h2>
        <input className='form-input' onChange={(e) => setEmail(e.target.value)} type="email" name='Email' placeholder='Email' value={email} />
        <input className='form-input' onChange={(e) => setPassword(e.target.value)} type="password" name='Password' placeholder='Password' value={password} />
        <button className='submit-btn' type='submit'>{isLoading && <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>} {isLoading ? 'Logging In...' : 'Login'}</button>
        <Link className='login-link' to='/signup'>Signup if u have no Account..</Link>
      </form>
    </div>
  )
}

export default Login