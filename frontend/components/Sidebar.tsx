import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Briefcase, CreditCard, Settings, LogOut, Terminal } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = {
        ADMIN: [
            { icon: LayoutDashboard, label: 'Analytics', href: '/admin' },
            { icon: Users, label: 'User Management', href: '/admin/users' },
            { icon: Terminal, label: 'System Logs', href: '/admin/logs' },
        ],
        EMPLOYER: [
            { icon: LayoutDashboard, label: 'Overview', href: '/employer' },
            { icon: Users, label: 'Applicants', href: '/employer/applicants' },
            { icon: Briefcase, label: 'Post Job', href: '/employer/post' },
            { icon: CreditCard, label: 'Billing', href: '/employer/billing' },
        ],
        CANDIDATE: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/candidate' },
            { icon: Briefcase, label: 'Job Feed', href: '/candidate/jobs' },
            { icon: CreditCard, label: 'Tokens', href: '/candidate/tokens' },
        ]
    };

    const currentMenu = user ? menuItems[user.role] : [];

    return (
        <div className="w-64 h-screen bg-card technical-border flex flex-col p-4">
            <div className="text-2xl font-bold text-primary mb-8 px-4 flex items-center">
                <span className="mr-2">RI</span>
                <span className="text-sm font-light text-foreground/50 tracking-widest">RECRUIT INTEL</span>
            </div>

            <nav className="flex-1 space-y-2">
                {currentMenu.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <item.icon className="w-5 h-5 text-foreground/40 group-hover:text-primary" />
                        <span className="text-foreground/70 group-hover:text-foreground">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto border-t border-border pt-4 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                    <Settings className="w-5 h-5 text-foreground/40 group-hover:text-primary" />
                    <span className="text-foreground/70 group-hover:text-foreground">Settings</span>
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors group w-full text-left"
                >
                    <LogOut className="w-5 h-5 text-red-500/50 group-hover:text-red-500" />
                    <span className="text-foreground/70 group-hover:text-red-500">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
