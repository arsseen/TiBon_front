
import { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      fetchPosts(JSON.parse(loggedInUser)._id);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPosts = async (userId) => {
    try {
      const res = await axios.get("http://localhost:8800/api/posts/timeline/" + userId);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc,
    };

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("http://localhost:8800/api/posts", data); 
        window.location.reload();
        return;
      } catch (err) {
        console.log(err);
      }
    }
    
    
    try {
       const data = new FormData();
       data.append("userId", user._id);
       data.append("desc", desc);
       if(file) data.append("file", file);
       
       await axios.post("http://localhost:8800/api/posts", data);
       window.location.reload();
    } catch (err) {
        console.log(err);
    }
  };

  return (
    <div>
      <Nav user={user} />
      <div className="container">
        <div className="share-box">
          <textarea 
            className="share-input" 
            placeholder={`What's on your mind, ${user.username}?`}
            rows="3"
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="share-footer">
            <input 
              type="file" 
              id="file" 
              accept=".png,.jpeg,.jpg,.html" 
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }} 
            />
            <label htmlFor="file" className="action-btn" style={{ fontSize: '0.9rem' }}>
              📷 Add Photo/File
            </label>
            {file && <span style={{fontSize: '0.8rem', color: 'gray'}}>{file.name}</span>}
            <button className="btn btn-primary" style={{ width: '100px' }} onClick={handleShare}>Post</button>
          </div>
        </div>

        {posts.map((p) => (
          <Post key={p._id} post={p} currentUser={user} />
        ))}
      </div>
    </div>
  );
}

function Post({ post, currentUser }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const PF = "http://localhost:8800/uploads/"; 

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
          } catch(err) { console.log(err) }
      }
      setShowComments(!showComments);
  };

  const submitComment = async (e) => {
      if(e.key === 'Enter' && commentText) {
          try {
              const res = await axios.post(`http://localhost:8800/api/comments`, {
                  userId: currentUser._id,
                  postId: post._id,
                  text: commentText
              });
              setComments([res.data, ...comments]); 
              setCommentText("");
              const refreshed = await axios.get(`http://localhost:8800/api/comments/${post._id}`);
              setComments(refreshed.data);
          } catch(err) { console.log(err) }
      }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <img 
            className="avatar" 
            src={post.user?.profilePicture || "https://via.placeholder.com/150"} 
            alt="" 
        />
        <span className="username">{post.user?.username || "Unknown User"}</span>
        <span style={{marginLeft: 'auto', color: '#555', fontSize: '0.8rem'}}>
            {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      
      <div className="post-content">
        <p dangerouslySetInnerHTML={{ __html: post.desc }}></p>
      </div>

      {post.img && (
          post.img.endsWith(".html") ? 
          <iframe src={PF + post.img} style={{width: '100%', height: '200px', border: 'none'}}></iframe> :
          <img className="post-image" src={PF + post.img} alt="" />
      )}

      <div className="post-actions">
        <button className={`action-btn ${isLiked ? "liked" : ""}`} onClick={likeHandler}>
          ♥ {like}
        </button>
        <button className="action-btn" onClick={toggleComments}>
          💬 Comment
        </button>
      </div>

      {showComments && (
          <div className="comments-section">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={submitComment}
                style={{marginBottom: '15px'}}
              />
              {comments.map(c => (
                  <div className="comment" key={c._id}>
                      <span className="comment-author">{c.username || "User"}: </span>
                      <span dangerouslySetInnerHTML={{ __html: c.text }}></span>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}