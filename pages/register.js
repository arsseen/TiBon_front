import Nav from '../components/Nav';
import { API_BASE, fetchJson, setCurrentUser } from '../utils/api';
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const data = await fetchJson(`${API_BASE}/api/auth/register`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username, password })
      });
      setCurrentUser({ id: data.id, username: data.username });
      location.href = '/feed';
    }catch(err){ setMsg(err.message); }
  }

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={submit} className="card">
          <div>
            <label>Username</label><br />
            <input value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label><br />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit">Register</button>
        </form>
        {msg && <div style={{color:'red'}}>{msg}</div>}
      </div>
    </div>
  );
}
