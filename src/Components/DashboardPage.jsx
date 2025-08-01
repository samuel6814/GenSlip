import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FileText, Calendar, Trash2, Eye, Plus, Home, X, Edit, Save } from 'lucide-react';
import { db } from '../Firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import ReceiptEditor from './ReceiptEditor'; // Import the editor

// --- STYLED COMPONENTS (some are repeated for context, assume they exist) ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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

const DashboardWrapper = styled.div`
  padding: 2rem 1rem;
  min-height: 100vh;
  background-color: #e2e1de;
  font-family: 'Inter', sans-serif;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const DashboardContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 1rem;
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
  text-decoration: none;
  font-family: inherit;

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
  
  &.danger {
    background-color: #c0392b;
    border-color: #c0392b;
    color: #fff;
    &:hover {
      background-color: #e74c3c;
      border-color: #e74c3c;
    }
  }
`;

const ReceiptList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const ReceiptCard = styled.div`
  background-color: #f5f4f2;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.1);
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ReceiptInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
`;

const ReceiptIcon = styled.div`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: #e9e8e5;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReceiptDetails = styled.div`
  min-width: 0;
  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1c1c1c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ReceiptTotal = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1c1c;
  text-align: right;
  flex-shrink: 0;
`;

const ReceiptActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

const ActionIcon = styled.button`
  background: #e9e8e5;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: all 0.3s ease;

  &:hover {
    background-color: #7c3aed;
    color: #fff;
  }

  &.delete:hover {
    background-color: #e53e3e;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f5f4f2;
  border-radius: 16px;
  border: 2px dashed #d1d0cd;
  
  h2 {
    font-size: 1.5rem;
    color: #1c1c1c;
    margin-bottom: 1rem;
  }
  
  p {
    color: #555;
    margin-bottom: 2rem;
  }
`;

const LoadingState = styled(EmptyState)``;

// --- MODAL COMPONENTS ---
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
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    animation: ${slideDown} 0.3s ease-out;

    h3 {
        margin-top: 0;
        font-size: 1.5rem;
        color: #1c1c1c;
    }

    p {
        color: #555;
        margin-bottom: 2rem;
    }
`;

const ModalActionPanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

// --- The Dashboard Page Component ---
const DashboardPage = ({ user, navigate }) => {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'view', 'edit'

  const fetchReceipts = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
      const q = query(receiptsCollectionRef, orderBy('savedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const userReceipts = querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setReceipts(userReceipts);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [user]);

  const openDeleteModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsDeleteModalOpen(true);
  };

  const openViewEditModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsViewEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!user || !selectedReceipt) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid, 'receipts', selectedReceipt.firestoreId));
        setReceipts(prev => prev.filter(r => r.id !== selectedReceipt.id));
    } catch (error) {
        console.error("Error deleting receipt: ", error);
    } finally {
        setIsDeleteModalOpen(false);
        setSelectedReceipt(null);
    }
  };

  const handleSetViewMode = (mode, receipt) => {
    setSelectedReceipt(receipt);
    setViewMode(mode);
    setIsViewEditModalOpen(false);
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedReceipt(null);
    fetchReceipts(); // Refetch to see any updates
  };
  
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    // Handle cases where timestamp might be a JS Date object already
    if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
    }
    return 'Date not available';
  };

  if (isLoading) {
    return (
      <DashboardWrapper>
        <LoadingState>
          <h2>Loading Your Receipts...</h2>
        </LoadingState>
      </DashboardWrapper>
    );
  }

  // --- RENDER LOGIC ---

  if (viewMode === 'view' || viewMode === 'edit') {
    return (
        <ReceiptEditor 
            user={user} 
            existingReceipt={selectedReceipt}
            isReadOnly={viewMode === 'view'}
            onBack={handleBackToDashboard}
        />
    );
  }

  return (
    <>
      <DashboardWrapper>
        <DashboardContent>
          <DashboardHeader>
            <Title>My Receipts</Title>
            <HeaderActions>
              <ActionButton onClick={() => navigate('/')} className="secondary">
                  <Home size={18}/> Home
              </ActionButton>
              <ActionButton onClick={() => navigate('/templates')}>
                  <Plus size={18}/> Create New Receipt
              </ActionButton>
            </HeaderActions>
          </DashboardHeader>

          {receipts.length > 0 ? (
            <ReceiptList>
              {receipts.map(receipt => (
                <ReceiptCard key={receipt.id}>
                  <ReceiptInfo>
                    <ReceiptIcon><FileText size={24}/></ReceiptIcon>
                    <ReceiptDetails>
                      <h3>{receipt.brandName}</h3>
                      <p>
                        <Calendar size={14} /> 
                        {formatTimestamp(receipt.savedAt)}
                      </p>
                    </ReceiptDetails>
                  </ReceiptInfo>
                  <ReceiptActions>
                      <ReceiptTotal>
                          {receipt.currency}
                          {(receipt.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (1 + (receipt.taxRate / 100) + (receipt.vatRate / 100)) - receipt.discount).toFixed(2)}
                      </ReceiptTotal>
                      <ActionIcon onClick={() => openViewEditModal(receipt)}><Eye size={20} /></ActionIcon>
                      <ActionIcon className="delete" onClick={() => openDeleteModal(receipt)}><Trash2 size={20} /></ActionIcon>
                  </ReceiptActions>
                </ReceiptCard>
              ))}
            </ReceiptList>
          ) : (
            <EmptyState>
              <h2>No Receipts Found</h2>
              <p>You haven't saved any receipts yet. Get started by creating a new one!</p>
              <ActionButton onClick={() => navigate('/templates')}>
                <Plus size={18}/> Create Your First Receipt
              </ActionButton>
            </EmptyState>
          )}
        </DashboardContent>
      </DashboardWrapper>

      {/* --- MODALS --- */}
      {isDeleteModalOpen && (
        <ModalOverlay>
            <ModalContent>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete the receipt for "{selectedReceipt?.brandName}"? This action cannot be undone.</p>
                <ModalActionPanel>
                    <ActionButton onClick={() => setIsDeleteModalOpen(false)} className="secondary">
                        Cancel
                    </ActionButton>
                    <ActionButton onClick={handleDelete} className="danger">
                        <Trash2 size={18} /> Yes, Delete
                    </ActionButton>
                </ModalActionPanel>
            </ModalContent>
        </ModalOverlay>
      )}

      {isViewEditModalOpen && (
        <ModalOverlay>
            <ModalContent>
                <h3>Receipt Options</h3>
                <p>What would you like to do with the receipt for "{selectedReceipt?.brandName}"?</p>
                <ModalActionPanel>
                    <ActionButton onClick={() => handleSetViewMode('view', selectedReceipt)}>
                        <Eye size={18} /> View
                    </ActionButton>
                    <ActionButton onClick={() => handleSetViewMode('edit', selectedReceipt)}>
                        <Edit size={18}/> Edit
                    </ActionButton>
                    <ActionButton onClick={() => setIsViewEditModalOpen(false)} className="secondary">
                        Go Back
                    </ActionButton>
                </ModalActionPanel>
            </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default DashboardPage;
