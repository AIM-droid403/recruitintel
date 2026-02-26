"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Missing reset token. Please request a new link.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 8) {
            return setError('Password must be at least 8 characters long');
        }

        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Reset failed. Token may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Key Regenerated</h2>
                <p className="text-slate-500 font-medium">
                    Your security key has been updated. Redirecting to authorization...
                </p>
                <div className="pt-4">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-green-500 animate-progress origin-left"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-3" />
                    {error}
                </div>
            )}

            <div className="space-y-5">
                <div className="group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">New Security Key</label>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-slate-900 font-medium focus:border-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
                <div className="group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Confirm Key</label>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-slate-900 font-medium focus:border-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            <button
                disabled={loading || !token}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-[1.25rem] flex items-center justify-center space-x-3 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 group"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        <span>Update Security Key</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2 group mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RecruitIntel</span>
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Regen Key</h1>
                    <p className="text-slate-500 mt-3 font-medium">Initialize new high-entropy security credentials</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-10 relative">
                    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <Link href="/login" className="text-slate-500 font-bold hover:text-primary transition-colors text-sm">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
