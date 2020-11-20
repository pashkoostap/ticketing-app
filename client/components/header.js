import React from 'react';
import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    currentUser && { label: 'Sell ticket', href: '/tickets/new' },
    currentUser && { label: 'My orders', href: '/orders' },
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter(Boolean)
    .map((link, i) => (
      <li className='nav-item' key={i}>
        <Link href={link.href}>
          <a className='nav-link'>{link.label}</a>
        </Link>
      </li>
    ));

  return (
    <header>
      <nav className='navbar  navbar-light  bg-light'>
        <Link href='/'>
          <a className='navbar-brand'>Ticketing</a>
        </Link>

        <div className='d-flex  align-items-center  justify-content-end'>
          {currentUser ? <span>{currentUser.email}</span> : null}
          <ul className='nav  d-flex  align-items-center'>{links}</ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
