import Nav from '../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../utils/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Feed(){
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const user = getCurrentUser();

  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const data = await fetchJson(`${API_BASE}/api/posts`); setPosts(data); }catch(e){ console.error(e); } }

  async function submit(e){
    e.preventDefault();
    if(!user) return alert('Login first');
    try{
      await fetchJson(`${API_BASE}/api/posts`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ title, content, userId: user.id }) });
      setTitle(''); setContent(''); load();
    }catch(e){ alert(e.message); }
  }

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Feed</h2>

        <div className="card">
          <h3>Create Post</h3>
          <form onSubmit={submit}>
            <div>
              <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div>
              <textarea placeholder="Content (HTML allowed)" value={content} onChange={e=>setContent(e.target.value)} rows={4}></textarea>
            </div>
            <button type="submit">Post</button>
          </form>
        </div>

        {posts.map(p => (
          <div key={p._id} className="card">
            <h3><Link href={`/post/${p._id}`}>{p.title}</Link></h3>
            <div>By: {p.author?.username || 'Unknown'}</div>
            <div style={{marginTop:8}} dangerouslySetInnerHTML={{ __html: p.content || '' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
