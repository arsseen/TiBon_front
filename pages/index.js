import { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import Post from '../components/Post';
import { useRouter } from 'next/router';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push('/login');
    } else {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchPosts(user._id);
    }
  }, []);

  const fetchPosts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8800/api/posts/timeline/${userId}`);
      setPosts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", currentUser._id);
    data.append("desc", desc);
    if (file) data.append("file", file);

    try {
      await axios.post("http://localhost:8800/api/posts", data);
      window.location.reload();
    } catch (err) { console.error(err); }
  };

  if (!currentUser) return null;

  return (
    <>
      <Nav />
      <div className="container feed">
        
        <div className="create-post">
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
             <img 
                src={currentUser.profilePicture ? `http://localhost:8800/uploads/${currentUser.profilePicture}` : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}
             />
             <textarea 
                className="post-input" 
                placeholder={`What's new, ${currentUser.username}?`}
                rows="2"
                onChange={(e) => setDesc(e.target.value)}
             />
          </div>
          <div className="post-footer">
            <input 
              type="file" 
              id="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ display: 'none' }}
            />
            <label htmlFor="file" className="file-label">
              📷 {file ? file.name : "Photo/File"}
            </label>
            <button className="btn-primary" style={{ width: 'auto', padding: '5px 20px' }} onClick={handleShare}>
              Share
            </button>
          </div>
        </div>

        <div className="posts-list">
            {posts.map((p) => (
              <Post key={p._id} post={p} currentUser={currentUser} />
            ))}
        </div>
      </div>
    </>
  );
}