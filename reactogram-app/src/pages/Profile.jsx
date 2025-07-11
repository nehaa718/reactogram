import React, { useState, useEffect } from 'react';
import './Profile.css';
import Modal from 'react-bootstrap/Modal';
import horizontalMoreAction from '../images/horizontalMoreAction.PNG';
import '../components/Card.css';
import { API_BASE_URL } from '../../src/config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector(state => state.userReducer);
  const navigate = useNavigate();

  const [image, setImage] = useState({ preview: '', data: '' });
  const [myallposts, setMyallposts] = useState([]);
  const [postDetail, setPostDetail] = useState({});
  const [show, setShow] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

  const CONFIG_OBJ = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };

  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };

  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append('file', image.data);
    return await axios.post(`${API_BASE_URL}/uploadFile`, formData);
  };

  const deletePost = async (postId) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        getMyPosts();
        setShow(false);
      } else {
        toast.error("Failed to delete the post!");
      }
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);  // ✅ Debug line added
      toast.error("Something went wrong while deleting the post.");
    }
  };



  const getMyPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJ);
    if (response.status === 200) {
      setMyallposts(response.data.posts);
    } else {
      toast.error('Some error occurred while getting all your posts');
    }
  };

  const showDetail = (post) => {
    setPostDetail(post);
    handleShow();
  };

  const addPost = async () => {
    if (!image.preview) {
      toast.error('Post image is mandatory!');
    } else if (!caption) {
      toast.error('Post caption is mandatory!');
    } else if (!location) {
      toast.error('Location is mandatory!');
    } else {
      setLoading(true);
      try {
        const imgRes = await handleImgUpload();
        const request = {
          description: caption,
          location: location,
          image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
        };
        const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ);
        setLoading(false);
        if (postResponse.status === 201) {
          toast.success('Post created successfully!');
          navigate('/posts');
        } else {
          toast.error('Some error occurred while creating post');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Failed to create post');
      }
    }
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <div className="container shadow mt-3 p-4">
      <div className="row">
        <div className="col-md-6 d-flex flex-column">
          <img className="p-2 profile-pic img-fluid" alt="profile pic" src="https://plus.unsplash.com/premium_photo-1681426478241-11b262dd1d21?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <p className="ms-3 fs-5 fw-bold">{user?.user?.email}</p>
          <p className="ms-3 fs-5">{user?.user?.fullName}</p>
          <p className="ms-3 fs-5"> Follow {user?.user?.fullName} | Full Stack Developer </p>
          <p className="ms-3 fs-5">
            My portfolio on <a href="#">www.portfolio.com/{user?.user?.fullName}</a>
          </p>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between mt-3">
          <div className="d-flex justify-content-equal mx-auto">
            <div className="count-section pe-4 pe-md-5 text-center fw-bold">
              <h4>{myallposts.length}</h4>
              <p>Posts</p>
            </div>
            <div className="count-section px-4 px-md-5 text-center fw-bold">
              <h4>20</h4>
              <p>Followers</p>
            </div>
            <div className="ps-md-5 ps-4 text-center fw-bold">
              <h4>20</h4>
              <p>Following</p>
            </div>
          </div>
          <div className="mx-auto mt-md-0 mt-4">
            <button className="custom-btn custom-btn-white me-md-3">
              <span className="fs-6">Edit Profile</span>
            </button>
            <button className="custom-btn custom-btn-white" onClick={handlePostShow}>
              <span className="fs-6">Upload Post</span>
            </button>
          </div>
        </div>
      </div>

      <hr className="my-3" />

      <div className="row mb-4">
        {myallposts.map((post) => (
          <div className="col-md-4 col-sm-12 mb-4" key={post._id}>
            <div className="card" onClick={() => showDetail(post)}>
              <img src={post.image} className="card-img-top" alt={post.description} />
            </div>
          </div>
        ))}
      </div>
      {/* Post Details Modal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className='row'>

            {/* Left Image Section */}
            <div className='col-md-6 d-flex align-items-center justify-content-center'>
              <img
                src={postDetail.image}
                alt="Post"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>

            {/* Right Details Section */}
            <div className='col-md-6 d-flex flex-column'>

              {/* User Info & Dropdown */}
              <div className='d-flex align-items-start justify-content-between mb-3'>
                <div className='d-flex'>
                  <img
                    className='post-profile-pic rounded-circle me-2'
                    alt="profile"
                    src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                  />
                  <div>
                    <p className='fw-bold mb-0'>{user?.user?.fullName}</p>
                    <p className='fs-6 text-muted mb-0'>{postDetail.location}</p>
                  </div>
                </div>

                <div className="dropdown">
                  <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img alt="more action" src={horizontalMoreAction} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item">
                        <i className="fa-regular fa-pen-to-square px-2"></i>Edit Post
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => deletePost(postDetail._id)}>
                        <i className="fa-solid fa-trash px-2"></i>Delete Post
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Post Description */}
              <div className='mb-3'>
                <p className='text-dark mb-0'>{postDetail.description}</p>
              </div>
              {/* Likes + Comment + Share Icons */}
              <div className='mb-3'>
                <div className='d-flex'>
                  <i className="fs-4 fa-regular fa-heart me-3"></i>
                  <i className="fs-4 fa-regular fa-comment me-3"></i>
                  <i className="fs-4 fa-solid fa-location-arrow"></i>
                </div>
              </div>
              {/* Likes Count */}
              <div className='mb-3'>
                <span className='fw-bold'>200 likes</span>
              </div>
              {/* Time */}
              <div>
                <p className='text-muted mb-0'>2 Hours Ago</p>
              </div>

            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Upload Post Modal */}
      <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className='fw-bold fs-5'>Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-md-6 col-sm-12 mb-3'>
              <div className='upload-box'>
                <div className="dropZoneContainer">
                  <input name="file" type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onChange={handleFileSelect} />
                  <div className="dropZoneOverlay">
                    {image.preview && <img src={image.preview} width='150' height='150' />}
                    <i class="fa-solid fa-cloud-arrow-up fs-1"></i><br />Upload Photo From Computer</div>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
              <div className='row'>
                <div className='col-sm-12 mb-3'>
                  <div className="form-floating">
                    <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                    <label for="floatingTextarea">Add Caption</label>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className="form-floating mb-3">
                    <input type="text" onChange={(ev) => setLocation(ev.target.value)} className="form-control" id="floatingInput" placeholder="Add Location" />
                    <label for="floatingInput"><i className="fa-solid fa-location-pin pe-2"></i>Add Location</label>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-12'>
                  {loading ? <div className='col-md-12 mt-3 text-center'>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div> : ''}
                  <button onClick={() => addPost()} className="custom-btn custom-btn-pink float-end">
                    <span className='fs-6 fw-600'>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </Modal.Body>
      </Modal>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Profile;
