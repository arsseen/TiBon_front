import Nav from '../../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../../utils/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const user = getCurrentUser();

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    try {
      const p = await fetchJson(`${API_BASE}/api/posts/${id}`);
      setPost(p);
      const c = await fetchJson(`${API_BASE}/api/posts/${id}/comments`);
      setComments(c);
    } catch (e) { console.error(e); }
  }

  async function sendComment(e) {
    e.preventDefault();
    if (!user) return router.push('/login');
    if (!commentText.trim()) return;
    try {
      await fetchJson(`${API_BASE}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, userId: user.id })
      });
      setCommentText('');
      load();
    } catch (e) { alert('Error'); }
  }

  async function likeComment(commentId) {
    try {
      await fetchJson(`${API_BASE}/api/posts/${id}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      load();
    } catch (e) { console.error(e); }
  }

  async function deleteComment(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await fetchJson(`${API_BASE}/api/posts/${id}/comments/${commentId}`, {
        method: 'DELETE'
      });
      load();
    } catch (e) { alert('Failed to delete'); }
  }

  async function likePost() {
    try {
      await fetchJson(`${API_BASE}/api/posts/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      load();
    } catch (e) { console.error(e); }
  }

  if (!post) return null;

  return (
    <div>
      <Nav />
      <div className="main-container">
        <div className="card">
          <div className="card-header">
             <img 
                src={post.author?.avatarUrl ? `${API_BASE}${post.author.avatarUrl}` : 'https://via.placeholder.com/32'} 
                className="user-avatar-small" 
                onError={(e)=>{e.target.src='https://via.placeholder.com/32'}}
              />
            <Link href={`/profile/${post.author?._id}`} className="username">
              {post.author?.username}
            </Link>
            <div className="date">{new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="card-content">
            <h2>{post.title}</h2>
            {/* VULNERABLE: Stored XSS in post content */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="stats">
              <span>❤️ {post.likes?.length || 0} likes</span>
              <span>💬 {comments.length} comments</span>
            </div>
          </div>
          <div className="post-actions">
            <button className={`like-btn ${post.likes?.some(l => l._id === user.id) ? 'liked' : ''}`} onClick={likePost}>
              ❤️ Like
            </button>
          </div>
        </div>

        <div style={{marginBottom: 10, fontWeight:600, color:'#8e8e8e'}}>Comments ({comments.length})</div>
        
        {comments.map(c => (
          <div key={c._id} className="card" style={{border:'none', borderBottom:'1px solid #efefef', borderRadius:0, marginBottom:0}}>
            <div style={{padding:15}}>
              <div style={{display:'flex', alignItems:'center', marginBottom:5, justifyContent:'space-between'}}>
                <div>
                  <span className="username" style={{marginRight:10}}>{c.author?.username || 'Guest'}</span>
                  <span className="date">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                {c.author?._id === user.id && (
                  <button className="delete-btn" style={{padding:'4px 8px', fontSize:'11px'}} onClick={() => deleteComment(c._id)}>Delete</button>
                )}
              </div>
              {/* VULNERABLE: Stored XSS - rendering raw comment HTML */}
              <div dangerouslySetInnerHTML={{__html: c.text}}></div>
              <div style={{marginTop:8}}>
                <button style={{background:'none', border:'none', cursor:'pointer', color:'#0095f6', fontSize:'12px'}} onClick={() => likeComment(c._id)}>
                  ❤️ {c.likes?.length || 0}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="card" style={{marginTop:20, padding:15}}>
          <form onSubmit={sendComment}>
            <textarea 
              placeholder="Add a comment..." 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)}
              rows={2}
            />
            <button type="submit" className="primary-btn" style={{width:'auto'}}>Post Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
}