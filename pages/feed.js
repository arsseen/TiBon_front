import Nav from '../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../utils/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();
  const router = useRouter();

  useEffect(() => { 
    if(!user) router.push('/login');
    else loadPosts(); 
  }, []);

  async function loadPosts() {
    try {
      const data = await fetchJson(`${API_BASE}/api/posts`);
      setPosts(data);
    } catch (e) { console.error(e); }
  }

  async function createPost(e) {
    e.preventDefault();
    if (!title && !content) return;
    setLoading(true);
    try {
      const isPrivate = document.querySelector('#isPrivate')?.checked || false;
      await fetchJson(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId: user.id, isPrivate })
      });
      setTitle('');
      setContent('');
      loadPosts();
    } catch (e) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId, hasLiked) {
    try {
      await fetchJson(`${API_BASE}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      loadPosts();
    } catch (e) {
      console.error(e);
    }
  }

  async function deletePost(postId) {
    if (!confirm('Delete this post?')) return;
    try {
      await fetchJson(`${API_BASE}/api/posts/${postId}`, { method: 'DELETE' });
      loadPosts();
    } catch (e) {
      alert('Failed to delete post');
    }
  }

  return (
    <div>
      <Nav />
      <div className="main-container">
        {/* Create Post Widget */}
        <div className="card">
          <div className="card-header">
            <span style={{fontWeight:600}}>New Post</span>
          </div>
          <div style={{padding:16}}>
            <form onSubmit={createPost}>
              <input 
                placeholder="Topic..." 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
              <textarea 
                placeholder="What's on your mind? (Rich text supported)" 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                rows={3} 
                style={{resize:'none'}}
              />
              <div>
                <input type="checkbox" id="isPrivate" /> <label htmlFor="isPrivate">Make this post private</label>
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Publishing...' : 'Share'}
              </button>
            </form>
          </div>
        </div>

        {/* Posts Feed */}
        {posts.map(p => (
          <div key={p._id} className="card">
            <div className="card-header">
              <img 
                src={p.author?.avatarUrl ? `${API_BASE}${p.author.avatarUrl}` : 'https://via.placeholder.com/32'} 
                className="user-avatar-small" 
                onError={(e)=>{e.target.src='https://via.placeholder.com/32'}}
              />
              <Link href={`/profile/${p.author?._id}`} className="username">
                {p.author?.username || 'Anonymous'}
              </Link>
              <div className="date">{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div className="card-content">
              <h3 style={{marginTop:0, marginBottom:8}}>
                {p.title}
                {p.isPrivate && <span className="privacy-badge">PRIVATE</span>}
              </h3>
              {/* VULNERABLE: Rendering HTML content - allows XSS */}
              <div dangerouslySetInnerHTML={{ __html: p.content }} />
            </div>

            <div className="card-actions">
              <button className={`like-btn ${p.likes?.some(l => l._id === user.id) ? 'liked' : ''}`} onClick={() => handleLike(p._id)}>
                ❤️ {p.likes?.length || 0}
              </button>
              <Link href={`/post/${p._id}`} className="action-btn">Comments</Link>
              {p.author?._id === user.id && (
                <button className="delete-btn" onClick={() => deletePost(p._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}