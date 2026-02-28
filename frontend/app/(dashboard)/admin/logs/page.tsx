"use client";
import React, { useState } from 'react';
import { Terminal, Search, Filter, Trash2, Download, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const MOCK_LOGS = [
    { id: 1, type: 'info', message: 'System startup sequence completed.', time: '2026-02-28 15:40:12', user: 'SYSTEM' },
    { id: 2, type: 'success', message: 'Admin login success: admin@recruitintel.com', time: '2026-02-28 15:42:05', user: 'admin@recruitintel.com' },
    { id: 3, type: 'warning', message: 'High CPU load detected on AI matching node.', time: '2026-02-28 15:43:12', user: 'MONITOR' },
    { id: 4, type: 'info', message: 'New candidate profile indexed (ID: C-112).', time: '2026-02-28 15:44:30', user: 'Gemini-AI' },
    { id: 5, type: 'error', message: 'Failed to sync with vector database: Connection timeout.', time: '2026-02-28 15:45:01', user: 'DB-SYNC' },
];

export default function LogsPage() {
    const [filter, setFilter] = useState('ALL');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold">System Audit Logs</h1>
                <p className="text-foreground/40">Real-time monitoring of infrastructure and auth events.</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass technical-border p-4 rounded-xl">
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border flex-1">
                    <Search className="w-4 h-4 text-foreground/40" />
                    <input type="text" placeholder="Search logs..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-white/5 transition-all">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-white/5 transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All</span>
                    </button>
                </div>
            </div>

            <div className="glass technical-border rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-card/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40">Timestamp</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40">Type</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40">Initiator</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {MOCK_LOGS.map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-mono text-[10px] text-foreground/40">{log.time}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {log.type === 'info' && <Info className="w-4 h-4 text-primary" />}
                                        {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                        {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${log.type === 'info' ? 'text-primary' :
                                                log.type === 'success' ? 'text-green-500' :
                                                    log.type === 'warning' ? 'text-yellow-500' : 'text-red-500'
                                            }`}>{log.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{log.user}</td>
                                <td className="px-6 py-4 text-sm text-foreground/70">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-12 text-center glass border-dashed">
                <Terminal className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                <p className="text-foreground/40 italic">End of audit trail for the last 24 hours.</p>
            </div>
        </div>
    );
}
