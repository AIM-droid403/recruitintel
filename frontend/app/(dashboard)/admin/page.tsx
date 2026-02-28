"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, TrendingUp, Users, DollarSign, Activity, HardDrive, RefreshCcw } from 'lucide-react';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState({ totalJobs: 0, totalRevenue: 0, totalUsers: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/admin/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const handleToggleLockdown = async () => {
        const isCurrentlyLocked = (stats as any).isMaintenance;
        const confirmMsg = isCurrentlyLocked
            ? "Are you sure you want to RESTORE the system? This will re-enable access for all users."
            : "WARNING: You are about to LOCK DOWN the entire system. Only Admins will be able to access the platform. Continue?";

        if (!confirm(confirmMsg)) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/admin/system/lockdown`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lockdown: !isCurrentlyLocked })
            });

            if (response.ok) {
                setStats({ ...stats, isMaintenance: !isCurrentlyLocked } as any);
                alert(isCurrentlyLocked ? "System Restored" : "System Locked Down");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to toggle lockdown");
        }
    };

    const indicators = [
        { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
        { label: 'Recruitments', value: stats.totalJobs, icon: TrendingUp, color: 'text-primary' },
        { label: 'Network Size', value: stats.totalUsers, icon: Users, color: 'text-accent' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Authority</h1>
                    <p className="text-foreground/40 mt-1">Enterprise governance and infrastructure monitoring.</p>
                </div>
                <div className="flex items-center space-x-4">
                    {(stats as any).isMaintenance && (
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold animate-pulse">
                            <ShieldAlert className="w-4 h-4" />
                            <span>SYSTEM LOCKED</span>
                        </div>
                    )}
                    <button
                        onClick={handleToggleLockdown}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${(stats as any).isMaintenance
                                ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                                : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                            }`}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        <span>{(stats as any).isMaintenance ? 'RESTORE SYSTEM' : 'EMERGENCY KILL SWITCH'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {indicators.map((ind, i) => (
                    <div key={i} className="glass technical-border p-8 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl bg-white/5 ${ind.color}`}>
                                <ind.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1 rounded">+12.5%</span>
                        </div>
                        <div>
                            <p className="text-sm text-foreground/40 font-mono tracking-widest uppercase">{ind.label}</p>
                            <p className="text-3xl font-bold mt-1">{isLoading ? '...' : ind.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SYSTEM STATUS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass technical-border rounded-2xl p-6 space-y-6">
                        <h3 className="font-bold border-b border-border pb-4 flex items-center justify-between">
                            Resource Health
                            <RefreshCcw className="w-4 h-4 text-foreground/20 cursor-pointer hover:rotate-180 transition-all" />
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono uppercase">
                                    <span className="text-foreground/40">AI Model Load</span>
                                    <span className="text-accent">Optimized</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full w-[42%] bg-accent"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono uppercase">
                                    <span className="text-foreground/40">Vector DB Index</span>
                                    <span className="text-primary">92% Synced</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full w-[92%] bg-primary"></div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                                <Activity className="w-4 h-4 text-primary mb-2" />
                                <p className="text-[10px] text-foreground/40 uppercase font-mono">Uptime</p>
                                <p className="text-lg font-bold">99.98%</p>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                                <HardDrive className="w-4 h-4 text-accent mb-2" />
                                <p className="text-[10px] text-foreground/40 uppercase font-mono">Storage</p>
                                <p className="text-lg font-bold">1.4 TB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGS TERMINAL */}
                <div className="lg:col-span-8">
                    <div className="glass technical-border rounded-2xl bg-[#050506] flex flex-col h-full border border-primary/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                                <span className="text-xs font-mono text-foreground/40 ml-4 font-bold tracking-widest uppercase">System Audit Terminal</span>
                            </div>
                            <span className="text-[10px] font-mono text-primary animate-pulse">LIVE CONNECTED</span>
                        </div>
                        <div className="flex-1 p-6 font-mono text-xs text-foreground/60 space-y-2 overflow-y-auto max-h-[400px]">
                            <p className="text-accent">[SYS] 2026-02-25 08:45:12 - Neural matching service online.</p>
                            <p>[AUTH] 2026-02-25 08:46:01 - User 8x12... login success.</p>
                            <p className="text-primary">[TX] 2026-02-25 08:47:33 - Payment gateway "Stripe" initialized.</p>
                            <p className="text-yellow-500/80">[WARN] 2026-02-25 08:48:01 - High token consumption detected in sector-7.</p>
                            <p>[SYS] 2026-02-25 08:49:15 - New job index generated (ID: J-992).</p>
                            <p className="text-foreground/30 mt-4">_ Awaiting next system action...</p>
                        </div>
                        <div className="p-2 bg-card/30 border-t border-border flex items-center px-4">
                            <span className="text-primary mr-2 italic">$</span>
                            <input type="text" className="bg-transparent border-none outline-none flex-1 text-xs text-foreground/50 py-2" placeholder="Enter administrative command..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
