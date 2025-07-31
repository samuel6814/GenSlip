import React, { useState, useMemo } from 'react';
import styled, { keyframes, createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Upload, Building, Phone,
  Plus, Trash2, Package, Hash, DollarSign, Percent,
  Printer, Download, ArrowRight, ChevronsUpDown, Loader, Palette, X, Home, Save
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- THEME DEFINITIONS FOR TEMPLATES ---

const initialTemplates = [
  {
    id: 'classic',
    name: 'Modern Classic',
    description: 'Clean, professional, and timeless.',
    theme: {
      colors: {
        background: '#e2e1de',
        formBackground: '#f5f4f2',
        previewBackground: '#ffffff',
        primaryText: '#1c1c1c',
        secondaryText: '#555',
        accent: '#7c3aed',
        border: '#ccc',
        subtle: '#e9e8e5',
      },
      fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        receipt: "'Courier New', monospace",
      },
      borderRadius: '24px',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Express',
    description: 'A sleek and modern dark theme.',
    theme: {
      colors: {
        background: '#1a1d24',
        formBackground: '#252932',
        previewBackground: '#1a1d24',
        primaryText: '#f0f0f0',
        secondaryText: '#a0a0a0',
        accent: '#3498db',
        border: '#444',
        subtle: '#333842',
      },
      fonts: {
        heading: "'Roboto', sans-serif",
        body: "'Roboto', sans-serif",
        receipt: "'Fira Code', monospace",
      },
      borderRadius: '16px',
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Paper',
    description: 'Classic, warm, and reminiscent of old paper.',
    theme: {
      colors: {
        background: '#fdf6e3',
        formBackground: '#fbf1c7',
        previewBackground: '#fdf6e3',
        primaryText: '#654321',
        secondaryText: '#8d6e63',
        accent: '#d32f2f',
        border: '#d7ccc8',
        subtle: '#efebe9',
      },
      fonts: {
        heading: "'Merriweather', serif",
        body: "'Lora', serif",
        receipt: "'Cutive Mono', monospace",
      },
      borderRadius: '8px',
    }
  },
    {
    id: 'eco',
    name: 'Eco Green',
    description: 'Fresh, natural, and environmentally friendly.',
    theme: {
      colors: {
        background: '#edf4f2',
        formBackground: '#ffffff',
        previewBackground: '#f8fbf7',
        primaryText: '#0d5c46',
        secondaryText: '#4a7c6d',
        accent: '#27ae60',
        border: '#c8e6c9',
        subtle: '#e8f5e9',
      },
      fonts: {
        heading: "'Poppins', sans-serif",
        body: "'Poppins', sans-serif",
        receipt: "'Source Code Pro', monospace",
      },
      borderRadius: '20px',
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Sharp, clean, and business-focused.',
    theme: {
      colors: {
        background: '#f0f4f8',
        formBackground: '#ffffff',
        previewBackground: '#f8f9fa',
        primaryText: '#0a2540',
        secondaryText: '#525f7f',
        accent: '#007bff',
        border: '#dee2e6',
        subtle: '#e9ecef',
      },
      fonts: {
        heading: "'Lato', sans-serif",
        body: "'Lato', sans-serif",
        receipt: "'Roboto Mono', monospace",
      },
      borderRadius: '12px',
    }
  },
];


// --- Reusable SVG Logo Component ---
const Logo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#7c3aed', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path
      d="M 65,15 A 35,35 0 1 0 50,85 A 35,35 0 0 0 80,65 L 80,50 L 60,50 L 60,60 A 10,10 0 1 1 50,70 A 10,10 0 0 1 60,60 L 60,35 L 40,35 L 40,25 L 65,25 Z"
      fill="url(#grad1)"
      stroke="#1c1c1c"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Keyframes ---
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;


const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// --- Global Styles ---
const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media print {
    body * {
      visibility: hidden;
    }
    #printable-receipt, #printable-receipt * {
      visibility: visible;
    }
    #printable-receipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
  }
`;

// --- THEMED Styled Components for the Editor ---

const EditorWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 1rem;
  align-items: start;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.body};
  transition: background-color 0.5s ease;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 3rem;
    padding: 4rem 2rem;
  }
`;

const FormsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;

  @media (min-width: 1024px) {
    gap: 2rem;
  }
`;

const FormSection = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.formBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  animation: ${slideDown} 0.5s ease-out;
  transition: background-color 0.5s ease, color 0.5s ease, border-radius 0.5s ease;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SectionNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryText};
  color: ${({ theme }) => theme.colors.formBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  transition: background-color 0.5s ease, color 0.5s ease;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryText};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  min-width: 0;
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 1rem;
  left: 2.5rem;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 1rem;
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primaryText};

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus + ${FloatingLabel},
  &:not(:placeholder-shown) + ${FloatingLabel} {
    top: -0.5rem;
    left: 2.5rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primaryText};
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.accent};
  }
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.secondaryText};
  }

  .select-arrow {
    right: 0;
    left: auto;
  }
`;

const LogoUploader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.subtle};
  border-radius: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
`;

const LogoPreview = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: ${({ theme }) => theme.colors.primaryText};
  color: ${({ theme }) => theme.colors.formBackground};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  input[type="file"] {
    display: none;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.subtle};
  animation: ${slideDown} 0.4s ease-out;

  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
    & > div:first-child {
      grid-column: 1 / -1;
    }
    & > div:nth-child(4) {
      grid-column: 1 / 2;
    }
    & > button:last-child {
      grid-column: 2 / 3;
      justify-self: end;
    }
  }

  @media (min-width: 768px) {
    grid-template-columns: 3fr 1fr 1fr 1fr auto;
    background-color: transparent;
    padding: 0;
    & > div:first-child,
    & > div:nth-child(4),
    & > button:last-child {
      grid-column: auto;
    }
  }
`;

const TotalsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 50%;
  justify-self: end;

  @media (max-width: 499px) {
    justify-self: start;
  }

  &:hover {
    color: #fff;
    background-color: #e53e3e;
  }
`;

const AddItemButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  margin-top: 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primaryText};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subtle};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ActionPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.colors.primaryText};
  background-color: ${({ theme }) => theme.colors.primaryText};
  color: ${({ theme }) => theme.colors.formBackground};
  text-decoration: none;
  flex-grow: 1;

  @media (min-width: 768px) {
    flex-grow: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }

  &.secondary {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primaryText};
    &:hover {
      background-color: ${({ theme }) => theme.colors.subtle};
      border-color: ${({ theme }) => theme.colors.subtle};
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AnimatedLoader = styled(Loader)`
  animation: ${spinAnimation} 1s linear infinite;
`;

const PreviewPanel = styled.div`
  width: 100%;
  position: static;
  top: auto;

  @media (min-width: 1024px) {
    position: sticky;
    top: 2rem;
  }
`;

const ReceiptPreviewContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.previewBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
  transition: background-color 0.5s ease, color 0.5s ease, border-radius 0.5s ease;
`;

const ReceiptPreview = styled.div`
  font-family: ${({ theme }) => theme.fonts.receipt};
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.previewBackground};

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ReceiptHeader = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;

  img, svg {
    margin-bottom: 1rem;
  }
`;

const BrandName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const StoreInfo = styled.p`
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0.2rem 0;
  word-break: break-word;
`;

const ReceiptBody = styled.section`
  margin: 1.5rem 0;
  border-top: 1px dashed ${({ theme }) => theme.colors.secondaryText};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.secondaryText};
  padding: 1rem 0;
`;

const ReceiptItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const ReceiptFooter = styled.footer`
  margin-top: 1.5rem;
`;

const TotalFooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  &.grand-total {
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid ${({ theme }) => theme.colors.primaryText};
  }
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.border};
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

