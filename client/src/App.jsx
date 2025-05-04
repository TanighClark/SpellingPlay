import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import WordEntry from './pages/WordEntry';

import ActivityPicker from './pages/ActivityPicker';
import Preview from './pages/Preview';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<WordEntry />} />
        <Route path="/activities" element={<ActivityPicker />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </>
  );
}
