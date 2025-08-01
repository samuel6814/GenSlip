import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './Firebase';

// --- Component Imports ---
import Hero from "./Components/Hero";
import ReceiptEditor from './Components/ReceiptEditor';
import Footer from "./Components/Footer";
import TemplatePage from './Components/TemplatePage';
import LoginPage from './Components/Authentication/Login';
import SignUpPage from './Components/Authentication/SignUp';
import DashboardPage from './Components/DashboardPage';

// --- Global Styles ---
const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #e2e1de;
  }
`;

// --- Styled Components ---
const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  color: white; 
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  scroll-snap-align: start;
`;

const LoadingScreen = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 1.5rem;
    font-weight: 600;
`;

// --- Main App Component ---
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return <LoadingScreen>Loading GenSlip...</LoadingScreen>;
  }

  // --- Router Logic ---
  const renderPage = () => {
    switch (currentPath) {
      case '/login':
        // Pass navigate prop
        return <LoginPage navigate={navigate} />;
      case '/signup':
        // Pass navigate prop
        return <SignUpPage navigate={navigate} />;
      case '/templates':
        if (user) {
          // Pass navigate prop
          return <TemplatePage user={user} navigate={navigate} />;
        } else {
          navigate('/login');
          return <LoginPage navigate={navigate} />;
        }
      case '/dashboard':
        if (user) {
            // Pass navigate prop
            return <DashboardPage user={user} navigate={navigate} />;
        } else {
            navigate('/login');
            return <LoginPage navigate={navigate} />;
        }
      case '/':
      default:
        return (
          <Container>
            <Section>
              {/* Pass navigate prop to Hero */}
              <Hero user={user} navigate={navigate} />
            </Section>
            <Section>
              <ReceiptEditor user={user} />
            </Section>
            <Section>
              <Footer />
            </Section>
          </Container>
        );
    }
  };

  return (
    <>
      <GlobalStyles />
      <main>
        {renderPage()}
      </main>
    </>
  );
};

export default App;
