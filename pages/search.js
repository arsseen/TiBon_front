import Nav from '../components/Nav';
import { API_BASE, fetchJson, getCurrentUser } from '../utils/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) { setUsers([]); return; }
    setLoading(true);
    try {
      const data = await fetchJson(`${API_BASE}/api/users/search/${query}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Search Users</h2>
        <form onSubmit={handleSearch} className="card">
          <input 
            type="text"
            placeholder="Search users..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
          <button type="submit">Search</button>
        </form>

        {loading && <div>Loading...</div>}
        {users.map(u => (
          <div key={u._id} className="card">
            {u.avatarUrl && <img className="post-avatar" src={`${API_BASE}${u.avatarUrl}`} alt={u.username} />}
            <Link href={`/profile/${u._id}`}><strong>{u.username}</strong></Link>
            <div className="post-meta">{u.bio}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
