import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { API_BASE_URL } from '../../src/config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostOverview = () => {

  const [allposts, setAllposts] = useState([]);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allposts`);

      if (response.status === 200) {
        setAllposts(response.data.posts);
      } else {
        toast.error("Some error occurred while getting all posts");
      }
    } catch (error) {
      toast.error("Error fetching posts");
      console.error(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        getAllPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the post.");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className='container mt-md-5 mt-3'>
      <div className='row'>
        {allposts.map((post) => {
          return (
            <div className='col-md-4 mb-2' key={post._id}>
              <Card postData={post} deletePost={deletePost} getAllPosts={getAllPosts} />
            </div>
          );
        })}
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default PostOverview;
