import React, { useState } from 'react'
import './Card.css'
import moreAction from '../images/more-action.PNG'
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../src/config'
import axios from 'axios';

const Card = (props) => {
    const user = useSelector(state => state.userReducer);
    const [commentBox, setCommentBox] = useState(false)
    const [comment, setComment] = useState("")

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const submitComment = async (postId) => {
        setCommentBox(false);
        const request = { postId: postId, commentText: comment };
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllPosts();
        }
    }

    const likeDislikePost = async (postId, type) => {
        const request = { postId: postId };
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllPosts();
        }
    }

    return (
        <div>
            <div className="card shadow-sm mb-4">
                <div className="card-body px-3 py-3">
                    {/* Top user info row */}
                    <div className='row mb-2'>
                        <div className='col-6 d-flex align-items-center'>
                            <img className='p-2 post-profile-pic' alt="profile pic" src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                            <div className='mt-2 ms-2'>
                                <p className='fs-6 fw-bold text-nowrap m-0'>{props.postData.author.fullName}</p>
                                <p className='location m-0'>{props.postData.location}</p>
                            </div>
                        </div>

                        {props.postData.author._id === user.user._id && (
                            <div className='col-6'>
                                <img onClick={() => props.deletePost(props.postData._id)} style={{ cursor: "pointer" }} className='float-end fs-3 p-2 mt-2' alt="more action" src={moreAction} />
                            </div>
                        )}
                    </div>
                    {/* Post image */}
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <img style={{ borderRadius: '15px' }} className='img-fluid w-100' alt={props.postData.description} src={props.postData.image} />
                        </div>
                    </div>
                    {/* Description */}
                    <div className='row mb-3'>
                        <div className='col-12'>
                            <p className='description text-dark px-1 mb-0'>{props.postData.description}</p>
                        </div>
                    </div>
                    {/* Like / Comment Icons */}
                    <div className='row align-items-center mb-3'>
                        <div className='col-6 d-flex gap-3'>
                            <i onClick={() => likeDislikePost(props.postData._id, 'like')} className="fs-5 fa-regular fa-thumbs-up" style={{ cursor: 'pointer' }}></i>
                            <i onClick={() => likeDislikePost(props.postData._id, 'unlike')} className="fs-5 fa-regular fa-thumbs-down" style={{ cursor: 'pointer' }}></i>
                            <i onClick={() => setCommentBox(true)} className="fs-5 fa-regular fa-comment" style={{ cursor: 'pointer' }}></i>
                        </div>
                        <div className='col-6 text-end'>
                            <span className='fs-6 fw-bold'>{props.postData.likes.length} likes</span>
                        </div>
                    </div>
                    {/* Comment Box */}
                    {commentBox && (
                        <div className='row mb-3'>
                            <div className='col-8'>
                                <textarea onChange={(e) => setComment(e.target.value)} className='form-control' placeholder='Write a comment...'></textarea>
                            </div>
                            <div className='col-4'>
                                <button className='btn btn-primary w-100' onClick={() => submitComment(props.postData._id)}>Submit</button>
                            </div>
                        </div>
                    )}
                    {/* Display Comments */}
                    {props.postData.comments.map((comment, index) => (
                        <div className='row mb-1' key={index}>
                            <div className='col-12'>
                                <p className='mb-1'><strong>{comment.commentedBy.fullName}</strong>: {comment.commentText}</p>
                            </div>
                        </div>
                    ))}
                    {/* Timestamp */}
                    <div className='row'>
                        <div className='col-12'>
                            <span className='text-muted small'>2 Hours Ago</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Card;
