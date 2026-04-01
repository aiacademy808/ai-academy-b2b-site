import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Problems from '@/components/sections/Problems';
import Products from '@/components/sections/Products';
import Cases from '@/components/sections/Cases';
import Pricing from '@/components/sections/Pricing';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/sections/FloatingWhatsApp';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Problems />
      <Products />
      <Cases />
      <Pricing />
      <ContactForm />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
