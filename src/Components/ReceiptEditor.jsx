import React, { useState, useMemo, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { 
  Upload, Building, Phone, 
  Plus, Trash2, Package, Hash, DollarSign, Percent,
  Printer, Download, ArrowLeft, ChevronsUpDown, Loader, Save, CheckCircle, AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// --- FIREBASE IMPORTS ---
import { db } from './../Firebase';
import { doc, setDoc } from "firebase/firestore";

// Reusable SVG Logo Component
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

const toastIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

// --- Styled Components ---

const EditorWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 2rem;
  padding: 2rem;
  align-items: start;
  min-height: 100vh;
  background-color: #e2e1de;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
`;

const FormSection = styled.div`
  width: 100%;
  background-color: #f5f4f2;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  animation: ${slideDown} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SectionNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1c1c1c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1c1c1c;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
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
  color: #888;
  font-size: 1rem;
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap; 
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  font-size: 1rem;
  color: #1c1c1c;
  
  &:focus {
    outline: none;
    border-bottom-color: #7c3aed;
  }
  
  &:focus + ${FloatingLabel},
  &:not(:placeholder-shown) + ${FloatingLabel} {
    top: -0.5rem;
    left: 2.5rem;
    font-size: 0.75rem;
    color: #7c3aed;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  font-size: 1rem;
  color: #1c1c1c;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-bottom-color: #7c3aed;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;


const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  .select-arrow {
    right: 0;
    left: auto;
  }
`;

const LogoUploader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #e9e8e5;
  border-radius: 12px;
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
  background-color: #1c1c1c;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;

  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: #7c3aed;
  }

  input[type="file"] {
    display: none;
  }
`;

// --- Item List Styles ---
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  animation: ${slideDown} 0.4s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #e9e8e5;

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

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    & > div:first-child,
    & > div:nth-child(4),
    & > button:last-child {
      grid-column: auto;
    }
    & > button:last-child {
      justify-self: start;
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
  background-color: #d1d0cd;
  color: #1c1c1c;
  border: 2px dashed #b0afac;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c1c0bd;
    border-color: #7c3aed;
  }
`;

// --- Action Button Styles ---
const ActionPanel = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
  border: 2px solid #1c1c1c;
  background-color: #1c1c1c;
  color: #fff;
  flex-grow: 1; 

  @media (min-width: 768px) {
    flex-grow: 0; 
  }

  &:hover {
    background-color: #7c3aed;
    border-color: #7c3aed;
    transform: translateY(-2px);
  }

  &.secondary {
    background-color: transparent;
    color: #1c1c1c;
    &:hover {
      background-color: #d1d0cd;
      border-color: #d1d0cd;
    }
  }
  
  &:disabled {
    background-color: #999;
    border-color: #999;
    cursor: not-allowed;
    transform: none;
  }
`;

const AnimatedLoader = styled(Loader)`
  animation: ${spinAnimation} 1s linear infinite;
`;

// --- Preview Panel Styles ---
const PreviewPanel = styled.div`
  width: 100%;
  position: sticky;
  top: 2rem;

  @media (max-width: 1024px) {
    position: static;
    top: auto;
  }
`;

const ReceiptPreviewContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
`;

const ReceiptPreview = styled.div`
  font-family: 'SF Mono', 'Courier New', Courier, monospace;
  color: #000;
  padding: 1.5rem;
  border: 1px solid #eee;
  background: #fff;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ReceiptHeader = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  
  img, svg {
    margin-bottom: 1rem;
    max-width: 80px;
    height: auto;
  }
`;

const BrandName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const StoreInfo = styled.p`
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0.2rem 0;
  word-break: break-word;
`;

const ReceiptBody = styled.section`
  margin: 1.5rem 0;
  border-top: 1px dashed #999;
  border-bottom: 1px dashed #999;
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
    border-top: 2px solid #000;
  }
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  label {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

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
    background-color: #ccc;
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
    background-color: #7c3aed;
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToastWrapper = styled.div`
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 3000;
    animation: ${toastIn} 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    background-color: ${props => props.type === 'success' ? '#27ae60' : '#c0392b'};
`;

const defaultReceiptState = {
  brandName: 'Your Brand',
  logo: null,
  address: '123 Main Street, Anytown',
  phone: '(123) 456-7890',
  items: [{ id: Date.now(), name: 'Sample Item', quantity: 2, price: 12.50 }],
  taxRate: 15,
  vatRate: 2.5,
  discount: 5,
  currency: 'GH₵',
  totalOverride: '',
  isManualTotal: false,
};


// --- The Main Editor Component ---
const ReceiptEditor = ({ user, existingReceipt = null, isReadOnly = false, onBack = null }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [receipt, setReceipt] = useState(existingReceipt || defaultReceiptState);

  // --- NEW: Effect to fix scrolling on mobile ---
  useEffect(() => {
    // When the editor is opened, ensure the body is scrollable.
    document.body.style.overflow = 'auto';
  }, []);

  // Effect to load existing receipt data when the component mounts or props change
  useEffect(() => {
    if (existingReceipt) {
      setReceipt(existingReceipt);
    } else {
      // If there's no existing receipt, reset to default state
      setReceipt(defaultReceiptState);
    }
  }, [existingReceipt]);

  // Effect to hide the toast after a few seconds
  useEffect(() => {
    if (toast.show) {
        const timer = setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

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

  const handleSaveOrUpdateReceipt = async () => {
    if (!user) {
        showToast("Please log in to save your receipt.", "error");
        return;
    }
    setIsSaving(true);
    
    // If it's an existing receipt, we use its ID. Otherwise, create a new one.
    const receiptId = existingReceipt?.firestoreId || `receipt-${Date.now()}`;
    const receiptRef = doc(db, 'users', user.uid, 'receipts', receiptId);
    
    try {
        await setDoc(receiptRef, { ...receipt, id: receiptId, savedAt: new Date() }, { merge: true });
        showToast(existingReceipt ? "Receipt updated successfully!" : "Receipt saved successfully!");
        if (!existingReceipt) {
            // If it's a new receipt, reset the form after saving
            setReceipt(defaultReceiptState);
        }
    } catch (error) {
        console.error("Error saving receipt: ", error);
        showToast("Failed to save receipt. Please try again.", "error");
    } finally {
        setIsSaving(false);
    }
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
      <GlobalStyles />
      {toast.show && (
        <ToastWrapper type={toast.type}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </ToastWrapper>
      )}
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
                  <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} disabled={isReadOnly} />
                </UploadButton>
              </div>
            </LogoUploader>
            <FormGroup>
              <InputWrapper>
                <Building size={18} />
                <Input id="brandName" name="brandName" value={receipt.brandName} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                <FloatingLabel htmlFor="brandName">Brand Name</FloatingLabel>
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <InputWrapper>
                <Building size={18} />
                <Input id="address" name="address" value={receipt.address} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                <FloatingLabel htmlFor="address">Address</FloatingLabel>
              </InputWrapper>
            </FormGroup>
            <FormGroup style={{marginBottom: 0}}>
              <InputWrapper>
                <Phone size={18} />
                <Input id="phone" name="phone" value={receipt.phone} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
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
                      <Input value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder=" " disabled={isReadOnly} />
                      <FloatingLabel>Item Name</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <Hash size={18} />
                      <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} placeholder=" " disabled={isReadOnly} />
                      <FloatingLabel>Qty</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <DollarSign size={18} />
                      <Input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder=" " disabled={isReadOnly} />
                      <FloatingLabel>Price</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <div>{receipt.currency}{(item.quantity * item.price).toFixed(2)}</div>
                  <RemoveButton onClick={() => handleRemoveItem(item.id)} disabled={isReadOnly}><Trash2 size={20} /></RemoveButton>
                </ItemRow>
              ))}
            </ItemList>
            <AddItemButton onClick={handleAddItem} disabled={isReadOnly}><Plus size={18}/> Add Item</AddItemButton>
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
                        <Input type="number" name="taxRate" value={receipt.taxRate} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                        <FloatingLabel>Tax/VAT (%)</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <Percent size={18} />
                        <Input type="number" name="vatRate" value={receipt.vatRate} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                        <FloatingLabel>Levy/NHIL (%)</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Input type="number" name="discount" value={receipt.discount} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                        <FloatingLabel>Discount</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
            </TotalsRow>
            <TotalsRow>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Select name="currency" value={receipt.currency} onChange={handleInputChange} disabled={isReadOnly}>
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
                        <input type="checkbox" id="isManualTotal" name="isManualTotal" checked={receipt.isManualTotal} onChange={handleInputChange} disabled={isReadOnly} />
                        <span></span>
                    </Switch>
                </ToggleSwitchWrapper>
                {receipt.isManualTotal && (
                    <FormGroup style={{marginBottom: 0}}>
                        <InputWrapper>
                            <DollarSign size={18} />
                            <Input type="number" name="totalOverride" value={receipt.totalOverride} onChange={handleInputChange} placeholder=" " disabled={isReadOnly} />
                            <FloatingLabel>Manual Total</FloatingLabel>
                        </InputWrapper>
                    </FormGroup>
                )}
            </TotalsRow>
          </FormSection>

          {/* Finalize & Export Section */}
          <FormSection>
            <SectionHeader>
              <SectionNumber>4</SectionNumber>
              <SectionTitle>Finalize & Export</SectionTitle>
            </SectionHeader>
            <ActionPanel>
                {onBack && (
                    <ActionButton onClick={onBack} className="secondary">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </ActionButton>
                )}
                {!isReadOnly && (
                    <ActionButton onClick={handleSaveOrUpdateReceipt} disabled={isSaving || isDownloading}>
                      {isSaving ? <AnimatedLoader size={18}/> : <Save size={18}/>}
                      {isSaving ? 'Saving...' : (existingReceipt ? 'Update Receipt' : 'Save Receipt')}
                    </ActionButton>
                )}
                <ActionButton onClick={handlePrint} disabled={isDownloading}><Printer size={18}/> Print Receipt</ActionButton>
                <ActionButton className="secondary" onClick={handleDownloadPDF} disabled={isDownloading}>
                  {isDownloading ? <AnimatedLoader size={18}/> : <Download size={18}/>}
                  {isDownloading ? 'Downloading...' : 'Download as PDF'}
                </ActionButton>
            </ActionPanel>
          </FormSection>

        </FormsColumn>

        <PreviewPanel>
          <ReceiptPreviewContainer id="printable-receipt">
            <ReceiptPreview>
              <ReceiptHeader>
                {receipt.logo ? <img src={receipt.logo} alt="Brand Logo" /> : <Logo size={60} />}
                <BrandName>{receipt.brandName}</BrandName>
                <StoreInfo>{receipt.address}</StoreInfo>
                <StoreInfo>{receipt.phone}</StoreInfo>
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

export default ReceiptEditor;
