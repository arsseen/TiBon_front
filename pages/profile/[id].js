import Nav from '../../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../../utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Profile(){
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const current = getCurrentUser();

  useEffect(()=>{ if(id) load(); }, [id]);
  async function load(){ try{ const d = await fetchJson(`${API_BASE}/api/users/${id}`); setData(d); }catch(e){ console.error(e); } }

  async function submitAvatar(e){
    e.preventDefault();
    if(!file) return alert('Select a file');
    const form = new FormData();
    form.append('avatar', file);
    const res = await fetch(`${API_BASE}/api/users/${id}/avatar`, { method:'POST', body:form });
    const json = await res.json();
    if(!res.ok) return alert(json.error || 'Upload failed');
    alert('Uploaded');
    load();
  }

  if(!data) return (<div><Nav /><div className="container">Loading...</div></div>);

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>{data.user.username}</h2>
        {data.user.avatarUrl ? <img className="avatar" src={`${API_BASE}${data.user.avatarUrl}`} alt="avatar" /> : <div>No avatar</div>}

        {current && current.id === id && (
          <div className="card">
            <h3>Upload Avatar</h3>
            <form onSubmit={submitAvatar}>
              <input type="file" onChange={e=>setFile(e.target.files[0])} />
              <button type="submit">Upload</button>
            </form>
            <div style={{color:'#666', marginTop:8}}>Note: Upload is intentionally not validated.</div>
          </div>
        )}

        <h3>Posts</h3>
        {data.posts.map(p => (
          <div key={p._id} className="card">
            <a href={`/post/${p._id}`}>{p.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