// --- Template Selection UI ---
const TemplateSelectionWrapper = styled.div`
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryText};
  min-height: 100vh;
  transition: background-color 0.5s ease;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const TemplateSelectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideDown} 0.5s ease-out;
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.secondaryText};
    max-width: 600px;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    margin-bottom: 3rem;
    h1 {
      font-size: 3rem;
    }
    p {
      font-size: 1.2rem;
    }
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const TemplateCard = styled.div`
  background-color: ${({ theme }) => theme.colors.formBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.5s ease, color 0.5s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
  }

  @media (min-width: 1024px) {
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      }
  }
`;

const TemplatePreview = styled.div`
  height: 180px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.receipt};
  border-bottom: 4px solid ${({ theme }) => theme.colors.accent};
  transition: background-color 0.5s ease, border-color 0.5s ease;

  @media (min-width: 768px) {
    height: 200px;
  }
`;

const MiniReceipt = styled.div`
    width: 80%;
    height: 80%;
    background: ${({ theme }) => theme.colors.previewBackground};
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 0.5rem;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.primaryText};
    transition: background-color 0.5s ease, color 0.5s ease;
`;


const TemplateInfo = styled.div`
  padding: 1rem;
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.secondaryText};
    margin: 0;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    h3 {
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const CustomTemplateCard = styled(TemplateCard)`
  background: linear-gradient(45deg, #f5f4f2, #e9e8e5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px dashed #b0afac;
`;

// --- Custom Template Creator Modal ---
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: ${fadeIn} 0.3s ease-out;
    padding: 1rem;
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 1400px;
    height: 90vh;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    display: grid;
    grid-template-columns: 1fr;
    overflow: hidden;
    animation: ${slideDown} 0.4s ease-out;

    @media (min-width: 1024px) {
        grid-template-columns: 380px 1fr;
    }
`;

const CustomizerPanel = styled.div`
    background-color: ${({ theme }) => theme.colors.formBackground};
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
        padding: 2rem;
    }
