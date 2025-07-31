import React, { useState } from 'react';
import Navbar from './Navbar'; // Assuming Navbar.jsx is in the same folder
import styled, { keyframes } from 'styled-components';
import { ArrowRight, FileText, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const textFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;


// Styled Components
const HeroWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #e2e1de; // A clean, off-white background
  color: #1c1c1c;
  padding: 2rem;
  overflow: hidden;
  text-align: left;
  position: relative;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1000px;
  width: 100%;
`;

const Headline = styled.h1`
  font-size: 7rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.04em;
  
  & > div {
    opacity: 0;
    animation: ${fadeInUp} 1s ease-out forwards;
  }
  & > div:nth-child(2) { animation-delay: 0.15s; }
  & > div:nth-child(3) { animation-delay: 0.3s; }

  @media (max-width: 992px) {
    font-size: 5rem;
  }
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
  @media (max-width: 480px) {
    font-size: 2.8rem;
  }
`;

const HighlightedText = styled.span`
  display: inline-block;
  background-color: #7c3aed; // A vibrant purple
  color: #f8f7f4;
  padding: 0.2em 0.5em;
  border-radius: 30px;
  margin-left: 0.2em;
  animation: ${textFloat} 4s ease-in-out infinite;
  animation-delay: 1s;

  @media (max-width: 768px) {
    border-radius: 20px;
  }
`;

const Subheadline = styled.p`
  font-size: 1.25rem;
  max-width: 350px;
  margin: 2rem 0 0 0.5rem;
  line-height: 1.6;
  opacity: 0;
  animation: ${fadeInUp} 1s 0.5s ease-out forwards;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 300px;
  }
`;

const CTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: #1c1c1c;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 2rem;
  margin-left: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s 0.7s ease-out forwards;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #7c3aed;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.25);
    
    &::after {
      transform: translateX(0);
    }
  }

  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  color: #7c3aed;
  opacity: 0.3;
  animation: ${float} infinite, ${fadeInUp} 1s ease-out forwards;

  &:nth-child(1) { top: 10%; right: 5%; animation-duration: 8s, 1s; animation-delay: 0.8s; }
  &:nth-child(2) { bottom: 20%; right: 15%; animation-duration: 12s, 1s; animation-delay: 1s; }
  &:nth-child(3) { top: 30%; left: -5%; animation-duration: 10s, 1s; animation-delay: 1.2s; }

  @media (max-width: 992px) {
    &:nth-child(3) { display: none; }
  }
`;

const CircularText = styled.div`
  position: absolute;
  bottom: 5%;
  left: 5%;
  width: 150px;
  height: 150px;
  opacity: 0;
  animation: ${spin} 20s linear infinite, ${fadeInUp} 1s 1s ease-out forwards;
  
  svg {
    width: 100%;
    height: 100%;
    fill: #1c1c1c;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    bottom: 2%;
    left: 2%;
  }
`;

// --- NEW MODAL STYLES ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 450px;
  text-align: center;
  animation: ${modalFadeIn} 0.3s ease-out;
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LoginModalButton = styled(ModalButton)`
  background: #1c1c1c;
  color: #fff;
  
  &:hover {
    background: #3a3a3a;
  }
`;

const ContinueModalButton = styled(ModalButton)`
  background: #f3f4f6;
  color: #1c1c1c;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #e5e7eb;
  }
`;


// The Hero Component
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
    setIsModalOpen(false);
  };

  const handleGuestRedirect = () => {
    navigate('/templates');
    setIsModalOpen(false);
  };

  return (
    <>
      <HeroWrapper>
        <Navbar/>
        <ContentContainer>
          <Headline>
            <div>Digital Receipts,</div>
            <div><HighlightedText>Beautifully</HighlightedText></div>
            <div>Simple.</div>
          </Headline>
          <Subheadline>
            GenSlip is the effortless way to create, manage, and send professional-grade digital slips.
          </Subheadline>
          <CTAButton onClick={() => setIsModalOpen(true)}>
            Start Creating <ArrowRight size={20} />
          </CTAButton>
        </ContentContainer>

        <FloatingIcon><FileText size={40} /></FloatingIcon>
        <FloatingIcon><Zap size={50} /></FloatingIcon>
        <FloatingIcon><CheckCircle size={30} /></FloatingIcon>
        
        <CircularText>
          <svg viewBox="0 0 100 100">
            <path d="M 0,50 a 50,50 0 1,1 0,1 z" id="circlePath" fill="none"/>
            <text>
              <textPath href="#circlePath">
                • FAST & EASY • GENSLIP • FAST & EASY
              </textPath>
            </text>
          </svg>
        </CircularText>
      </HeroWrapper>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalDescription>
              Log in to save your details and templates.
            </ModalDescription>
            <ButtonContainer>
              <LoginModalButton onClick={handleLoginRedirect}>Login</LoginModalButton>
              <ContinueModalButton onClick={handleGuestRedirect}>Continue without Logging In</ContinueModalButton>
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default Hero;
