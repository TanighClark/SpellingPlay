import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import WordEntry from './pages/WordEntry';
import ActivityPicker from './pages/ActivityPicker';
import Preview from './pages/Preview';
import ScrollToTop from './components/ScrollToTop'; // ✅ Add this line
import Footer from './components/Footer';
import Help from './pages/Help';

export default function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ Scroll to top on route change */}
      <Navbar />
      <Routes>
        <Route path="/" element={<WordEntry />} />
        <Route path="/activities" element={<ActivityPicker />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/help" element={<Help />} />
      </Routes>
      <Footer />
    </>
  );
}
