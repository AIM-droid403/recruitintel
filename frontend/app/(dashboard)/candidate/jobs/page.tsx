"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, MapPin, DollarSign, BrainCircuit, Sparkles, Filter, ChevronRight, Briefcase, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function CandidateJobsPage() {
    const { token } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/jobs/matches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setJobs(data);
                }
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchJobs();
    }, [token]);

    const handleApply = async (jobId: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert("Application Sent! Your neural profile has been transmitted to the employer.");
            } else {
                const data = await response.json();
                alert(data.message || "Application failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error. The magic failed.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header & Search */}
            <header className="space-y-6 pt-4 animate-in fade-in slide-in-from-top duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Neural Discovery</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Opportunity Radar</h1>
                        <p className="text-slate-500 font-medium mt-1">High-dimensional matching across global talent pools.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-2 text-slate-500 text-sm font-bold cursor-pointer hover:border-primary transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Advanced Filters</span>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search roles, technologies, or company personas..."
                        className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 text-slate-900 font-medium focus:border-primary/30 focus:shadow-2xl focus:shadow-primary/5 outline-none transition-all placeholder:text-slate-300 shadow-xl shadow-slate-200/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-2 right-2 px-6 bg-slate-900 text-white rounded-full flex items-center font-bold text-sm cursor-pointer hover:bg-slate-800 transition-colors">
                        Scan Engine
                    </div>
                </div>
            </header>

            {/* Jobs List */}
            <section className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating Vectors...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="py-20 bg-white border border-slate-200 rounded-[3rem] text-center border-dashed">
                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No active signals found</h3>
                        <p className="text-slate-400 font-medium">Try broadening your search or updating your AI profile.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all hover:scale-[1.01] cursor-pointer flex flex-col md:flex-row gap-8 relative overflow-hidden">
                            {/* Match Score Badge */}
                            <div className="absolute top-0 right-0 py-3 px-6 bg-slate-900 text-white rounded-bl-[1.5rem] flex items-center space-x-2">
                                <BrainCircuit className="w-4 h-4 text-primary" />
                                <span className="font-mono text-xs font-bold uppercase tracking-widest">{job.matchScore || 0}% Match</span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                        <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">{job.company || 'RECRUITINTEL PARTNER'}</p>
                                    </div>
                                </div>

                                <p className="text-slate-500 line-clamp-2 font-medium leading-relaxed">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    {(job.tags || ['Remote', 'Full-time']).map((tag: string, i: number) => (
                                        <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-2 transition-colors group-hover:bg-white group-hover:border-slate-200">
                                            {tag === 'Remote' ? <MapPin className="w-4 h-4 text-slate-400" /> : <Briefcase className="w-4 h-4 text-slate-400" />}
                                            <span className="text-xs font-bold text-slate-600">{tag}</span>
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-primary fill-primary/20" />
                                        <span className="text-xs font-black text-primary uppercase tracking-widest">High Potential</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-64 flex flex-col justify-center space-y-3">
                                <button
                                    onClick={() => handleApply(job.id)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center group/btn"
                                >
                                    Magic Apply <Zap className="ml-2 w-4 h-4 text-yellow-500 fill-yellow-500 group-hover/btn:scale-125 transition-transform" />
                                </button>
                                <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center">
                                    View Details <ChevronRight className="ml-1 w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Footer Engagement */}
            <div className="bg-gradient-to-br from-primary to-accent p-12 rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mt-16" />
                <h2 className="text-3xl font-black mb-4">Can't find the perfect signal?</h2>
                <p className="text-white/70 font-medium mb-8 max-w-xl mx-auto">Update your Neural Profile to attract headhunters looking for your specific behavioral archetype.</p>
                <Link href="/candidate" className="px-10 py-5 bg-white text-primary rounded-2xl font-black shadow-xl hover:scale-105 transition-transform inline-block">
                    Optimize My Profile
                </Link>
            </div>
        </div>
    );
}
