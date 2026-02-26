"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Zap, History, ArrowUpRight, TrendingUp, ShieldCheck, Wallet, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
    const { user } = useAuth();
    const balance = user?.tokens || 0;

    const tiers = [
        { name: 'Starter', tokens: '100', price: '$29', description: 'Perfect for small teams and startups.', primary: false },
        { name: 'Professional', tokens: '500', price: '$99', description: 'Advanced neural matching for growing firms.', primary: true },
        { name: 'Enterprise', tokens: '2000', price: '$299', description: 'Full-scale talent intelligence for agencies.', primary: false },
    ];

    const transactions = [
        { id: 'TX-9021', date: 'Feb 24, 2026', type: 'Neural Match', amount: '-20', status: 'Completed' },
        { id: 'TX-8842', date: 'Feb 22, 2026', type: 'Token Purchase', amount: '+500', status: 'Completed' },
        { id: 'TX-8711', date: 'Feb 21, 2026', type: 'CV Ingestion', amount: '-5', status: 'Completed' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header section with current balance */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                <div className="animate-in fade-in slide-in-from-left duration-700">
                    <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                        <Wallet className="w-4 h-4" />
                        <span>Financial Core</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Tokens</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your neural credits and subscription tiers.</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:min-w-[300px] flex items-center space-x-6 relative overflow-hidden group hover:border-primary/30 transition-all animate-in fade-in zoom-in duration-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available Credits</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tightest">{balance.toLocaleString()}</p>
                    </div>
                </div>
            </header>

            {/* Token Tiers */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900">Reload Capacity</h2>
                    <div className="flex items-center space-x-2 text-primary text-sm font-bold">
                        <span>Secure Checkout</span>
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`p-8 rounded-[2.5rem] border-2 transition-all hover:-translate-y-1 ${tier.primary ? 'border-primary bg-white shadow-2xl shadow-primary/10 ring-1 ring-primary/20' : 'border-slate-100 bg-white hover:border-slate-200 shadow-xl shadow-slate-200/30'}`}>
                            {tier.primary && (
                                <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full absolute -top-4 left-1/2 -translate-x-1/2 shadow-lg shadow-primary/30">
                                    Most Recommended
                                </span>
                            )}
                            <h3 className="text-xl font-black text-slate-900 mb-2">{tier.name}</h3>
                            <p className="text-slate-400 font-medium text-sm h-12">{tier.description}</p>

                            <div className="my-8 flex items-baseline">
                                <span className="text-5xl font-black text-slate-900 tracking-tightest">{tier.price}</span>
                                <span className="ml-2 text-slate-400 font-bold uppercase tracking-widest text-xs">/ {tier.tokens} tokens</span>
                            </div>

                            <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center group ${tier.primary ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'}`}>
                                Purchase Pack <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Transaction Ledger */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900">Activity Ledger</h2>
                    <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center">
                        Download PDF <History className="ml-2 w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Applied</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Credit Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-sm text-slate-600 font-medium group-hover:text-primary transition-colors">{tx.id}</span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 font-medium text-sm">{tx.date}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-slate-900 font-bold text-sm">
                                                {tx.type}
                                                <ArrowUpRight className="ml-2 w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </td>
                                        <td className={`px-8 py-6 text-sm font-black text-right ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-slate-900'}`}>
                                            {tx.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .tracking-tightest {
                    letter-spacing: -0.06em;
                }
            `}</style>
        </div>
    );
}
