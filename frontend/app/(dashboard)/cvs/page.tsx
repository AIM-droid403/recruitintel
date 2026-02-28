"use client";
import React from 'react';
import { Users, Search, Mail, FileText, ShieldCheck, ExternalLink } from 'lucide-react';

const MOCK_CANDIDATES = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Fullstack Dev', matchRate: '98%', status: 'Verified' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'UI/UX Designer', matchRate: '92%', status: 'Pending' },
    { id: 3, name: 'Robert Brown', email: 'robert@example.com', role: 'Backend Engineer', matchRate: '85%', status: 'Verified' },
];

export default function CVPoolPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredCandidates = MOCK_CANDIDATES.filter(can =>
        can.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        can.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        can.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Talent CV Pool</h1>
                    <p className="text-foreground/40">Global repository of AI-indexed professional profiles for recruitment matching.</p>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg px-4 py-2 border border-border focus-within:border-primary/50 transition-all">
                    <Search className="w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search talents..."
                        className="bg-transparent border-none outline-none text-sm w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((can) => (
                    <div key={can.id} className="glass technical-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-sm font-bold">
                                {can.name[0]}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest">Match Rate</span>
                                <span className="text-xl font-bold">{can.matchRate}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{can.name}</h3>
                            <p className="text-sm text-foreground/60">{can.role}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-xs text-foreground/40 font-mono">
                                <Mail className="w-3 h-3 mr-2" />
                                {can.email}
                            </div>
                            <div className="flex items-center text-xs text-foreground/40 font-mono">
                                <ShieldCheck className="w-3 h-3 mr-2 text-green-500" />
                                {can.status}
                            </div>
                        </div>
                        <div className="pt-4 flex items-center space-x-3 border-t border-border">
                            <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-secondary/50 rounded-lg text-xs font-bold hover:bg-white/5 transition-all">
                                <FileText className="w-3.5 h-3.5" />
                                <span>AI Review</span>
                            </button>
                            <button className="p-2 border border-border rounded-lg hover:bg-white/5 transition-all">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <div className="py-20 text-center glass border-dashed">
                    <Users className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                    <p className="text-foreground/40 italic">No candidates found matching "{searchQuery}".</p>
                </div>
            )}
        </div>
    );
}
