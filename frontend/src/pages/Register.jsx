import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password, passwordConfirmation);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <UserPlus className="w-6 h-6 text-amber-500" /> Create Account
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">Join to bookmark movies and series and build custom playlists</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-xs text-neutral-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}