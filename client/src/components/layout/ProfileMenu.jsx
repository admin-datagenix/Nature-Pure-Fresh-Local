import { useEffect, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { cn } from '../../lib/cn';



function UserIcon({ className }) {

  return (

    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">

      <circle cx="12" cy="8" r="4" />

      <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" strokeLinecap="round" />

    </svg>

  );

}



function BagIcon({ className }) {

  return (

    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">

      <path d="M6 7h12l-1 14H7L6 7z" strokeLinejoin="round" />

      <path d="M9 7V5a3 3 0 116 0v2" strokeLinecap="round" />

    </svg>

  );

}



function LogoutIcon({ className }) {

  return (

    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">

      <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M15 12H4" strokeLinecap="round" />

      <path d="M19 4v16" strokeLinecap="round" opacity="0.35" />

    </svg>

  );

}



function fullDisplayName(user) {

  const name = (user?.name || '').trim();

  return name || 'My account';

}



const menuItemClass =
  'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[0.8125rem] font-semibold text-primary transition hover:bg-cream';



export default function ProfileMenu({ open, onToggle, onClose }) {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const panelRef = useRef(null);



  useEffect(() => {

    if (!open) return;

    const onDoc = (e) => {

      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();

    };

    const onKey = (e) => {

      if (e.key === 'Escape') onClose();

    };

    document.addEventListener('mousedown', onDoc);

    document.addEventListener('keydown', onKey);

    return () => {

      document.removeEventListener('mousedown', onDoc);

      document.removeEventListener('keydown', onKey);

    };

  }, [open, onClose]);



  const handleLogout = async () => {

    onClose();

    await logout();

    navigate('/');

  };



  const initial = (user?.name || 'U').trim().charAt(0).toUpperCase();



  return (

    <div ref={panelRef} className="relative">

      <button

        type="button"

        onClick={onToggle}

        className={cn(

          'rounded-full p-2.5 transition',

          open ? 'bg-secondary/15 text-primary' : 'text-primary/80 hover:bg-cream hover:text-primary'

        )}

        aria-expanded={open}

        aria-haspopup="menu"

        aria-label="Account menu"

      >

        <UserIcon className="h-5 w-5" />

      </button>



      {open ? (

        <div

          role="menu"

          className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] w-[12.25rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-sage/55 bg-white shadow-[0_16px_40px_rgba(41,70,51,0.14)]"

        >

          <div className="flex items-center gap-2.5 border-b border-sage/40 px-3 py-2.5">

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-bold text-primary">

              {initial}

            </span>

            <p className="min-w-0 truncate text-[0.8125rem] font-bold text-primary">{fullDisplayName(user)}</p>

          </div>



          <Link

            to="/account"

            state={{ section: 'profile' }}

            role="menuitem"

            onClick={onClose}

            className={menuItemClass}

          >

            <UserIcon className="h-4 w-4 shrink-0 text-primary/70" />

            My account

          </Link>



          <Link

            to="/account"

            state={{ section: 'orders' }}

            role="menuitem"

            onClick={onClose}

            className={menuItemClass}

          >

            <BagIcon className="h-4 w-4 shrink-0 text-primary/70" />

            Orders

          </Link>



          <div className="border-t border-sage/40" />



          <button type="button" role="menuitem" onClick={handleLogout} className={menuItemClass}>

            <LogoutIcon className="h-4 w-4 shrink-0 text-primary/70" />

            Logout

          </button>

        </div>

      ) : null}

    </div>

  );

}


