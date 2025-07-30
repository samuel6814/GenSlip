import React from 'react';
import Navbar from './Navbar';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, FileText, CheckCircle, Zap } from 'lucide-react';

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

// Styled Components
const HeroWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f7f4; // A clean, off-white background
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
  
  // Staggered animation for each line/word
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 2rem;
  margin-left: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s 0.7s ease-out forwards;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-left: 0.5rem;
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


// The Hero Component
const Hero = () => {
  return (
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
        <CTAButton>
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
  );
};

export default Hero;
