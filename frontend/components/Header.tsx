import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, ShieldCheck, Activity } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-card/50 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xs text-foreground/40 font-mono">
                    <Activity className="w-3 h-3 text-accent status-pulse" />
                    <span>AI LATENCY: 24ms</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-foreground/40 font-mono border-l border-border pl-6">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <span>DB HEALTH: 99.9%</span>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {user && (
                    <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 flex items-center space-x-2">
                        <span className="text-xs font-bold text-primary">TOKENS:</span>
                        <span className="text-sm font-mono text-foreground">{user.tokens}</span>
                    </div>
                )}
                <button className="relative p-2 text-foreground/60 hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-card"></span>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-sm font-bold border border-white/10">
                    {user?.email[0].toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default Header;
