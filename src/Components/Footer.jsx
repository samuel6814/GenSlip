import React from 'react';
import styled from 'styled-components';
import { Github, Twitter, Linkedin } from 'lucide-react';

// Styled Components
const FooterWrapper = styled.footer`
  background-color: #1c1c1c;
  color: #a0a0a0;
  padding: 4rem 2rem 2rem;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BrandText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.3s ease;

    &:hover {
      color: #7c3aed;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled.a`
  color: #a0a0a0;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #fff;
    transform: translateY(-3px);
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  border-top: 1px solid #333;
  width: 100%;
  padding-top: 2rem;
  margin-top: 2rem;
`;


// The Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <BrandText>
          Built by <a href="https://trileon.vercel.app" target="_blank" rel="noopener noreferrer">Trileon</a>
        </BrandText>
        <SocialLinks>
          <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={24} />
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={24} />
          </SocialLink>
          <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={24} />
          </SocialLink>
        </SocialLinks>
        <Copyright>
          &copy; {currentYear} GenSlip. All Rights Reserved.
        </Copyright>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;
