import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultPic from '../assets/profilePic.webp'

const apiUrl = import.meta.env.VITE_API_URL

const Home = () => {

  const [videos, setVideos] = useState([])

  useEffect(() => {
    videoHandler()
  }, [])

  const navigate = useNavigate()

  const videoHandler = async () => {
    try {
      const allVidoes = await axios.get(`${apiUrl}/video/allVideo`)
      setVideos(allVidoes.data.videos.reverse())
      console.log(allVidoes.data.videos)
    }
    catch (err) {
      console.log(err)
    }
  }

  const uploadedTime = (uploadTime) => {
    const seconds = Math.floor((Date.now() - new Date(uploadTime)) / 1000)
    if (seconds < 60) {
      return `${seconds} seconds ago`
    }
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      if (minutes == 1) {
        return `${minutes} minute ago`
      }
      return `${minutes} minutes ago`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      if (hours == 1) {
        return `${hours} hour ago`
      }
      return `${hours} hours ago`
    }
    const days = Math.floor(hours / 24)
    if (days < 30) {
      if (days == 1) {
        return `${days} day ago`
      }
      return `${days} days ago`
    }
    const months = Math.floor(days / 30)
    if (months < 12) {
      if (months == 1) {
        return `${months} month ago`
      }
      return `${months} months ago`
    }
    const years = Math.floor(months / 12)
    if (years == 1) {
      return `${years} year ago`
    }
    return `${years} years ago`
  }

  return (
    <div className='home-wrapper'>
      <div className='homeVideo-wrapper'>
        {
          videos.map((video) => (
            <div onClick={() => { navigate('/video/' + video._id) }} className='homeVideo-card' key={video._id}>
              <div className='thumbnail-wrapper'>
                <img className='thumbnail' src={video.thumbnailUrl} alt="Thumbnail" />
              </div>
              <div className='homeVideoCard-content' >
                <h2 >{video.title}</h2>
                <div className='homeVideoCard-description'
                  dangerouslySetInnerHTML={{
                    __html: video.description
                  }}
                />
                <div className='homeVideoCardContent-profile'>
                  <img src={video.uploadedBy.profilePicUrl == "" ? defaultPic : video.uploadedBy.profilePic} alt="" />
                  <p className='homeVideoCard-channelName'>{video.uploadedBy.channelName}</p>
                </div>
                <p>{uploadedTime(video.createdAt)}</p>
                <p className='homeVideoCard-category'>{video.category}</p>
                <p>{video.views} views</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home