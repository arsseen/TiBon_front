import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push('/');
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo" style={{ marginBottom: '20px' }}>TiBon</h1>
        <form onSubmit={handleSubmit}>
          <input 
            className="input-field" 
            placeholder="Username" 
            name="username" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={handleChange} 
            required 
          />
          <button className="btn-primary" type="submit">Log In</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p style={{ marginTop: '15px', fontSize: '0.8rem' }}>
          Don't have an account? <Link href="/register"><span style={{ color: '#0095f6', cursor: 'pointer' }}>Sign up</span></Link>
        </p>
      </div>
    </div>
  );
}