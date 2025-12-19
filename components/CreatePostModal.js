import { useState } from 'react';
import axios from 'axios';

export default function CreatePostModal({ currentUser, onClose }) {
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
    <div style={{
        position:'fixed', top:0, left:0, width:'100%', height:'100%', 
        background:'rgba(0,0,0,0.85)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000
    }}>
        <div className="auth-box" style={{position:'relative', width: '500px', maxWidth:'95%'}}>
            <h2 style={{marginTop:0, borderBottom:'1px solid #333', paddingBottom:'15px'}}>Create new post</h2>
            
            <textarea 
                className="post-input" 
                placeholder={`What's on your mind, ${currentUser.username}?`}
                rows="4"
                style={{fontSize:'1.1rem', padding:'10px'}}
                onChange={(e) => setDesc(e.target.value)}
            />
            
            {file && (
                <div style={{margin:'10px 0'}}>
                    <img src={URL.createObjectURL(file)} style={{width:'100%', maxHeight:'300px', objectFit:'contain', borderRadius:'5px'}} />
                </div>
            )}

            <div style={{display:'flex', justifyContent:'space-between', marginTop:'20px', alignItems:'center'}}>
                <div>
                    <input 
                      type="file" 
                      id="file" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file" className="file-label" style={{fontSize:'1rem'}}>
                      📷 Select from computer
                    </label>
                </div>
                <button className="btn-primary" onClick={handleShare} style={{width:'auto', padding:'8px 20px'}}>Share</button>
            </div>

            <button 
                onClick={onClose} 
                style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}}
            >
                ✕
            </button>
        </div>
    </div>
  );
}