import { useState } from 'react';
import axios from 'axios';

export default function Share({ currentUser }) {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const handleShare = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", currentUser._id);
    data.append("desc", desc);
    if (file) data.append("file", file);

    try {
      await axios.post("http://localhost:8800/api/posts", data);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
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
          Post
        </button>
      </div>
    </div>
  );
}