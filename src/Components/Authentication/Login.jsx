import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Mail, Lock, Home, ArrowRight } from 'lucide-react';

// --- QUOTES FOR THE SLIDER ---
const quotes = [
  {
    text: "Organization is not about perfection; it's about efficiency, reducing stress and clutter, saving time and money, and improving your overall quality of life.",
    author: "Christina Scalise"
  },
  {
    text: "A place for everything, everything in its place.",
    author: "Benjamin Franklin"
  },
  {
    text: "The simple act of paying positive attention to your finances will change your life.",
    author: "Suze Orman"
  },
  {
    text: "Beware of little expenses. A small leak will sink a great ship.",
    author: "Benjamin Franklin"
  }
];

// --- KEYFRAMES FOR ANIMATIONS ---
const backgroundFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const quoteFade = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const shapeFloat = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`;


// --- STYLED COMPONENTS ---

const LoginPageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Single column for mobile */
  height: 100vh; /* Use fixed viewport height */
  overflow: hidden; /* Prevent any scrolling on the page body */
  font-family: 'Inter', sans-serif;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr; /* Two columns for desktop */
  }
`;

const LeftPanel = styled.div`
  display: none; /* Hidden on mobile by default */
  background: linear-gradient(-45deg, #7c3aed, #a855f7, #6d28d9, #4c1d95);
  background-size: 400% 400%;
  animation: ${backgroundFlow} 15s ease infinite;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #fff;
  overflow: hidden;

  @media (min-width: 992px) {
    display: flex; /* Visible on desktop, occupying the first grid column */
  }
`;

const QuoteWrapper = styled.div`
  text-align: center;
  max-width: 500px;
  position: relative;
  z-index: 2;
`;

const QuoteText = styled.p`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 1.5rem;
  font-style: italic;
  animation: ${quoteFade} 8s linear infinite;
`;

const QuoteAuthor = styled.span`
  font-size: 1rem;
  font-weight: 300;
  opacity: 0.8;
  animation: ${quoteFade} 8s linear infinite;
  animation-delay: 0.1s;
`;

const Shape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  animation: ${shapeFloat} 20s ease-in-out infinite alternate;
  
  &:nth-child(1) { width: 150px; height: 150px; top: 10%; left: 15%; animation-duration: 22s; }
  &:nth-child(2) { width: 80px; height: 80px; top: 25%; right: 10%; animation-duration: 18s; }
  &:nth-child(3) { width: 120px; height: 120px; bottom: 15%; left: 20%; animation-duration: 25s; }
  &:nth-child(4) { width: 60px; height: 60px; bottom: 10%; right: 25%; animation-duration: 15s; }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem; /* Base padding for mobile */
  position: relative;
  background-color: #e2e1de;
  /* REMOVED min-height: 100vh; to prevent overflow */
  
  @media (min-width: 992px) {
    padding: 3rem;
  }
`;

const HomeLink = styled.a`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: #6b7280;
  transition: color 0.3s ease;

  &:hover {
    color: #1f2937;
  }
`;

const LoginFormContainer = styled.div`
  width: 100%;
  max-width: 380px;
  animation: ${slideInFromRight} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 1.7rem; /* Reduced for mobile */
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem; /* Reduced */
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.25rem;
    text-align: left;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem; /* Reduced */
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
    text-align: left;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1rem; /* Reduced */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem; /* Adjusted for mobile */
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.9rem; /* Reduced for mobile */
  background-color: #f5f4f2;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3);
    background-color: #fff;
  }
  
  @media (min-width: 768px) {
    padding: 0.9rem 1rem 0.9rem 3.5rem;
    font-size: 1rem;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem; /* Adjusted for mobile */
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  
  @media (min-width: 768px) {
    left: 1.25rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem; /* Reduced for mobile */
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #8b5cf6, #6d28d9);
  color: #fff;
  font-size: 0.95rem; /* Reduced for mobile */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(124, 58, 237, 0.3);
  }
  
  @media (min-width: 768px) {
    padding: 0.9rem;
    font-size: 1rem;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 1.25rem 0; /* Reduced */

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #d1d5db;
  }
  &:not(:empty)::before { margin-right: .75em; }
  &:not(:empty)::after { margin-left: .75em; }
`;

const SocialLoginButton = styled(LoginButton)`
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: 1.25rem; /* Reduced */
  font-size: 0.9rem;
  color: #6b7280;
  
  a {
    color: #6d28d9;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.2v2.7h5.3c-.2 1.9-1.6 3.3-3.6 3.3c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.1 0 2 .5 2.6 1.1l2.1-2.1C17.2 6.6 15.3 6 13.5 6c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c3.4 0 6.2-2.7 6.2-6.2c0-.6-.1-1.1-.2-1.6z"/></svg>
);


// --- The Login Page Component ---
const LoginPage = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 8000); // 8 seconds to match animation duration
    return () => clearInterval(timer);
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <LoginPageWrapper>
      <LeftPanel>
        <Shape />
        <Shape />
        <Shape />
        <Shape />
        <QuoteWrapper key={currentQuoteIndex}>
          <QuoteText>"{currentQuote.text}"</QuoteText>
          <QuoteAuthor>— {currentQuote.author}</QuoteAuthor>
        </QuoteWrapper>
      </LeftPanel>

      <RightPanel>
        <HomeLink href="/" aria-label="Back to Homepage">
          <Home size={24} />
        </HomeLink>

        <LoginFormContainer>
          <Title>Welcome Back!</Title>
          <Subtitle>Log in to manage your receipts with ease.</Subtitle>
          <form>
            <FormGroup>
              <InputIcon><Mail size={18} /></InputIcon>
              <Input type="email" placeholder="Email Address" required />
            </FormGroup>
            <FormGroup>
              <InputIcon><Lock size={18} /></InputIcon>
              <Input type="password" placeholder="Password" required />
            </FormGroup>
            <LoginButton type="submit">
              Log In <ArrowRight size={20} />
            </LoginButton>
          </form>
          
          <Divider>or</Divider>

          <SocialLoginButton>
            <GoogleIcon />
            Continue with Google
          </SocialLoginButton>
          
          <SignUpLink>
            Don't have an account? <a href="/signup">Sign Up</a>
          </SignUpLink>
        </LoginFormContainer>
      </RightPanel>
    </LoginPageWrapper>
  );
};

export default LoginPage;
