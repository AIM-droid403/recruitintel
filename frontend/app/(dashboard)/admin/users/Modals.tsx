"use client";
import React, { useState, useEffect } from 'react';
import { X, History, CreditCard, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    token: string | null;
}

export const LogsModal = ({ isOpen, onClose, user, token }: ModalProps) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            const fetchLogs = async () => {
                setIsLoading(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                    const response = await fetch(`${apiUrl}/api/admin/users/${user.id}/logs`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setLogs(data);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLogs();
        }
    }, [isOpen, user, token]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass technical-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center space-x-3 text-primary">
                        <History className="w-5 h-5" />
                        <h2 className="text-xl font-bold tracking-tight">System Audit: {user.email}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="py-10 text-center text-foreground/20 italic animate-pulse">Syncing log streams...</div>
                    ) : logs.length === 0 ? (
                        <div className="py-10 text-center text-foreground/20 italic">No activity registered for this account.</div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log: any) => (
                                <div key={log.id} className="p-4 bg-secondary/30 border border-border rounded-xl flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">{log.action}</span>
                                        <span className="text-sm text-foreground/60 mt-1">{JSON.stringify(log.details)}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-foreground/30">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const TransactionsModal = ({ isOpen, onClose, user, token }: ModalProps) => {
    const [txs, setTxs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            const fetchTxs = async () => {
                setIsLoading(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                    const response = await fetch(`${apiUrl}/api/admin/users/${user.id}/transactions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setTxs(data);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTxs();
        }
    }, [isOpen, user, token]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass technical-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center space-x-3 text-accent">
                        <CreditCard className="w-5 h-5" />
                        <h2 className="text-xl font-bold tracking-tight">Ledger Analysis: {user.email}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="py-10 text-center text-foreground/20 italic animate-pulse">Scanning financial vault...</div>
                    ) : txs.length === 0 ? (
                        <div className="py-10 text-center text-foreground/20 italic">No transactions found for this account.</div>
                    ) : (
                        <div className="space-y-3">
                            {txs.map((tx: any) => (
                                <div key={tx.id} className="p-4 bg-secondary/30 border border-border rounded-xl flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{tx.tokens_added} <span className="text-[10px] text-foreground/40 font-mono">TOKENS</span></span>
                                        <span className="text-[10px] font-mono font-bold text-foreground/30 uppercase">{tx.gateway} | {tx.currency} {tx.amount}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' :
                                                tx.status === 'FAILED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {tx.status}
                                        </span>
                                        <span className="text-[10px] font-mono text-foreground/20 mt-1">{new Date(tx.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MessageModal = ({ isOpen, onClose, user, token }: ModalProps) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [notif, setNotif] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setNotif(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/admin/users/${user.id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subject, content })
            });

            if (response.ok) {
                setNotif({ type: 'success', message: 'Message dispatched successfully!' });
                setTimeout(() => {
                    onClose();
                    setSubject('');
                    setContent('');
                    setNotif(null);
                }, 2000);
            } else {
                setNotif({ type: 'error', message: 'Failed to transmit message.' });
            }
        } catch (err) {
            setNotif({ type: 'error', message: 'Network encryption error.' });
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass technical-border w-full max-w-lg rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center space-x-3 text-primary">
                        <Send className="w-5 h-5" />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold tracking-tight">Broadcast Interface</h2>
                            <span className="text-[10px] font-mono text-foreground/40 uppercase">Target: {user.email}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSend} className="p-6 space-y-4">
                    {notif && (
                        <div className={`p-4 rounded-xl border flex items-center space-x-3 animate-in fade-in ${notif.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                            {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span className="text-xs font-bold uppercase tracking-tight">{notif.message}</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-foreground/40 uppercase font-bold ml-1">Transmission Subject</label>
                        <input
                            type="text"
                            required
                            placeholder="System Notification / Account Warning"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-bold tracking-tight"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-foreground/40 uppercase font-bold ml-1">Neural Payload (Content)</label>
                        <textarea
                            required
                            placeholder="Specify administrative instructions or warnings..."
                            rows={5}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none font-medium text-foreground/70"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full py-4 bg-primary text-secondary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {isSending ? 'Transmitting...' : 'Initialize Dispatch'}
                    </button>
                </form>
            </div>
        </div>
    );
};
