import axios from 'axios'
import profie from '../assets/profilePic.webp'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'

const apiUrl = import.meta.env.VITE_API_URL

const Video = () => {

  const { id } = useParams()

  const [video, setVideo] = useState({})
  const [commentList, setCommentList] = useState([])
  const [comment, setComment] = useState('')
  const [commentLikeCount, setCommentLikeCount] = useState(0)
  // const [isLikedComment, setLikeComment] = useState(false)
  // const [isDislikedComment, setDislikeComment] = useState(false)
  const [isSubscribe, setIsSubscribe] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setDislike] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [subsriberCount, setsubscriberCount] = useState(0)

  useEffect(() => {
    getVideoById()
    getCommentById()
  }, [])

  const getVideoById = async () => {
    try {
      const token = localStorage.getItem('token')
      let d = {}
      if (token) {
        d = await axios.get(`${apiUrl}/video/likeDislikeStatus/` + id, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
      else {
        d = await axios.get(`${apiUrl}/video/likeDislikeStatus/` + id)
      }
      console.log(d.data)
      setVideo(d.data.video)
      // console.log(d.data.subscribeStatus)
      setIsSubscribe(d.data.subscribeStatus)
      console.log('like', d.data.likeStatus)
      console.log('dislike', d.data.dislikeStatus)
      setIsLiked(d.data.likeStatus)
      setDislike(d.data.dislikeStatus)
      setLikeCount(d.data.video.likeCount)
      setsubscriberCount(d.data.video.uploadedBy.subscriberCount)
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something Went Wrong...", "error");
    }
  }

  const subscribe = async () => {
    try {

      const token = localStorage.getItem('token')
      if (token) {
        if (isSubscribe) {
          const subscribeRes = await axios.put(`${apiUrl}/user/unsubscribe/` + video.uploadedBy._id, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })

          setIsSubscribe(subscribeRes.data.subscribeStatus)
        }
        else {
          console.log('heel')
          const subscribeRes = await axios.put(`${apiUrl}/user/subscribe/` + video.uploadedBy._id, {}, {
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

  const getCommentById = async () => {
    try {
      const commentListRes = await axios.get(`${apiUrl}/comment/commentsByLikeStatus/` + id, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(commentListRes.data.comments.reverse())
      setCommentList(commentListRes.data.comments)
      commentListRes.data.comments.map(c => (setCommentLikeCount(c.likeCount)))
      // commentList.map(comment => {
      //   console.log(comment.commentText)
      //   setLikeComment(comment.isLike)
      //   setDislikeComment(comment.isDislike)
      // })
      // console.log(commentList[0])

    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something Went Wrong...", "error");
    }
  }

  const addComment = async () => {
    try {
      const token = localStorage.getItem('token')
      // console.log(comment)
      if (token) {
        const commentRes = await axios.post(`${apiUrl}/comment/uploadComment/` + id, { comment: comment }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setComment('')
        console.log(commentRes.data.comment.commentText)
        getCommentById()
      }
      else {
        swal("Login Required", "Please log in to comment!", "warning")
      }
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something Went Wrong...", "error");
    }
  }

  const like = async () => {
    try {
      const token = localStorage.getItem('token')
      var currentDislikestatus = isDisliked
      if (token) {
        setIsLiked(!isLiked)
        if (isDisliked) {
          setDislike(false)
        }
        const likeRes = await axios.put(`${apiUrl}/video/like/` + id, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        console.log(likeRes)

        // setIsLiked(likeRes.data.likeStatus)
        setLikeCount(likeRes.data.likeCount)
        // if (likeRes.data.likeStatus) {
        //   setDislike(false)
        // }
      }
      else {
        swal("Login Required", "Please log in to like!", "warning")
      }
    }
    catch (err) {
      console.log(err)
      setIsLiked(isLiked)
      setDislike(currentDislikestatus)
      swal("Error!", "Something is wrong", "error");
    }
  }

  const dislike = async () => {
    try {
      const token = localStorage.getItem('token')
      var currentLikeStatus = isLiked
      if (token) {
        setDislike(!isDisliked)
        if (isLiked) {
          setIsLiked(false)
        }
        const DislikeRes = await axios.put(`${apiUrl}/video/dislike/` + id, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        console.log(DislikeRes)
        // setDislike(DislikeRes.data.dislikeStatus)
        setLikeCount(DislikeRes.data.likeCount)
        // if (DislikeRes.data.dislikeStatus) {
        //   setIsLiked(false)
        // }
      }
      else {
        swal("Login Required", "Please log in to dislike!", "warning")
      }
    }
    catch (err) {
      console.log(err)
      setDislike(isDisliked)
      setIsLiked(currentLikeStatus)
      swal("Error!", "Something is wrong", "error");
    }
  }

  const likeComment = async (commentId) => {
    try {
      setCommentList(comment => comment.map(c => (
        c._id === commentId ?
          {
            ...c,
            isLike: !c.isLike,
            isDislike: false,
          }
          : c
      )))
      const likeRes = await axios.put(`${apiUrl}/comment/like/` + commentId, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      console.log(likeRes)
      setCommentLikeCount(likeRes.data.likeCount)
    }
    catch (err) {
      swal("Error!", "Something is wrong", "error")
      console.log(err)
    }
  }

  const dislikeComment = async (commentId) => {
    try {
      setCommentList(comment => comment.map(c => (
        c._id === commentId ?
          {
            ...c,
            isDislike: !c.isDislike,
            isLike: false
          }
          : c
      )))

      const dislikeRes = await axios.put(`${apiUrl}/comment/dislike/` + commentId, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      console.log(dislikeRes)
      setCommentLikeCount(dislikeRes.data.likeCount)
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something is wrong", "error")
      setCommentList(commentList)
    }
  }

  const deleteCommentById = async (commentId) => {
    try {
      console.log('delete comment api call hua hai')
      const deleteRes = await swal({
        title: "Are you sure?",
        text: "After deletion you can't recover this comment!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      // console.log(deleteRes)

      if (deleteRes) {
        const deletedRes = await axios.delete(`${apiUrl}/comment/byId/` + commentId, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        console.log(deletedRes)
        swal("Comment Deleted!", {
          icon: "success",
        });
        getCommentById()
      }
    }
    catch (err) {
      console.log(err)
      swal("Error!", "Something is wrong", "error");
    }
  }

  return (
    <div className='vide-wrapper'>
      {
        video.videoUrl && <div className='videoContent-wrapper'>
          <div className='videoContent'>
            <video className='video-player' controls src={video.videoUrl}></video>
            <h1 className='video-title'>{video.title}</h1>
            <p>{video.views} views • {likeCount} likes</p>
          </div>
          <div className='channel-info--wrapper'>
            <div className='channel-info'>
              <img className='channel-pic' src={video.uploadedBy.profilePicUrl ? video.uploadedBy.profilePicUrl : profie} alt="" />
              <div className='channel-details'>
                <p className='channelInfo-name'>{video.uploadedBy.channelName}</p>
                <p className='channelInfo-subCount'>{subsriberCount} Subscribers</p>
              </div>
            </div>
            <div className='like-dislike-wrapper'>
              {!isLiked && <span onClick={like} className='like-dislike'><i className="fa-regular fa-thumbs-up"></i></span>}
              {isLiked && <span onClick={like} className='like-dislike'><i className="fa-solid fa-thumbs-up"></i></span>}
              {!isDisliked && <span onClick={dislike} className='like-dislike'><i className="fa-regular fa-thumbs-down"></i></span>}
              {isDisliked && <span onClick={dislike} className='like-dislike'><i className="fa-solid fa-thumbs-down"></i></span>}
              <button onClick={subscribe} className={isSubscribe ? 'subscribe-btn unsubscribe-btn' : 'subscribe-btn'} >{isSubscribe ? 'Unsubscribe' : 'Subscribe'}</button>
            </div>
          </div>
          <div className='videoPlayer-description'
            dangerouslySetInnerHTML={{
              __html: video.description
            }}
          />
          <hr />
          <div className='comment-wrapper'>
            <textarea className='comment-input' onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Comment' type="text" />
            <button className='comment-btn' onClick={addComment} type='button'>Add Comment</button>
          </div>
          <div className='commentList-wrapper'>
            {
              !commentList || commentList.length == 0 ?
                <div>
                  <p>No comments till now</p>
                </div> : (
                  commentList.map((comment) => (
                    <div className='comment-card' key={comment._id}>
                      <div className='comment-user-info'>
                        <img className='comment-channel-pic' src={comment.commentBy.profilePicUrl ? comment.commentBy.profilePicUrl : profie} alt="" />
                        <p className='comment-channel-name'>{comment.commentBy.channelName}</p>
                      </div>
                      <p>{comment.commentText}</p>
                      <div className='comment-likeDislike-wrapper'>
                        <div className='comment-like-wrapper'>
                          {!comment.isLike && <span className='comment-like-dislike' onClick={() => likeComment(comment._id)}><i className="fa-regular fa-thumbs-up"></i></span>}
                          {comment.isLike && <span className='comment-like-dislike' onClick={() => likeComment(comment._id)}><i className="fa-solid fa-thumbs-up"></i></span>}
                          <p>{commentLikeCount}</p>
                        </div>
                        {!comment.isDislike && <span className='comment-like-dislike' onClick={() => dislikeComment(comment._id)}><i className="fa-regular fa-thumbs-down"></i></span>}
                        {comment.isDislike && <span className='comment-like-dislike' onClick={() => dislikeComment(comment._id)}><i className="fa-solid fa-thumbs-down"></i></span>}
                      </div>
                      <div className='comment-edit-delete'>
                        {(comment.commentBy._id == localStorage.getItem('channelId')) && <span onClick={() => editCommentById(comment._id)} className='comment-edit-btn'><i className="fa-solid fa-pen"></i></span>}
                        {((comment.commentBy._id == localStorage.getItem('channelId')) || (video.uploadedBy._id == localStorage.getItem('channelId'))) && <span onClick={() => deleteCommentById(comment._id)} className='comment-delete-btn'><i className="fa-solid fa-trash"></i></span>}
                      </div>
                    </div>
                  )))
            }
          </div>

        </div>
      }
      <div className='videoSuggestion-wrapper'>
        <p>video suggestion</p>
      </div>
    </div>
  )
}

export default Video