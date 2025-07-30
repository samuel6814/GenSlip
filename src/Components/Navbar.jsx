import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Menu, X } from 'lucide-react';

// Styled Components
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

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1c1c;
  text-decoration: none;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-size: 1rem;
  font-weight: 500;
  color: #1c1c1c;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;

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

const CTAButton = styled.a`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #1c1c1c;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: #7c3aed;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;
  z-index: 1001;

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
  background: #f8f7f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  
  ${NavLink} {
    font-size: 2rem;
  }
`;

// The Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Prevent scrolling when mobile menu is open
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
          <Logo href="#">GenSlip</Logo>
          
          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#templates">Templates</NavLink>
            <CTAButton href="#login">Get Started</CTAButton>
          </NavLinks>

          <MobileMenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} color="#1c1c1c" /> : <Menu size={28} color="#1c1c1c" />}
          </MobileMenuIcon>
        </NavContent>
      </NavWrapper>

      <MobileNavMenu $isOpen={isMenuOpen}>
          <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
          <NavLink href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
          <NavLink href="#templates" onClick={() => setIsMenuOpen(false)}>Templates</NavLink>
          <CTAButton href="#login" onClick={() => setIsMenuOpen(false)}>Get Started</CTAButton>
      </MobileNavMenu>
    </>
  );
};

export default Navbar;
