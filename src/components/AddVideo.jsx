import axios from 'axios'
import React, { useState } from 'react'
import ReactQuill from 'react-quill-new'
import "react-quill-new/dist/quill.snow.css";
import swal from 'sweetalert'

const apiUrl = import.meta.env.VITE_API_URL

const AddVideo = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('Education')
  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [videoName, setVideoName] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [loader, setLoader] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)

      const newVideo = new FormData()
      newVideo.append('title', title)
      newVideo.append('tags', JSON.stringify(tags.split(',')))
      newVideo.append('video', video)
      newVideo.append('thumbnail', thumbnail)
      newVideo.append('description', description)
      newVideo.append('category', category)

      const uploadedvideo = await axios.post(`${apiUrl}/video/uploadVideo`, newVideo, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
      )
      setLoader(false)
      console.log(uploadedvideo)

    }
    catch (err) {
      console.log(err)
      setLoader(false)
      swal("Error!", "Something is Wrong!", "Error");
    }
  }

  const videoHandler = (e) => {
    setVideo(e.target.files[0])
    setVideoName(e.target.files[0].name)
    // console.log(VideoUrl)
  }

  const thumbnailHandler = (e) => {
    setThumbnail(e.target.files[0])
    const thumbnailUrl = URL.createObjectURL(e.target.files[0])
    setThumbnailUrl(thumbnailUrl)
  }

  return (
    <div className='authForm-wrapper'>
      <form className='authForm uploadForm' onSubmit={submitHandler}>
        <h2 className='form-header'>Upload Video</h2>
        <div className='video-uploader'>
          <input className='hideUpload-content' onChange={videoHandler} type="file" name='video' id='videoUploadId' />
          <p>{videoName}</p>
          <button onClick={() => document.getElementById('videoUploadId').click()} type='button'><i className="fa-solid fa-upload"></i> Add video</button>
        </div>
        <div className={`thumbnail-uploader ${thumbnailUrl ? 'has-thumbnail' : 'empty-thumbnail'}`}>
          <input className='hideUpload-content' onChange={thumbnailHandler} type="file" name='thumbnail' id='thubnailuploadId' />
          <button onClick={() => document.getElementById('thubnailuploadId').click()} type='button' ><i className="fa-solid fa-picture-in-picture"></i> thumbnail upload</button>
          {thumbnailUrl && <img className='thumbnail-img' src={thumbnailUrl} alt="Thumbnail preview" />}
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
        <button className='submit-btn' type='submit'>{loader ? <span ><i className="fa-solid fa-spinner fa-spin-pulse"></i>uploading</span> : 'Publish video'}</button>
      </form>
    </div>
  )
}

export default AddVideo