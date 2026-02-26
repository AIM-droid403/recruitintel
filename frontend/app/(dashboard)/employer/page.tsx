"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, BrainCircuit, Search, Users, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
    const { user, token } = useAuth();
    const [jobTitle, setJobTitle] = useState('');
    const [description, setDescription] = useState('');
    const [persona, setPersona] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [employerJobs, setEmployerJobs] = useState<any[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [matches, setMatches] = useState<any[]>([]);
    const [isMatching, setIsMatching] = useState(false);

    const stats = [
        { label: 'Active Jobs', value: employerJobs.length.toString(), icon: Briefcase, color: 'text-primary' },
        { label: 'Total Candidates', value: '1,280', icon: Users, color: 'text-accent' },
        { label: 'Neural Matches', value: matches.length.toString(), icon: BrainCircuit, color: 'text-purple-500' },
    ];

    React.useEffect(() => {
        const fetchEmployerJobs = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/jobs/employer`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) setEmployerJobs(data);
        };
        if (token) fetchEmployerJobs();
    }, [token]);

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPosting(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: jobTitle, description, personaDescription: persona }),
            });
            if (response.ok) {
                alert('Job Posted Successfully! (10 Tokens Deducted)');
                const data = await response.json();
                setEmployerJobs([data, ...employerJobs]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    };

    const handleStartMatching = async () => {
        if (!selectedJobId) return alert('Please select a job first');
        setIsMatching(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/jobs/${selectedJobId}/match`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMatches(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold">Employer Intelligence</h1>
                <p className="text-foreground/40">Manage your recruitment pipeline with neural matching.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass technical-border p-6 rounded-2xl flex items-center space-x-4">
                        <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-foreground/40 font-mono tracking-tighter uppercase">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* NEW JOB FLOW */}
                <section className="glass technical-border rounded-2xl p-8 space-y-6">
                    <div className="flex items-center space-x-3">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Neural Job Creator</h2>
                    </div>

                    <form onSubmit={handlePostJob} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Job Title (e.g. Senior AI Architect)"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-4 text-foreground outline-none focus:border-primary transition-all"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Technical Job Description"
                            rows={4}
                            className="w-full bg-secondary/50 border border-border rounded-xl p-4 text-foreground outline-none focus:border-primary transition-all resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <textarea
                            placeholder="Ideal Candidate Persona (AI Matching Logic)"
                            rows={3}
                            className="w-full bg-accent/5 border border-accent/20 rounded-xl p-4 text-foreground outline-none focus:border-accent transition-all resize-none"
                            value={persona}
                            onChange={(e) => setPersona(e.target.value)}
                        />
                        <button
                            disabled={isPosting}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                        >
                            {isPosting ? 'Deploying...' : 'Deploy Job Listing (10 Tokens)'}
                        </button>
                    </form>
                </section>

                {/* NEURAL SEARCH RESULTS */}
                <section className="glass technical-border rounded-2xl p-8 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Search className="w-6 h-6 text-accent" />
                            <h2 className="text-xl font-bold">Neural Match Radar</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <select
                            className="w-full bg-secondary/50 border border-border rounded-xl p-4 text-sm outline-none focus:border-primary transition-all"
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                            <option value="">Select Opportunity to Trace...</option>
                            {employerJobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleStartMatching}
                            disabled={isMatching || !selectedJobId}
                            className="w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                        >
                            {isMatching ? 'Calculating Synaptic Alignment...' : 'Activate Deep Match (20 Tokens)'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[400px] space-y-4 pr-2 custom-scrollbar">
                        {matches.length === 0 ? (
                            <div className="h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <Users className="w-8 h-8 text-foreground/10" />
                                <p className="text-xs text-foreground/30">Select a job and activate the neural matcher to view ranked candidates.</p>
                            </div>
                        ) : (
                            matches.map((match, i) => (
                                <div key={i} className="p-4 bg-white/5 border border-border rounded-xl space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-foreground/40">CANDIDATE_ID: {match.candidateId.slice(0, 8)}</span>
                                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full">{match.matchScore}% FIT</span>
                                    </div>
                                    <p className="text-xs text-foreground/80 leading-relaxed italic">"{match.reasoning}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* RECENT ACTIVITY TABLE */}
            <section className="glass technical-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold flex items-center">
                        <ChevronRight className="w-5 h-5 text-primary mr-1" />
                        Transaction Stream
                    </h2>
                    <Link href="/employer/billing" className="text-xs text-primary flex items-center hover:underline">
                        View Ledger <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/50 text-xs font-mono text-foreground/40 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Action Hash</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Tokens</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-foreground/60 uppercase">0x{Math.random().toString(16).slice(2, 10)}...</td>
                                    <td className="px-6 py-4 text-sm">Neural Match Execution</td>
                                    <td className="px-6 py-4 text-sm text-red-500">-20.00</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-accent/20 text-accent uppercase tracking-widest">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
