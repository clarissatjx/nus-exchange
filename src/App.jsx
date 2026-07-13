import { Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { StarredProvider } from './hooks/StarredContext.jsx';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Saved from './pages/Saved.jsx';
import Detail from './pages/Detail.jsx';

export default function App() {
  return (
    <StarredProvider>
      <div className="flex min-h-screen flex-col bg-bg text-ink">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/universities" element={<Browse />} />
          <Route path="/mappings" element={<Saved />} />
          <Route path="/mappings/:idx" element={<Detail />} />
        </Routes>
      </div>
      <Analytics />
    </StarredProvider>
  );
}
