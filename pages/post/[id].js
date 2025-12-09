import Nav from '../../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../../utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PostPage(){
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const user = getCurrentUser();

  useEffect(()=>{ if(id) load(); }, [id]);
  async function load(){
    try{
      const p = await fetchJson(`${API_BASE}/api/posts/${id}`);
      setPost(p);
      const c = await fetchJson(`${API_BASE}/api/posts/${id}/comments`);
      setComments(c);
    }catch(e){ console.error(e); }
  }

  async function submit(e){
    e.preventDefault();
    if(!user) return alert('Login first');
    try{
      await fetchJson(`${API_BASE}/api/posts/${id}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ text, userId: user.id }) });
      setText('');
      load();
    }catch(e){ alert(e.message); }
  }

  if(!post) return (<div><Nav /><div className="container">Loading...</div></div>);

  return (
    <div>
      <Nav />
      <div className="container">
        <div className="card">
          <h2>{post.title}</h2>
          <div>By: {post.author?.username}</div>
          <div style={{marginTop:8}} dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>

        <div className="card">
          <h3>Comments</h3>
          <form onSubmit={submit}>
            <div>
              <textarea value={text} onChange={e=>setText(e.target.value)} rows={3}></textarea>
            </div>
            <button type="submit">Add Comment</button>
          </form>
          <div style={{marginTop:12}}>
            {comments.map(c => (
              <div key={c._id} className="card">
                <div style={{fontSize:12}}>By: {c.author?.username || 'Unknown'}</div>
                {/* VULNERABLE: Stored XSS — rendering raw comment HTML */}
                <div dangerouslySetInnerHTML={{ __html: c.text || '' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
