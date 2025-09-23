import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import WordEntry from './pages/WordEntry';
import ActivityPicker from './pages/ActivityPicker';
import Preview from './pages/Preview';
import ScrollToTop from './components/ScrollToTop'; // ✅ Add this line
import Footer from './components/Footer';
import Help from './pages/Help';
import Privacy from './pages/Privacy';

export default function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/preview';
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <ScrollToTop /> {/* ✅ Scroll to top on route change */}
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<WordEntry />} />
          <Route path="/activities" element={<ActivityPicker />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}
