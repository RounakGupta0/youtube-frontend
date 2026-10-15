import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import samepleProfile from '../assets/profilePic.webp'
import samepleCoverPic from '../assets/default coverPic.jpg'

const apiUrl = import.meta.env.VITE_API_URL


const EditProfile = () => {

    const { channelId } = useParams()

    const [channelName, setChannelName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [description, setDescription] = useState('')
    const [profilePicUrl, setProfilePicUrl] = useState('')
    const [coverPicUrl, setCoverPicUrl] = useState('')
    const [pageLoader, setpageLoader] = useState(false)
    const [coverPic, setCoverPic] = useState(null)
    const [profilePic, setProfilePic] = useState(null)

    useEffect(() => {
        getChannelDetails()
    }, [])

    const getChannelDetails = async () => {
        try {
            setpageLoader(true)
            const channelData = await axios.get(`${apiUrl}/user/channelDetails/` + channelId)
            console.log(channelData.data.channel)

            setCoverPicUrl(channelData.data.channel.coverPicUrl)
            setChannelName(channelData.data.channel.channelName)
            setDescription(channelData.data.channel.description)
            setEmail(channelData.data.channel.email)
            setProfilePicUrl(channelData.data.channel.profilePicUrl)
            setpageLoader(false)
        }
        catch (err) {
            console.log(err)
            setpageLoader(false)
        }
    }

    const coverPicHandler = async(e) => {
        try
        {
            // setCoverPic(e.target.files[0])
            setCoverPic(e.target.files[0])
        }
        catch(err)
        {
            console.log(err)
        }
    }

    const profilePicHandler = async(e) => {
        try
        {
            setProfilePic(e.target.files[0])
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <div className='edit-profile-wrapper'>
            {
                pageLoader ?
                    <div className='editVideo-loader'>
                        <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>
                    </div> :
                    <form className='edit-profile-Form'>
                        <div className='edit-profile-Form-coverPic-wrapper'>
                            <input onChange={coverPicHandler} type="file" name="coverPic" id='edit-profile-coverPic' />
                            <button className='profile-coverPic-editBtn' onClick={() => document.getElementById('edit-profile-coverPic').click()}><span><i className="fa-solid fa-pen-to-square "></i></span>Edit CoverPic</button>
                            <img className='edit-profile-Form-coverPicUrl' src={coverPicUrl ? coverPicUrl : samepleCoverPic} alt="coverPic" />
                        </div>
                        <div className='edit-profile-form-profileDetails-wrapper'>
                            <div className='edit-profile-form-profilePic-wrapper'>
                                <input onChange={profilePicHandler} type="file" name="profilePic" id='edit-profile-profilePic' />
                                <button className='profile-profilePic-editBtn' onClick={() => document.getElementById('edit-profile-profilePic').click()}><span><i className="fa-solid fa-pen-to-square "></i></span>Edit profilePic</button>
                                <img className='edit-profile-Form-profilePicUrl' src={profilePicUrl ? profilePic : samepleProfile} alt="profilePic" />
                            </div>
                            <div className='edit-profile-from-profileDetails-wrapper'>
                                <input className='edit-profile-form-details-input' onChange={(e) => setChannelName(e.target.value)} type="text" placeholder='channelName' name='channelName' value={channelName} />
                                <input className='edit-profile-form-details-input' onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email' name='email' value={email} />
                                <input required className='edit-profile-form-details-input' onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Current Password' name='password' value={password} />
                                <input className='edit-profile-form-details-input' onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder='New Password' name='newPassword' value={newPassword} />
                                <input className='edit-profile-form-details-input' onChange={(e) => setDescription(e.target.value)} type="text" placeholder='description' name='description' value={description} />
                                <button className='edit-profile-form-details-input edit-profile-form-details-input-btn' type="submit">save Changes</button>
                            </div>
                        </div>
                    </form>
            }
        </div>
    )
}

export default EditProfile