"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, UserCircle, Loader2, ArrowRight, User, Briefcase, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CANDIDATE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');

            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2 group mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RecruitIntel</span>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tightest">Create Identity</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Join the next evolution of human hiring</p>
                </div>

                <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-10 relative">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-3" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-2 block">Registration Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@future.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-slate-900 font-medium focus:border-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-2 block">Security Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Secure Passphrase"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-slate-900 font-medium focus:border-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-2 block">Choose Your Path</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('CANDIDATE')}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${role === 'CANDIDATE' ? 'border-primary bg-primary/5 text-primary shadow-inner shadow-primary/10' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="text-xs font-black uppercase tracking-widest">Candidate</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('EMPLOYER')}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${role === 'EMPLOYER' ? 'border-accent bg-accent/5 text-accent shadow-inner shadow-accent/10' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <Briefcase className="w-6 h-6" />
                                        <span className="text-xs font-black uppercase tracking-widest">Employer</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-5 rounded-[1.25rem] flex items-center justify-center space-x-3 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 group mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Establish Identity</span>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Already established?{' '}
                            <Link href="/login" className="text-primary font-bold hover:underline inline-flex items-center">
                                Authorize Identity <ArrowRight className="ml-1 w-4 h-4 outline-none" />
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex justify-center space-x-6 opacity-30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>Precision Matching Platform</span>
                </div>
            </div>
        </div>
    );
}
