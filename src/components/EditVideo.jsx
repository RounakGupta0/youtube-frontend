import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert'

const apiUrl = import.meta.env.VITE_API_URL

const EditVideo = () => {

  const {videoId} = useParams()

  const navigate = useNavigate()

  useEffect(()=> {
    getVideoInfo()
  },[videoId])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('Education')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [loader, setLoader] = useState(false)
  const [pageLoader,setPageLoading] = useState(false)
  const [isEditingThumbnail,setEditiongThumbnail] = useState(false)

  const getVideoInfo = async() => {
    try
    {
      setPageLoading(true)
      const videoRes = await axios.get(`${apiUrl}/video/byvideoId/`+videoId)
      console.log(videoRes.data.video)
      // setVideo(videoRes.data.video.videoUrl)
      setThumbnailUrl(videoRes.data.video.thumbnailUrl)
      setTitle(videoRes.data.video.title)
      setDescription(videoRes.data.video.description)
      setCategory(videoRes.data.video.category)
      tagHandler(videoRes.data.video.tags)
      setPageLoading(false)
    }
    catch(err)
    {
      console.log(err)
      setPageLoading(false)
    }
  }

  const tagHandler = (tags) => {
    var tagString = ''
    tags.map((tag)=>{
      tagString = tagString + tag + ','
    })
    // console.log(tagString)
    setTags(tagString)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      // console.log(thumbnail)
      // console.log(tags)
      // console.log(tags)
      // console.log(tags.split(',').filter((tag)=> tag != ""))

      const newVideo = new FormData()
      newVideo.append('title', title)
      newVideo.append('tags', JSON.stringify(tags.split(',').filter((tag)=> tag != "")))
      if (isEditingThumbnail)
      {
        newVideo.append('thumbnail', thumbnail)
      }
      newVideo.append('description', description)
      newVideo.append('category', category)

      const uploadedvideo = await axios.put(`${apiUrl}/video/updateVideo/`+videoId, newVideo, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
      )
      setLoader(false)
      console.log(uploadedvideo)
      clearAll()
      navigate(-1)
    }
    catch (err) {
      console.log(err)
      setLoader(false)
      swal("Error!", "Something is Wrong!", "Error");
    }
  }

  // const videoHandler = (e) => {
  //   setVideo(e.target.files[0])
  //   setVideoName(e.target.files[0].name)
  //   // console.log(VideoUrl)
  // }

  const thumbnailHandler = (e) => {
    console.log('thumbnail handler is called')
    // console.log(thumbnail)
    setThumbnail(e.target.files[0])
    const newthumbnailUrl = URL.createObjectURL(e.target.files[0])
    setThumbnailUrl(newthumbnailUrl)
    setEditiongThumbnail(true)
    // console.log(thumbnail)
  }

  const clearAll = () => {
    setThumbnail(null)
    setTags('')
    setThumbnailUrl('')
    setTitle('')
    setDescription('')
  }

  return (
    <div className='authForm-wrapper'>
      {
        pageLoader ? 
        <div className='editVideo-loader'>
          <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>
        </div> :
      <form className='authForm uploadForm' onSubmit={submitHandler}>
        <h2 className='form-header'>Edit Video Details</h2>
        {/* <div className='video-uploader'>
          <input className='hideUpload-content' onChange={videoHandler} type="file" name='video' id='videoUploadId' />
          <p>{videoName}</p>
          <button onClick={() => document.getElementById('videoUploadId').click()} type='button'><i className="fa-solid fa-upload"></i> Add video</button>
        </div> */}
        <div className={`thumbnail-uploader ${thumbnailUrl ? 'has-thumbnail' : 'empty-thumbnail'}`}>
          <input className='hideUpload-content' onChange={thumbnailHandler} type="file" name='thumbnail' id='thubnailuploadId' />
          <button onClick={() => document.getElementById('thubnailuploadId').click()} type='button' ><i className="fa-solid fa-picture-in-picture"></i> thumbnail upload</button>
          <img className='thumbnail-img' src={thumbnailUrl} alt="Thumbnail preview" />
        </div>
        <input className='form-input' onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder='Title' value={title} />
        <ReactQuill className='form-input description-editor'
          theme="snow"
          value={description}
          onChange={setDescription}
          placeholder='hello'
        />
        <textarea className='form-input' onChange={(e) => setTags(e.target.value)} name="tags" placeholder='Tags' value={tags}></textarea>
        <select className='form-input' onChange={(e) => setCategory(e.target.value)} name="category" value={category}>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Gaming">Gaming</option>
          <option value="Fashion">Fashion</option>
          <option value="Science And Fun">Science And Fun</option>
        </select>
        <button className='submit-btn' type='submit'>{loader ? <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i>uploading</span> : 'Publish changes'}</button>
      </form>
}
    </div>
  )
}

export default EditVideo