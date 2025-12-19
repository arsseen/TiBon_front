import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  let user = null;
  if (typeof window !== 'undefined') user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">TiBon</Link>
      </div>
      <div className="nav-items" style={{display:'flex', alignItems:'center'}}>
        {user ? (
          <>
            <Link href="/" style={{marginRight:'20px', fontWeight: '500'}}>Feed</Link>
            <Link href="/search" style={{marginRight:'20px', fontWeight: '500'}}>Search</Link>
            <Link href={`/profile/${user.username}`} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <img 
                    src={user.profilePicture ? `http://localhost:8800/uploads/${user.profilePicture}` : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                    style={{width:'28px', height:'28px', borderRadius:'50%', objectFit:'cover'}}
                />
                <span style={{fontWeight:'bold'}}>{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="btn-link" style={{marginLeft:'20px'}}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}