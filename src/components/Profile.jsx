import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import coverPic from '../assets/default coverPic.jpg'
import profile from '../assets/profilePic.webp'
import swal from 'sweetalert'

const apiUrl = import.meta.env.VITE_API_URL

const Profile = () => {

  const { channelId } = useParams()

  const navigate = useNavigate()

  const [channelDeails, setchannelDetails] = useState('')
  const [channelVideos, setChannelvideos] = useState([])
  const [isDeletingVideo, setdeletingVideo] = useState(false)
  const [pageLoader, setpageLoading] = useState(false)
  const [isSubscribe, setIsSubscribe] = useState(false)
  const [subscriberCount, setsubscriberCount] = useState(0)

  useEffect(() => {
    getProfileDetails()
  }, [channelId])

  const getProfileDetails = async () => {
    try {
      setpageLoading(true)
      const profileDetails = await axios.get(`${apiUrl}/video/byChannelId/` + channelId)
      setchannelDetails(profileDetails.data.channel)
      setsubscriberCount(profileDetails.data.channel.subscriberCount)
      console.log(profileDetails.data.videos)
      setChannelvideos(profileDetails.data.videos)
      setpageLoading(false)
    }
    catch (err) {
      console.log(err)
      setpageLoading(false)
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

  const deleteVideoByVideoId = async (videoId) => {
    try {
      const deleteRes = await swal({
        title: "Are you sure?",
        text: "After deletion you can't recover this Video!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })

      if (deleteRes) {
        setdeletingVideo(true)
        const videoDeleteRes = await axios.delete(`${apiUrl}/video/deleteById/` + videoId, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(videoDeleteRes)
        swal("Video Deleted!", {
          icon: "success",
        });
        setdeletingVideo(false)
        getProfileDetails()
      }
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something is wrong", "error");
      setdeletingVideo(false)
      getProfileDetails()
    }
  }

  const subscribe = async () => {
    try {

      const token = localStorage.getItem('token')
      if (token) {
        if (isSubscribe) {
          const subscribeRes = await axios.put(`${apiUrl}/user/unsubscribe/` + channelId, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })

          setIsSubscribe(subscribeRes.data.subscribeStatus)
        }
        else {
          console.log('heel')
          const subscribeRes = await axios.put(`${apiUrl}/user/subscribe/` + channelId, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
          console.log(subscribeRes.data.subscribeStatus)
          setIsSubscribe(subscribeRes.data.subscribeStatus)
          setsubscriberCount(subscribeRes.data.subscriberCount)
        }
      }
      else {
        swal("Login Required", "Please log in to subscribe!", "warning")
      }
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something Went Wrong...", "error");
    }
  }

  return (
    <div className='channel-page-wrapper'>
      {
        pageLoader &&
        <div className='editVideo-loader'>
          <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>
        </div>
      }
      {channelDeails.channelName &&
        <div className='channel-details-wrapper' style={{ backgroundImage: `url(${channelDeails.coverPic ? channelDeails.coverPic : coverPic})` }}>
          <img className='channel-details-profilePic' src={channelDeails.profilePic ? channelDeails.profilePic : profile} alt="profilePic" />
          <div className='channel-details-info'>
            <h3 className='channel-detailsInfo-name'>{channelDeails.channelName}</h3>
            <p className='channel-details-info-subCount'>{subscriberCount} Subscribers</p>
          </div>
          {
            (channelId != localStorage.getItem('channelId')) &&
            <div className='profile-subscribe-btn-wrapper'>
              <button onClick={subscribe} className={isSubscribe ? 'subscribe-btn unsubscribe-btn' : 'subscribe-btn'} >{isSubscribe ? 'Unsubscribe' : 'Subscribe'}</button>
            </div>
          }
          {
            (channelId == localStorage.getItem('channelId')) && <p onClick={()=>navigate('/edit-profile/'+ localStorage.getItem('channelId'))}><span><i className="fa-solid fa-user-pen profile-edit-btn"></i></span></p>
          }
        </div>
      }
      {channelDeails.channelName && channelVideos.length == 0 ?
        <div>
          <p>No video found</p>
        </div> :
        <div className='channel-page-videos-wrapper'>
          {
            channelVideos.map((video) => (
              <div className='channel-videos-card' key={video._id}>
                <img onClick={() => navigate('/video/' + video._id)} className='channel-videoCard-thumbnail' src={video.thumbnailUrl} alt="thumbnail" />
                <div onClick={() => navigate('/video/' + video._id)} className='channel-videoCard-text'>
                  <h3 className='channel-videoCard-title'>{video.title}</h3>
                  <p className='channel-videoCard-description' dangerouslySetInnerHTML={{
                    __html: video.description
                  }} />
                  <p className='homeVideoCard-category'>{video.category}</p>
                  <h4 className='channel-videoCard-viewsCount'>{video.views} views</h4>
                  <h5 className='channel-videoCard-createdAt'>{uploadedTime(video.createdAt)}</h5>
                </div>
                {
                  (channelId == localStorage.getItem('channelId')) &&
                  (
                    isDeletingVideo ? <span className='loader'><i className="fa-solid fa-spinner fa-spin-pulse"></i></span> :
                      <div >
                        <span onClick={() => navigate('/edit-video/' + video._id)} className='comment-edit-btn'><i className="fa-solid fa-pen"></i></span>
                        <span onClick={() => deleteVideoByVideoId(video._id)} className='comment-delete-btn'><i className="fa-solid fa-trash"></i></span>
                      </div>
                  )
                }
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Profile