`;

const LivePreviewPanel = styled.div`
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    & > div { /* EditorWrapper */
        padding: 0;
        grid-template-columns: 1fr;
        max-width: 450px;
        margin: 0 auto;
    }

    & ${FormsColumn} {
        display: none;
    }
    & ${PreviewPanel} {
        position: static;
    }

    @media (min-width: 768px) {
        padding: 2rem;
    }
`;

const ColorInputWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    label {
        text-transform: capitalize;
    }

    input[type="color"] {
        -webkit-appearance: none;
        border: none;
        width: 32px;
        height: 32px;
        background: none;
        cursor: pointer;
        &::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        &::-webkit-color-swatch {
            border: 1px solid #ccc;
            border-radius: 50%;
        }
    }
`;

// --- NEW: Component for the Custom Template Creator Modal ---
const CustomTemplateCreatorModal = ({ template, onTemplateChange, onClose, onSave }) => {
    const { theme } = template;

    const ColorControl = ({ label, value, name }) => (
        <ColorInputWrapper>
            <label htmlFor={name}>{label.replace(/([A-Z])/g, ' $1')}</label>
            <input
                id={name}
                type="color"
                value={value}
                onChange={(e) => onTemplateChange(`theme.colors.${name}`, e.target.value)}
            />
        </ColorInputWrapper>
    );

    return (
        <ModalOverlay>
            <ThemeProvider theme={theme}>
                <ModalContent>
                    <CustomizerPanel>
                        <SectionHeader style={{justifyContent: 'space-between', marginBottom: '1rem'}}>
                            <SectionTitle style={{fontSize: '1.8rem'}}>Designer</SectionTitle>
                            <RemoveButton onClick={onClose} style={{color: theme.colors.secondaryText}}><X size={24} /></RemoveButton>
                        </SectionHeader>
                        
                        <FormGroup>
                            <InputWrapper>
                                <Palette size={18} />
                                <Input
                                    id="templateName"
                                    value={template.name}
                                    onChange={(e) => onTemplateChange('name', e.target.value)}
                                    placeholder=" "
                                />
                                <FloatingLabel htmlFor="templateName">Template Name</FloatingLabel>
                            </InputWrapper>
                        </FormGroup>

                        <SectionTitle style={{fontSize: '1.2rem', marginTop: '1rem', marginBottom: '1rem'}}>Colors</SectionTitle>
                        {Object.entries(theme.colors).map(([key, value]) => (
                            <ColorControl key={key} label={key} value={value} name={key} />
                        ))}

                        <SectionTitle style={{fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem'}}>Fonts</SectionTitle>
                        <FormGroup style={{marginBottom: '0.5rem'}}>
                            <Select value={theme.fonts.heading} onChange={e => onTemplateChange('theme.fonts.heading', e.target.value)}>
                                <option value="'Inter', sans-serif">Inter</option>
                                <option value="'Roboto', sans-serif">Roboto</option>
                                <option value="'Merriweather', serif">Merriweather</option>
                                <option value="'Poppins', sans-serif">Poppins</option>
                                <option value="'Lato', sans-serif">Lato</option>
                                <option value="'Courier New', monospace">Courier New</option>
                            </Select>
                        </FormGroup>

                        <SectionTitle style={{fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem'}}>Border Radius</SectionTitle>
                        <FormGroup>
                            <input type="range" min="0" max="40" value={parseInt(theme.borderRadius)} onChange={e => onTemplateChange('theme.borderRadius', `${e.target.value}px`)} style={{width: '100%'}}/>
                        </FormGroup>
                        
                        <div style={{marginTop: 'auto'}}>
                            <ActionPanel style={{marginTop: '2rem', gap: '0.5rem'}}>
                                <ActionButton onClick={onSave} style={{width: '100%'}}><Save size={18} /> Save & Use</ActionButton>
                                <ActionButton className="secondary" onClick={onClose} style={{width: '100%'}}>Cancel</ActionButton>
                            </ActionPanel>
                        </div>
                    </CustomizerPanel>
                    <LivePreviewPanel>
                       <ReceiptEditor isPreview={true} />
                    </LivePreviewPanel>
                </ModalContent>
            </ThemeProvider>
        </ModalOverlay>
    );
};


// --- The Main Editor Component (Unchanged) ---
const ReceiptEditor = ({ onBack, isPreview = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [receipt, setReceipt] = useState({
    brandName: 'Your Brand',
    logo: null,
    address: '123 Main Street, Anytown',
    phone: '(123) 456-7890',
    items: [{ id: 1, name: 'Sample Item', quantity: 2, price: 12.50 }],
    taxRate: 15,
    vatRate: 2.5,
    discount: 5,
    currency: 'GH₵',
    totalOverride: '',
    isManualTotal: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReceipt(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (id, field, value) => {
    setReceipt(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      quantity: 1,
      price: 0
    };
    setReceipt(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveItem = (id) => {
    setReceipt(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const input = document.getElementById('printable-receipt');

    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width * 0.75, canvas.height * 0.75]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
        pdf.save(`receipt-${Date.now()}.pdf`);
        setIsDownloading(false);
      })
      .catch(err => {
        console.error("Error generating PDF", err);
        setIsDownloading(false);
      });
  };

  const subtotal = useMemo(() =>
    receipt.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
    [receipt.items]
  );

  const taxAmount = useMemo(() =>
    subtotal * (parseFloat(receipt.taxRate) / 100),
    [subtotal, receipt.taxRate]
  );

  const vatAmount = useMemo(() =>
    subtotal * (parseFloat(receipt.vatRate) / 100),
    [subtotal, receipt.vatRate]
  );

  const grandTotal = useMemo(() =>
    subtotal + taxAmount + vatAmount - parseFloat(receipt.discount || 0),
    [subtotal, taxAmount, vatAmount, receipt.discount]
  );

  const finalTotal = receipt.isManualTotal && receipt.totalOverride !== ''
    ? parseFloat(receipt.totalOverride)
    : grandTotal;

  return (
    <>
      <EditorWrapper>
        <FormsColumn>
          {/* Store Details Section */}
          <FormSection>
            <SectionHeader>
              <SectionNumber>1</SectionNumber>
              <SectionTitle>Store Details</SectionTitle>
            </SectionHeader>
            <LogoUploader>
              <LogoPreview>
                {receipt.logo ? <img src={receipt.logo} alt="Brand Logo Preview" /> : <Logo size={40} />}
              </LogoPreview>
              <div>
                <UploadButton>
                  <Upload size={16} />
                  Upload Logo
                  <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
                </UploadButton>
              </div>
            </LogoUploader>
            <FormGroup>
              <InputWrapper>
                <Building size={18} />
                <Input id="brandName" name="brandName" value={receipt.brandName} onChange={handleInputChange} placeholder=" " />
                <FloatingLabel htmlFor="brandName">Brand Name</FloatingLabel>
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <InputWrapper>
                <Building size={18} />
                <Input id="address" name="address" value={receipt.address} onChange={handleInputChange} placeholder=" " />
                <FloatingLabel htmlFor="address">Address</FloatingLabel>
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <InputWrapper>
                <Phone size={18} />
                <Input id="phone" name="phone" value={receipt.phone} onChange={handleInputChange} placeholder=" " />
                <FloatingLabel htmlFor="phone">Phone Number</FloatingLabel>
              </InputWrapper>
            </FormGroup>
          </FormSection>

          {/* Line Items Section */}
          <FormSection>
            <SectionHeader>
              <SectionNumber>2</SectionNumber>
              <SectionTitle>Line Items</SectionTitle>
            </SectionHeader>
            <ItemList>
              {receipt.items.map(item => (
                <ItemRow key={item.id}>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <Package size={18} />
                      <Input value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder=" " />
                      <FloatingLabel>Item Name</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <Hash size={18} />
                      <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} placeholder=" " />
                      <FloatingLabel>Qty</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <DollarSign size={18} />
                      <Input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder=" " />
                      <FloatingLabel>Price</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <div>{receipt.currency}{(item.quantity * item.price).toFixed(2)}</div>
                  <RemoveButton onClick={() => handleRemoveItem(item.id)}><Trash2 size={20} /></RemoveButton>
                </ItemRow>
              ))}
            </ItemList>
            <AddItemButton onClick={handleAddItem}><Plus size={18}/> Add Item</AddItemButton>
          </FormSection>

          {/* Totals & Currency Section */}
          <FormSection>
            <SectionHeader>
              <SectionNumber>3</SectionNumber>
              <SectionTitle>Taxes & Totals</SectionTitle>
            </SectionHeader>
            <TotalsRow>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <Percent size={18} />
                        <Input type="number" name="taxRate" value={receipt.taxRate} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Tax/VAT (%)</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <Percent size={18} />
                        <Input type="number" name="vatRate" value={receipt.vatRate} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Levy/NHIL (%)</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Input type="number" name="discount" value={receipt.discount} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Discount</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
            </TotalsRow>
            <TotalsRow>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Select name="currency" value={receipt.currency} onChange={handleInputChange}>
                            <option value="GH₵">GH₵ (Ghana Cedi)</option>
                            <option value="$">$ (US Dollar)</option>
                            <option value="€">€ (Euro)</option>
                            <option value="£">£ (British Pound)</option>
                        </Select>
                        <ChevronsUpDown size={18} className="select-arrow" />
                    </InputWrapper>
                </FormGroup>
                <ToggleSwitchWrapper>
                    <label htmlFor="isManualTotal">Override Total</label>
                    <Switch>
                        <input type="checkbox" id="isManualTotal" name="isManualTotal" checked={receipt.isManualTotal} onChange={handleInputChange} />
                        <span></span>
                    </Switch>
                </ToggleSwitchWrapper>
                {receipt.isManualTotal && (
                    <FormGroup style={{marginBottom: 0}}>
                        <InputWrapper>
                            <DollarSign size={18} />
                            <Input type="number" name="totalOverride" value={receipt.totalOverride} onChange={handleInputChange} placeholder=" " />
                            <FloatingLabel>Manual Total</FloatingLabel>
                        </InputWrapper>
                    </FormGroup>
                )}
            </TotalsRow>
          </FormSection>

          {/* Finalize & Export Section */}
          {!isPreview && (
            <FormSection>
                <SectionHeader>
                <SectionNumber>4</SectionNumber>
                <SectionTitle>Finalize & Export</SectionTitle>
                </SectionHeader>
                <ActionPanel>
                    <ActionButton as="a" href="/" className="secondary">
                        <Home size={18}/> Home
                    </ActionButton>
                    <ActionButton onClick={handlePrint} disabled={isDownloading}><Printer size={18}/> Print Receipt</ActionButton>
                    <ActionButton className="secondary" onClick={handleDownloadPDF} disabled={isDownloading}>
                    {isDownloading ? <AnimatedLoader size={18}/> : <Download size={18}/>}
                    {isDownloading ? 'Downloading...' : 'Download as PDF'}
                    </ActionButton>
                    <ActionButton className="secondary" onClick={onBack}>Change Template</ActionButton>
                </ActionPanel>
            </FormSection>
          )}

        </FormsColumn>

        <PreviewPanel>
          <ReceiptPreviewContainer id="printable-receipt">
            <ReceiptPreview>
              <ReceiptHeader>
                {receipt.logo ? <img src={receipt.logo} alt="Brand Logo" width="80" /> : <Logo size={60} />}
                <BrandName>{receipt.brandName}</BrandName>
                <StoreInfo>{receipt.address}</StoreInfo>
              </ReceiptHeader>
              <ReceiptBody>
                {receipt.items.map(item => (
                  <ReceiptItem key={item.id}>
                    <span>{item.quantity} x {item.name}</span>
                    <span>{receipt.currency}{(item.quantity * item.price).toFixed(2)}</span>
                  </ReceiptItem>
                ))}
              </ReceiptBody>
              <ReceiptFooter>
                <TotalFooterRow>
                  <span>Subtotal</span>
                  <span>{receipt.currency}{subtotal.toFixed(2)}</span>
                </TotalFooterRow>
                <TotalFooterRow>
                  <span>Tax/VAT ({receipt.taxRate}%)</span>
                  <span>{receipt.currency}{taxAmount.toFixed(2)}</span>
                </TotalFooterRow>
                 <TotalFooterRow>
                  <span>Levy/NHIL ({receipt.vatRate}%)</span>
                  <span>{receipt.currency}{vatAmount.toFixed(2)}</span>
                </TotalFooterRow>
                {receipt.discount > 0 && (
                  <TotalFooterRow>
                    <span>Discount</span>
                    <span>-{receipt.currency}{parseFloat(receipt.discount).toFixed(2)}</span>
                  </TotalFooterRow>
                )}
                <TotalFooterRow className="grand-total">
                  <span>Total</span>
                  <span>{receipt.currency}{finalTotal.toFixed(2)}</span>
                </TotalFooterRow>
              </ReceiptFooter>
            </ReceiptPreview>
          </ReceiptPreviewContainer>
        </PreviewPanel>
      </EditorWrapper>
    </>
  );
};


// --- The Main Page Component that handles the workflow (REVISED) ---
const TemplatePage = () => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
    
    // Default state for a new custom template
    const [customTemplate, setCustomTemplate] = useState({
        id: 'custom',
        name: 'My Custom Design',
        description: 'A personalized receipt template.',
        theme: { ...initialTemplates[0].theme } // Start with the classic theme as a base
    });

    // A generic handler to update the nested state of the custom template
    const handleCustomTemplateChange = (path, value) => {
        setCustomTemplate(prev => {
            const newTemplate = JSON.parse(JSON.stringify(prev)); // Deep copy
            const keys = path.split('.');
            let current = newTemplate;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newTemplate;
        });
    };

    // Saves the new template, selects it, and closes the modal
    const handleSaveCustomTemplate = () => {
        const newTemplate = { ...customTemplate, id: `custom-${Date.now()}` };
        setTemplates(prev => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate);
        setIsCustomizerOpen(false);
    };

    // Render the main editor if a template is selected
    if (selectedTemplate) {
        return (
            <ThemeProvider theme={selectedTemplate.theme}>
                <GlobalStyles />
                <ReceiptEditor onBack={() => setSelectedTemplate(null)} />
            </ThemeProvider>
        );
    }

    // Render the template selection page if no template is selected
    return (
        <ThemeProvider theme={initialTemplates[0].theme}>
            <GlobalStyles />
            {isCustomizerOpen && (
                <CustomTemplateCreatorModal
                    template={customTemplate}
                    onTemplateChange={handleCustomTemplateChange}
                    onClose={() => setIsCustomizerOpen(false)}
                    onSave={handleSaveCustomTemplate}
                />
            )}
            <TemplateSelectionWrapper>
                <TemplateSelectionHeader>
                    <h1>Choose a Template</h1>
                    <p>Select a professionally designed template to start, or create your own from scratch.</p>
                </TemplateSelectionHeader>

                <ActionPanel style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                    <ActionButton as="a" href="/" className="secondary">
                        <Home size={18}/> Home
                    </ActionButton>
                </ActionPanel>

                <TemplateGrid>
                    {templates.map(template => (
                        <ThemeProvider theme={template.theme} key={template.id}>
                            <TemplateCard onClick={() => setSelectedTemplate(template)}>
                                <TemplatePreview>
                                    <MiniReceipt>
                                        <b>{template.name}</b>
                                        <hr />
                                        <span>Item 1.....$10.00</span><br/>
                                        <span>Item 2.....$15.00</span><br/>
                                        <b>Total.......$25.00</b>
                                    </MiniReceipt>
                                </TemplatePreview>
                                <TemplateInfo>
                                    <h3>{template.name}</h3>
                                    <p>{template.description}</p>
                                </TemplateInfo>
                            </TemplateCard>
                        </ThemeProvider>
                    ))}
                    <CustomTemplateCard as="div" onClick={() => setIsCustomizerOpen(true)}>
                         <TemplateInfo>
                            <Palette size={40} style={{marginBottom: '1rem'}}/>
                            <h3>Create Your Own</h3>
                            <p>Design a unique receipt that matches your brand perfectly.</p>
                        </TemplateInfo>
                    </CustomTemplateCard>
                </TemplateGrid>
            </TemplateSelectionWrapper>
        </ThemeProvider>
    );
};

export default TemplatePage;
