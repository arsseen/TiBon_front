import Link from 'next/link';
import { getCurrentUser, logout } from '../utils/api';
import { useState, useEffect } from 'react';

export default function Nav() {
  const [user, setUser] = useState(null);
  useEffect(() => setUser(getCurrentUser()), []);
  return (
    <div className="nav">
      <div style={{flex:1}}>
        <Link href="/feed">Mini Social Hub</Link>
      </div>
      <Link href="/feed">Feed</Link>
      {user ? (
        <>
          <Link href={`/profile/${user.id}`}>Profile</Link>
          <a href="#" onClick={(e)=>{e.preventDefault(); logout(); setUser(null); location.href='/login'}} style={{color:'#fff'}}>Logout</a>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </div>
  );
}
