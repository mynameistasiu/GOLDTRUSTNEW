import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { loadUser, logout } from '../utils/storage';

const WA_NUMBER = '+2348161662371';

export default function LogoHeader({ small }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);


  useEffect(()=>{
    try {
      const u = loadUser();
      if(u) setUser(u);
    } catch(e){}
  },[]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <header className={`gt-header ${small ? 'gt-header--small':''}`}>
      <div className="gt-header__inner">
        <div className="gt-brand" onClick={()=>{ if(open) setOpen(false); }}>
          <Image src="/logo.png" alt="GoldTrust" width={56} height={56} />
          <div className="gt-brand__text">
            <div className="gt-title">GoldTrust</div>
            {!small && <div className="gt-sub">Secure • Simple • Trusted</div>}
          </div>
        </div>

        <nav className={`gt-nav ${open ? 'open' : ''}`} aria-label="Main Navigation">
          <Link href="/dashboard" className="gt-nav__link">Dashboard</Link>
          <Link href="/history" className="gt-nav__link">History</Link>
          <Link href="/buy-code" className="gt-nav__link">Buy Code</Link>
          <Link href="/withdraw" className="gt-nav__link">Withdraw</Link>
          <a className="gt-nav__link" href={`https://wa.me/${WA_NUMBER.replace('+','')}`} target="_blank" rel="noreferrer">Contact</a>
        </nav>

        <div className="gt-actions">
          {user ? (
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <Link href="/profile" className="gt-cta">{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</Link>
              <button className="gt-cta" onClick={handleLogout} title="Logout">
                🚪 Logout
              </button>
            </div>
          ) : (
            <div style={{display:'flex', gap:8}}>
              <Link href="/login" className="gt-ghost">Login</Link>
              <Link href="/register" className="gt-cta">Get Started</Link>
            </div>
          )}
          <button className="gt-hamburger" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">☰</button>
        </div>
      </div>
    </header>
  );
}
