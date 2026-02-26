"use client";
import React, { useState } from 'react';
import { Shield, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setMessage(data.message);
            setSubmitted(true);

            // In this demo, we can log the token for ease of use
            if (data.token) {
                console.log(`Reset Token: ${data.token}`);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Recover Key</h1>
                    <p className="text-slate-500 mt-3 font-medium">Verify your identity to regenerate access</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-10 relative">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-3" />
                                    {error}
                                </div>
                            )}

                            <div className="group">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Enterprise Mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-slate-900 font-medium focus:border-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-[1.25rem] flex items-center justify-center space-x-3 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Request Reset Signal</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Mail className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Check Your Inbox</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {message}
                            </p>
                            <div className="pt-4">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Demo Notice</p>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono text-slate-500 text-left overflow-hidden">
                                    Reset token logged to system console.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <Link href="/login" className="text-slate-500 font-bold hover:text-primary transition-colors inline-flex items-center">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
