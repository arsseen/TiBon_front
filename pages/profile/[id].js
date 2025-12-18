import Nav from '../../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../../utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  
  const currentUser = getCurrentUser();

  useEffect(() => { if (id) loadData(); }, [id]);

  async function loadData() {
    try {
      const res = await fetchJson(`${API_BASE}/api/users/${id}`);
      setData(res);
      setEditBio(res.user.bio || '');
    } catch (e) { console.error(e); }
  }

  async function saveBio() {
    try {
      // VULNERABLE: IDOR - no userId verification, can modify any user's bio
      await fetchJson(`${API_BASE}/api/users/${id}/bio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: editBio })
      });
      setIsEditing(false);
      loadData();
    } catch (e) { alert('Failed to update bio'); }
  }

  async function handleFollow() {
    try {
      // VULNERABLE: IDOR - no userId verification in follow
      await fetchJson(`${API_BASE}/api/users/${id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      loadData();
    } catch (e) { console.error(e); }
  }

  async function uploadAvatar() {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      // VULNERABLE: IDOR - can upload avatar for any user + File Upload Vulnerability (no type check)
      await fetch(`${API_BASE}/api/users/${id}/avatar`, { method: 'POST', body: formData });
      loadData();
      setAvatarFile(null);
    } catch (e) { alert('Upload failed'); }
  }

  if (!data) return null;

  const isOwner = currentUser && currentUser.id === id;

  return (
    <div>
      <Nav />
      <div className="main-container">
        <div className="profile-header">
           <img 
            src={data.user.avatarUrl ? `${API_BASE}${data.user.avatarUrl}` : 'https://via.placeholder.com/150'} 
            className="profile-avatar"
            onError={(e)=>{e.target.src='https://via.placeholder.com/150'}}
           />
           <div className="profile-info">
             <h2>{data.user.username}</h2>
             
             {!isEditing ? (
               <div className="bio">{data.user.bio || 'No bio yet.'}</div>
             ) : (
               <div className="edit-mode" style={{marginTop:10}}>
                 <textarea value={editBio} onChange={e => setEditBio(e.target.value)} />
                 <div style={{display:'flex', gap:10}}>
                   <button onClick={saveBio} className="primary-btn" style={{width:'auto'}}>Save</button>
                   <button onClick={() => setIsEditing(false)} className="action-btn">Cancel</button>
                 </div>
               </div>
             )}

             {isOwner && !isEditing && (
               <div style={{marginTop: 20}}>
                 <button onClick={() => setIsEditing(true)} className="primary-btn" style={{width:'auto'}}>Edit Bio</button>
               </div>
             )}

             {!isOwner && currentUser && (
               <button onClick={handleFollow} className="follow-btn" style={{width:'auto', marginTop:10}}>
                 👤 Follow ({data.user.followers})
               </button>
             )}

             {isOwner && (
               <div style={{marginTop:15, fontSize:12}}>
                 <label style={{display:'block', marginBottom:5}}>Change Profile Photo:</label>
                 <input type="file" onChange={e => setAvatarFile(e.target.files[0])} style={{width:200}} />
                 {avatarFile && <button onClick={uploadAvatar} className="primary-btn" style={{width:'auto', marginLeft:5}}>Upload</button>}
               </div>
             )}
           </div>
        </div>

        <hr style={{border:'0', borderTop:'1px solid #dbdbdb', marginBottom:20}} />
        
        <h3 style={{fontWeight:400, color:'#8e8e8e', textAlign:'center'}}>POSTS</h3>
        <div className="post-grid">
          {data.posts.map(p => (
            <div key={p._id} className="grid-item" onClick={() => router.push(`/post/${p._id}`)}>
              <div>
                <strong>{p.title}</strong>
                <br/>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}