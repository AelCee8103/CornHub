import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Popcorn, Search, Bookmark, List, LogOut, LogIn, UserPlus, X } from 'lucide-react';
import { useToast } from '../lib/toast';
import { logError, userFacingError } from '../lib/errors';

export default function Navbar({ onSearch }) {
    const { user, logout, isAuthenticated } = useAuth();
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { notify } = useToast();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
        navigate(`/?query=${encodeURIComponent(query)}`);
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            notify({ type: 'success', message: 'You have been logged out.', key: 'logout-success' });
            setMenuOpen(false);
        } catch (err) {
            logError('Logout failed', err);
            notify({ type: 'error', message: userFacingError(err, 'Unable to log out. Please try again.'), key: 'logout-error' });
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-amber-500 hover:text-amber-400">
                    <Popcorn className="w-6 h-6" />
                    <span>Corn<span className="text-white">Hub</span></span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className={`${menuOpen ? 'hidden' : 'flex'} sm:flex flex-1 max-w-md relative`}>
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
                <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
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
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition-colors text-xs"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
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
                <button
                    type="button"
                    className="sm:hidden rounded-lg p-2 text-neutral-200 hover:bg-neutral-800"
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>
            {menuOpen && (
                <div className="border-t border-neutral-800 px-4 py-3 sm:hidden">
                    <form onSubmit={handleSearchSubmit} className="relative mb-3">
                        <input
                            type="search"
                            aria-label="Search movies or series"
                            placeholder="Search movies or series..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-full border border-neutral-700 bg-neutral-800 py-2 pl-10 pr-4 text-sm text-white"
                        />
                        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
                    </form>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-neutral-800">Discover</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/watchlist" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-neutral-800">Watchlist</Link>
                                <Link to="/playlists" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-neutral-800">Playlists</Link>
                                <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-lg px-3 py-2 text-left hover:bg-neutral-800 disabled:opacity-50">
                                    {loggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-neutral-800">Log In</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-lg bg-amber-500 px-3 py-2 font-semibold text-black">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}