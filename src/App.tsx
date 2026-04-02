import { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import ServiceRequest from './components/ServiceRequest';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [isServiceRequestOpen, setIsServiceRequestOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation onRequestService={() => setIsServiceRequestOpen(true)} />
      <main>
        <Hero onRequestService={() => setIsServiceRequestOpen(true)} />
        <About />
        <Services />
        <WhyChooseUs onRequestService={() => setIsServiceRequestOpen(true)} />
        <Contact />
      </main>
      <Footer />
      <ServiceRequest
        isOpen={isServiceRequestOpen}
        onClose={() => setIsServiceRequestOpen(false)}
      />
    </div>
  );
}

export default App;
