import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WatchlistPage from './pages/WatchlistPage';
import PlaylistsPage from './pages/PlaylistsPage';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
            <Navbar onSearch={setSearchTerm} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <WatchlistPage />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/playlists"
                    element={
                      <ProtectedRoute>
                        <PlaylistsPage />
                      </ProtectedRoute>
                    }
                />
              </Routes>
            </main>

            <footer className="border-t border-neutral-900 bg-neutral-900/50 py-6 text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} CornHub Movies. Powered by TMDB & Laravel.
            </footer>
          </div>
        </Router>
      </AuthProvider>
  );
}