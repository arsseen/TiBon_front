import { useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/api/users/search", { query });
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Nav />
      <div className="container">
        <form onSubmit={handleSearch}>
          <input 
            className="search-bar" 
            placeholder="Search users..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div style={{ marginTop: '20px' }}>
          {results.map(u => (
            <div key={u._id} className="user-list-item">
              <img 
                src={u.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{u.username}</div>
                <div style={{ color: '#888', fontSize: '0.8rem' }}>{u.email}</div>
              </div>
              <a href={`/profile/${u.username}`} className="btn-primary" style={{ width: 'auto', padding: '5px 15px' }}>View</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}