import styled from "styled-components";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";


const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  /* scroll-behavior: smooth; */
  /* overflow-x: auto; */
  scrollbar-width: none;
  color: white;
  /* background: url("./img/bg.jpeg"); */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  scroll-snap-align: start; /* Ensures the section aligns on scroll */
`;

const App = () => {
  return (
    <Container>
      
  <Section>
    <Hero/>
  </Section>

  <Section>
    <Footer/>
  </Section>


    </Container>
  );
};

export default App;
    