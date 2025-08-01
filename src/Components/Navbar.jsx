import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Menu, X, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from "../Firebase"; // Make sure this path is correct

// --- Styled Components ---
const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  z-index: 1000;
  transition: background-color 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
  
  // Style for when the page is scrolled
  ${({ $isScrolled }) =>
    $isScrolled &&
    css`
      background-color: #f8f7f4;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 1rem 2rem;
    `}

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    ${({ $isScrolled }) =>
    $isScrolled &&
    css`
      padding: 0.75rem 1.5rem;
    `}
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.button`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1c1c;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

// --- UPDATED: Changed from styled.a to styled.button
const NavLink = styled.button`
  font-size: 1rem;
  font-weight: 500;
  color: #1c1c1c;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #7c3aed;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #7c3aed;
    &:after {
      width: 100%;
    }
  }
`;

const AuthButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

// --- UPDATED: Changed from styled.a to styled.button
const LoginButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1c1c1c;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// --- UPDATED: Changed from styled.a to styled.button
const SignUpButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #1c1c1c;
  border: 2px solid #1c1c1c;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, background-color 0.3s ease;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    background-color: #7c3aed;
    border-color: #7c3aed;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #c72c41;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    background-color: #fee2e2;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;
  z-index: 1001; /* Ensure icon is above the menu overlay */

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999; 
  background: #7c3aed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  
  ${NavLink} {
    font-size: 2rem;
    color: #fff;

    &:after {
        background-color: #fff;
    }

    &:hover {
        color: #fff;
    }
  }

  ${LoginButton}, ${SignUpButton}, ${LogoutButton} {
    font-size: 1.5rem;
    padding: 1rem 2rem;
    color: #7c3aed;
    background-color: #fff;

    &:hover {
        background-color: #f0f0f0;
    }
  }

  ${LogoutButton} {
      color: #c72c41;
      &:hover {
          background-color: #fee2e2;
      }
  }
`;

// --- The Navbar Component ---
const Navbar = ({ user, navigate }) => { // <-- UPDATED: Accept navigate prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const auth = getAuth(app);

  const handleLogout = () => {
    signOut(auth).then(() => {
      // UPDATED: Use navigate instead of full page reload
      navigate('/');
    }).catch((error) => {
      console.error("Logout Error:", error);
    });
  };

  const handleMobileNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <>
      <NavWrapper $isScrolled={isScrolled}>
        <NavContent>
          <Logo onClick={() => navigate('/')}>GenSlip</Logo>
          
          <NavLinks>
            <NavLink onClick={() => navigate('/templates')}>Templates</NavLink>
            {user && <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>}
            {user ? (
              <LogoutButton onClick={handleLogout}>
                Logout <LogOut size={18} />
              </LogoutButton>
            ) : (
              <AuthButtons>
                <LoginButton onClick={() => navigate('/login')}>Login</LoginButton>
                <SignUpButton onClick={() => navigate('/signup')}>Sign Up</SignUpButton>
              </AuthButtons>
            )}
          </NavLinks>

          <MobileMenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#1c1c1c" />}
          </MobileMenuIcon>
        </NavContent>
      </NavWrapper>

      <MobileNavMenu $isOpen={isMenuOpen}>
          <NavLink onClick={() => handleMobileNav('/templates')}>Templates</NavLink>
          {user && <NavLink onClick={() => handleMobileNav('/dashboard')}>Dashboard</NavLink>}
          {user ? (
            <LogoutButton onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</LogoutButton>
          ) : (
            <>
              <LoginButton onClick={() => handleMobileNav('/login')}>Login</LoginButton>
              <SignUpButton onClick={() => handleMobileNav('/signup')}>Sign Up</SignUpButton>
            </>
          )}
      </MobileNavMenu>
    </>
  );
};

export default Navbar;
