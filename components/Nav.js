import Link from 'next/link';
import { getCurrentUser, logout } from '../utils/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Nav() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <Link href="/feed" className="logo">MiniSocial</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link href="/feed" className="nav-btn">Home</Link>
              <Link href="/search" className="nav-btn">Search</Link>
              <Link href={`/profile/${user.id}`} className="nav-btn">Profile</Link>
              <span onClick={handleLogout} className="nav-btn" style={{color:'var(--danger)'}}>Logout</span>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-btn">Login</Link>
              <Link href="/register" className="nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}