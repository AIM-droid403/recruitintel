"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, ShieldCheck, ShieldAlert, Search, Filter, Ban, CheckCircle2, MoreVertical, History, CreditCard, MessageSquare } from 'lucide-react';
import { LogsModal, TransactionsModal, MessageModal } from './Modals';

export default function UserManagementPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modal & Menu State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [modalState, setModalState] = useState({
        logs: false,
        billings: false,
        message: false
    });

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();

        // Close menu on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [token]);

    const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });

            if (response.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u));
                setActiveMenu(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (user: any, type: 'logs' | 'billings' | 'message') => {
        setSelectedUser(user);
        setModalState({ ...modalState, [type]: true });
        setActiveMenu(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold">User Governance</h1>
                <p className="text-foreground/40">Manage identity permissions and account lifecycle status.</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass technical-border p-4 rounded-xl">
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border flex-1">
                    <Search className="w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Filter by email or role..."
                        className="bg-transparent border-none outline-none text-sm w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-white/5 transition-all text-foreground/60">
                        <Filter className="w-4 h-4" />
                        <span>Filter Status</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm hover:bg-primary/20 transition-all font-bold">
                        <span>+ EXPORT REGISTRY</span>
                    </button>
                </div>
            </div>

            <div className="glass technical-border rounded-2xl overflow-visible shadow-2xl shadow-black/50">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-card/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Account Index</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Classification</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Status</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-foreground/20 italic animate-pulse">Initializing data stream...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-foreground/20 italic">No matches found in the registry.</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-tight">{user.email}</span>
                                        <span className="text-[10px] font-mono text-foreground/30 uppercase">ID: {user.id.substring(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                                        user.role === 'EMPLOYER' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {user.is_blocked ? (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span className="text-xs text-red-500 font-bold uppercase">Blocked</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-xs text-green-500 font-bold uppercase">Active</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right relative overflow-visible">
                                    <div className="flex items-center justify-end space-x-2">
                                        <div className="relative" ref={activeMenu === user.id ? menuRef : null}>
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                                className={`p-2 rounded-lg transition-all ${activeMenu === user.id ? 'bg-white/10 text-foreground' : 'bg-secondary/50 text-foreground/40 hover:bg-white/5'}`}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeMenu === user.id && (
                                                <div className="absolute right-0 mt-2 w-56 glass technical-border rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                                        <span className="text-[10px] font-mono font-bold text-foreground/30 uppercase">Governance Actions</span>
                                                    </div>

                                                    <button onClick={() => openModal(user, 'logs')} className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-white/5 transition-colors text-foreground/60 hover:text-primary">
                                                        <History className="w-4 h-4" />
                                                        <span>VIEW LOGS</span>
                                                    </button>

                                                    <button onClick={() => openModal(user, 'billings')} className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-white/5 transition-colors text-foreground/60 hover:text-accent">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>VIEW BILLINGS</span>
                                                    </button>

                                                    <button onClick={() => openModal(user, 'message')} className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold hover:bg-white/5 transition-colors text-foreground/60 hover:text-blue-500">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span>SEND MESSAGE</span>
                                                    </button>

                                                    <div className="my-1 border-t border-white/5"></div>

                                                    <button
                                                        onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                                                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold transition-colors ${user.is_blocked ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'
                                                            }`}
                                                    >
                                                        {user.is_blocked ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                        <span>{user.is_blocked ? 'UNBLOCK ACCOUNT' : 'BLOCK ACCOUNT'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <LogsModal
                isOpen={modalState.logs}
                onClose={() => setModalState({ ...modalState, logs: false })}
                user={selectedUser}
                token={token}
            />
            <TransactionsModal
                isOpen={modalState.billings}
                onClose={() => setModalState({ ...modalState, billings: false })}
                user={selectedUser}
                token={token}
            />
            <MessageModal
                isOpen={modalState.message}
                onClose={() => setModalState({ ...modalState, message: false })}
                user={selectedUser}
                token={token}
            />
        </div>
    );
}
