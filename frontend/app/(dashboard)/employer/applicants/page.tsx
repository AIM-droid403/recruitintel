"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Search, Mail, FileText, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';

export default function ApplicantsPage() {
    const { token } = useAuth();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/employer/applicants`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setApplicants(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, [token]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold">Talent Acquisition</h1>
                <p className="text-foreground/40">Monitor and evaluate candidates applying to your active vacancies.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12">
                    <div className="glass technical-border rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-card/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Candidate</th>
                                    <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Target Position</th>
                                    <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Timestamp</th>
                                    <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold">Status</th>
                                    <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground/40 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="px-6 py-20 text-center text-foreground/20 italic animate-pulse">Scanning application stream...</td></tr>
                                ) : applicants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <Users className="w-12 h-12 text-foreground/5 mx-auto mb-4" />
                                            <p className="text-foreground/40 italic font-mono uppercase text-xs">No active applications detected.</p>
                                        </td>
                                    </tr>
                                ) : applicants.map((app) => (
                                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center border border-white/5 font-bold text-primary group-hover:scale-110 transition-transform">
                                                    {app.profile_picture_url ? (
                                                        <img src={app.profile_picture_url} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        app.candidate_email[0].toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{app.candidate_email.split('@')[0]}</span>
                                                    <span className="text-[10px] font-mono text-foreground/30">{app.candidate_email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{app.job_title}</span>
                                                <span className="text-[10px] font-mono text-primary/60 uppercase">Match Probable</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-foreground/40 font-mono">
                                                <Clock className="w-3 h-3 mr-2" />
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter bg-yellow-500/10 text-yellow-500`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-bold hover:bg-primary/20 transition-all uppercase">
                                                    <FileText className="w-3 h-3" />
                                                    <span>Evaluate</span>
                                                </button>
                                                <button className="p-1.5 border border-border rounded-lg hover:bg-white/5 transition-all">
                                                    <ExternalLink className="w-3.5 h-3.5 text-foreground/40" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
