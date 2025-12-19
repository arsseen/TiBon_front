import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", formData);
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">TiBon</h1>
        <p style={{ color: '#8e8e8e', fontWeight: 'bold', marginBottom: '20px' }}>
          Sign up to see photos from your friends.
        </p>
        <form onSubmit={handleSubmit}>
          <input className="input-field" placeholder="Username" name="username" onChange={handleChange} required />
          <input className="input-field" placeholder="Email" name="email" type="email" onChange={handleChange} required />
          <input className="input-field" placeholder="Password" name="password" type="password" onChange={handleChange} required />
          <button className="btn-primary" type="submit">Sign Up</button>
        </form>
        <p style={{ marginTop: '15px' }}>
          Have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}