import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Popcorn    , Search, Bookmark, List, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ onSearch }) {
    const { user, logout, isAuthenticated } = useAuth();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
        navigate(`/?query=${encodeURIComponent(query)}`);
    };

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-amber-500 hover:text-amber-400">
                    <Popcorn className="w-6 h-6" />
                    <span>Corn<span className="text-white">Hub</span></span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search movies or series..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-neutral-800 text-sm text-white placeholder-neutral-400 pl-10 pr-4 py-2 rounded-full border border-neutral-700 focus:outline-none focus:border-amber-500"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
                </form>

                {/* Links & Auth State */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/" className="hover:text-amber-400 transition-colors hidden sm:inline">
                        Discover
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/watchlist" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                                <Bookmark className="w-4 h-4" />
                                <span className="hidden sm:inline">Watchlist</span>
                            </Link>

                            <Link to="/playlists" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                                <List className="w-4 h-4" />
                                <span className="hidden sm:inline">Playlists</span>
                            </Link>

                            <div className="flex items-center gap-3 pl-3 border-l border-neutral-700">
                <span className="text-neutral-300 font-semibold text-xs hidden md:inline">
                  {user?.name}
                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition-colors text-xs"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="flex items-center gap-1 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg text-xs"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Log In</span>
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-3 py-1.5 rounded-lg transition-colors text-xs"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}