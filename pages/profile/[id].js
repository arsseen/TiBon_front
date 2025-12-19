



import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Nav from '../../components/Nav';
import Post from '../../components/Post';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followed, setFollowed] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editFile, setEditFile] = useState(null);

  const PF = "http://localhost:8800/uploads/";

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if(userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    if (id && currentUser) {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/users?username=${id}`);
                setProfileUser(res.data);
                setFollowed(res.data.followers.includes(currentUser._id));
                setEditDesc(res.data.desc);
                setEditCity(res.data.city);
                const postsRes = await axios.get(`http://localhost:8800/api/posts/profile/${id}`);
                setPosts(postsRes.data);
            } catch (err) { console.log(err); }
        };
        fetchProfile();
    }
  }, [id, currentUser]);

  const handleUpdate = async (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append("userId", currentUser._id);
      data.append("desc", editDesc);
      data.append("city", editCity);
      if(editFile) data.append("file", editFile);

      try {
          const res = await axios.put(`http://localhost:8800/api/users/${profileUser._id}`, data);
          if (currentUser._id === profileUser._id) {
             localStorage.setItem("user", JSON.stringify({...currentUser, ...res.data}));
          }
          window.location.reload();
      } catch(err) { console.log(err); }
  }

  const handleFollow = async () => {
      try {
          if (followed) {
              await axios.put(`http://localhost:8800/api/users/${profileUser._id}/unfollow`, { userId: currentUser._id });
          } else {
              await axios.put(`http://localhost:8800/api/users/${profileUser._id}/follow`, { userId: currentUser._id });
          }
          setFollowed(!followed);
      } catch(err) {}
  };

  if (!profileUser || !currentUser) return <div style={{color:'white', padding:'20px'}}>Loading...</div>;

  return (
    <>
      <Nav />
      <div className="container">
        <div className="profile-header">
          <img 
            src={profileUser.profilePicture ? PF + profileUser.profilePicture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
            className="profile-pic-lg"
          />
          <div style={{ flex: 1 }}>
            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                <h2 style={{ margin:0 }}>{profileUser.username}</h2>
                {currentUser.username === profileUser.username ? (
                    <button className="btn-primary" onClick={() => setIsEditing(true)} style={{background:'#333', width:'auto', border:'1px solid #555'}}>Edit Profile</button>
                ) : (
                    <button className="btn-primary" onClick={handleFollow} style={{width:'auto'}}>{followed ? "Unfollow" : "Follow"}</button>
                )}
            </div>
            
            <div className="stats">
              <span><b>{posts.length}</b> posts</span>
              <span><b>{profileUser.followers.length}</b> followers</span>
              <span><b>{profileUser.following.length}</b> following</span>
            </div>

            <div>{profileUser.city}</div>
            <div dangerouslySetInnerHTML={{ __html: profileUser.desc }}></div>
          </div>
        </div>

        <hr style={{borderColor:'#333', margin:'20px 0'}} />

        <div className="feed">
            {posts.length === 0 && <p style={{textAlign:'center', color:'#777'}}>No posts yet</p>}
            {posts.map(p => (
                <Post key={p._id} post={p} currentUser={currentUser} />
            ))}
        </div>

        {isEditing && (
            <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div className="auth-box" style={{textAlign:'left'}}>
                    <h3 style={{marginTop:0}}>Edit Profile</h3>
                    <form onSubmit={handleUpdate}>
                        <label>Change Avatar:</label>
                        <input type="file" onChange={e => setEditFile(e.target.files[0])} style={{marginBottom:'10px', color:'white'}} />
                        
                        <label>City:</label>
                        <input className="input-field" value={editCity} onChange={e => setEditCity(e.target.value)} />
                        
                        <label>Bio:</label>
                        <textarea className="input-field" value={editDesc} onChange={e => setEditDesc(e.target.value)} rows="3" />
                        
                        <button className="btn-primary">Save</button>
                    </form>
                    <button onClick={() => setIsEditing(false)} style={{background:'none', border:'none', color:'red', marginTop:'10px', cursor:'pointer', width:'100%'}}>Cancel</button>
                </div>
            </div>
        )}
      </div>
    </>
  );
}