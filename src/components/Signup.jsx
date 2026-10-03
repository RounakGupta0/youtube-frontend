import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import swal from 'sweetalert'

const Signup = () => {
    const [channelName, setChannelName] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)

    const apiUrl = import.meta.env.VITE_API_URL
    // console.log(apiUrl)

    const { loginStateHandler } = useOutletContext()

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        try {
            setLoading(true)
            e.preventDefault()
            console.log(channelName, email, password, description)
            const res = await axios.post(`${apiUrl}/user/signup`, {
                channelName: channelName,
                email: email,
                password: password,
                description: description
            })
            // console.log(res)
            const data = await axios.post(`${apiUrl}/user/login`, {
                email: email,
                password: password,
            })
            localStorage.setItem('token', data.data.token)
            localStorage.setItem('isLogin', true)
            loginStateHandler(true)
            setLoading(false)
            // await swal("Success!", "Account Created Success...", "success");
            navigate('/home')
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
                <h2>Create Account</h2>
                <input className='form-input' onChange={(e) => setChannelName(e.target.value)} type="text" name='channelName' placeholder='Channel Name' value={channelName} />
                <input className='form-input' onChange={(e) => setDescription(e.target.value)} type="text" name='Description' placeholder='Description' value={description} />
                <input className='form-input' onChange={(e) => setEmail(e.target.value)} type="email" name='Email' placeholder='Email' value={email} />
                <input className='form-input' onChange={(e) => setPassword(e.target.value)} type="password" name='Password' placeholder='Password' value={password} />
                <button className='submit-btn' type='submit'>{isLoading && <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>} {isLoading ? 'Creating Account' : 'Create Account'}</button>
                <Link className='login-link' to='/login'>Login if already registered....</Link>
            </form>
        </div>
    )
}

export default Signup