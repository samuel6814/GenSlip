import React, { useState, useMemo } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { 
  Upload, Building, Phone, Mail, Globe, 
  Plus, Trash2, Package, Hash, DollarSign, Percent,
  Printer, Download, ArrowRight
} from 'lucide-react';

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

// --- Global Styles for Printing ---
const PrintStyles = createGlobalStyle`
  @media print {
    body * {
      visibility: hidden;
    }
    #receipt-preview, #receipt-preview * {
      visibility: visible;
    }
    #receipt-preview {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      max-width: 100%;
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
  gap: 3rem;
  padding: 4rem 2rem;
  align-items: start;
  min-height: 100vh;
  background-color: #e2e1de;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FormsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  width: 100%;
  background-color: #f5f4f2;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  animation: ${slideDown} 0.5s ease-out;
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
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1c1c1c;
  margin: 0;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 1rem;
  left: 2.5rem;
  color: #888;
  font-size: 1rem;
  transition: all 0.2s ease;
  pointer-events: none;
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
  grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
  gap: 1rem;
  align-items: center;
  animation: ${slideDown} 0.4s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #e9e8e5;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
`;

// --- Preview Panel Styles ---
const PreviewPanel = styled.div`
  width: 100%;
  position: sticky;
  top: 2rem;
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
`;

const ReceiptHeader = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  
  img, svg {
    margin-bottom: 1rem;
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
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const ReceiptFooter = styled.footer`
  margin-top: 1.5rem;
`;

const TotalRow = styled.div`
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

// --- The Main Editor Component ---
const ReceiptEditor = () => {
  const [receipt, setReceipt] = useState({
    brandName: 'Your Brand',
    logo: null,
    address: '123 Main Street, Anytown',
    phone: '(123) 456-7890',
    email: 'contact@yourbrand.com',
    website: 'yourbrand.com',
    items: [{ id: 1, name: 'Sample Item', quantity: 2, price: 12.50 }],
    taxRate: 8,
    discount: 5,
    currency: '$'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceipt(prev => ({ ...prev, [name]: value }));
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
    alert('PDF download functionality is in development!');
  };

  const subtotal = useMemo(() => 
    receipt.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
    [receipt.items]
  );

  const taxAmount = useMemo(() => 
    subtotal * (receipt.taxRate / 100),
    [subtotal, receipt.taxRate]
  );

  const grandTotal = useMemo(() => 
    subtotal + taxAmount - receipt.discount,
    [subtotal, taxAmount, receipt.discount]
  );

  return (
    <>
      <PrintStyles />
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
                      <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} placeholder=" " />
                      <FloatingLabel>Qty</FloatingLabel>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                      <DollarSign size={18} />
                      <Input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))} placeholder=" " />
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
              <SectionTitle>Totals & Currency</SectionTitle>
            </SectionHeader>
            <ItemRow>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <Percent size={18} />
                        <Input type="number" name="taxRate" value={receipt.taxRate} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Tax Rate (%)</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Input type="number" name="discount" value={receipt.discount} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Discount</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
                <FormGroup style={{marginBottom: 0}}>
                    <InputWrapper>
                        <DollarSign size={18} />
                        <Input name="currency" value={receipt.currency} onChange={handleInputChange} placeholder=" " />
                        <FloatingLabel>Currency</FloatingLabel>
                    </InputWrapper>
                </FormGroup>
            </ItemRow>
          </FormSection>

          {/* Finalize & Export Section */}
          <FormSection>
            <SectionHeader>
              <SectionNumber>4</SectionNumber>
              <SectionTitle>Finalize & Export</SectionTitle>
            </SectionHeader>
            <ActionPanel>
                <ActionButton onClick={handlePrint}><Printer size={18}/> Print Receipt</ActionButton>
                <ActionButton className="secondary" onClick={handleDownloadPDF}><Download size={18}/> Download as PDF</ActionButton>
            </ActionPanel>
          </FormSection>

        </FormsColumn>

        <PreviewPanel>
          <ReceiptPreviewContainer id="receipt-preview">
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
                <TotalRow>
                  <span>Subtotal</span>
                  <span>{receipt.currency}{subtotal.toFixed(2)}</span>
                </TotalRow>
                <TotalRow>
                  <span>Tax ({receipt.taxRate}%)</span>
                  <span>{receipt.currency}{taxAmount.toFixed(2)}</span>
                </TotalRow>
                {receipt.discount > 0 && (
                  <TotalRow>
                    <span>Discount</span>
                    <span>-{receipt.currency}{parseFloat(receipt.discount).toFixed(2)}</span>
                  </TotalRow>
                )}
                <TotalRow className="grand-total">
                  <span>Total</span>
                  <span>{receipt.currency}{grandTotal.toFixed(2)}</span>
                </TotalRow>
              </ReceiptFooter>
            </ReceiptPreview>
          </ReceiptPreviewContainer>
        </PreviewPanel>
      </EditorWrapper>
    </>
  );
};

export default ReceiptEditor;
