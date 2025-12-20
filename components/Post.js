



import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Post({ post, currentUser }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const PF = "http://localhost:8800/uploads/";
  const user = post.user || {}; 

  const likeHandler = () => {
    try {
      axios.put("http://localhost:8800/api/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const toggleComments = async () => {
    if (!showComments) {
        try {
            const res = await axios.get(`http://localhost:8800/api/comments/${post._id}`);
            setComments(res.data);
        } catch(err) {}
    }
    setShowComments(!showComments);
  };

  const submitComment = async (e) => {
    if (e.key === 'Enter' && commentText) {
        try {
            const res = await axios.post(`http://localhost:8800/api/comments`, {
                userId: currentUser._id,
                postId: post._id,
                text: commentText
            });
            const newComment = { ...res.data, username: currentUser.username };
            setComments([newComment, ...comments]);
            setCommentText("");
        } catch(err) {}
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <Link href={`/profile/${user.username}`}>
            <img 
              src={user.profilePicture ? PF + user.profilePicture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
              className="user-avatar"
              style={{cursor: 'pointer'}}
            />
        </Link>
        <span className="username">{user.username || "Unknown"}</span>
      </div>
      
      {post.img && (
        post.img.endsWith('.html') ? 
          <iframe src={PF + post.img} style={{width:'100%', height:'200px', border:'none'}}></iframe> :
          <img src={PF + post.img} className="post-img" />
      )}

      <div className="post-content">
        <div className="post-actions" style={{display:'flex', gap:'15px', marginBottom:'10px', fontSize:'1.5rem'}}>
            <span onClick={likeHandler} style={{cursor:'pointer', color: isLiked ? '#ed4956' : 'white'}}>
                {isLiked ? "♥" : "♡"}
            </span>
            <span onClick={toggleComments} style={{cursor:'pointer'}}>💬</span>
        </div>
        
        <div style={{fontWeight:'bold', marginBottom:'5px'}}>{like} likes</div>
        {/* Stored XSS */}
        <div className="caption">
            <span style={{fontWeight:'bold', marginRight:'5px'}}>{user.username}</span>
            <span>{post.desc}</span>
        </div>
        
        {showComments && (
            <div className="comments-section" style={{marginTop:'10px', borderTop:'1px solid #222', paddingTop:'10px'}}>
                {comments.map(c => (
                    <div key={c._id} style={{fontSize:'0.9rem', marginBottom:'5px'}}>
                      <b>{c.username}: </b><span>{c.text}</span>
                    </div>
                ))}
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)} 
                    onKeyDown={submitComment}
                    className="post-input"
                    style={{borderBottom:'1px solid #333', marginTop:'10px'}}
                />
            </div>
        )}
      </div>
    </div>
  );
}