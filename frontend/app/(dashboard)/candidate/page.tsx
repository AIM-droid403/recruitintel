"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    FileUp, Sparkles, BookOpen, Layers, Target,
    UploadCloud, Loader2, CheckCircle2, TrendingUp,
    Zap, Bell, Briefcase, Cpu, ShieldCheck
} from 'lucide-react';
import ApplicationTracker from '@/components/ApplicationTracker';

export default function CandidateDashboard() {
    const { user, token } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [uploadedDocs] = useState<string[]>(['National ID']); // Mock uploaded
    const [applications, setApplications] = useState<any[]>([]);

    // Mock data for initial view
    useEffect(() => {
        setApplications([
            {
                id: '1',
                jobTitle: 'Senior Neural Engineer',
                company: 'Aether Minds',
                matchScore: 94,
                updatedAt: new Date().toISOString(),
                steps: [
                    { label: 'Applied', status: 'completed' },
                    { label: 'Screening', status: 'completed' },
                    { label: 'Technical', status: 'current' },
                    { label: 'Final', status: 'upcoming' }
                ]
            },
            {
                id: '2',
                jobTitle: 'AI Product Architect',
                company: 'Quantum Logic',
                matchScore: 88,
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                steps: [
                    { label: 'Applied', status: 'completed' },
                    { label: 'Review', status: 'current' },
                    { label: 'Interview', status: 'upcoming' },
                    { label: 'Offer', status: 'upcoming' }
                ]
            }
        ]);
    }, []);

    const handleResumeUpload = () => {
        setIsProcessing(true);
        // Simulate AI parsing
        setTimeout(() => {
            setProfile({
                summary: "Strategic AI professional with expertise in neural network architectures and decentralized intelligence systems. Proven track record of scaling LLM infrastructure.",
                skills: ["PyTorch", "Rust", "Distributed Systems", "LLM Fine-tuning", "Neural Architecture Search"]
            });
            setIsProcessing(false);
        }, 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Neural Command
                    </h1>
                    <p className="text-foreground/40 font-medium">Synchronizing your professional identity with the global talent mesh.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-3 backdrop-blur-md">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Network Rank</span>
                            <span className="text-sm font-bold text-primary">Top 4%</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center space-x-3 backdrop-blur-md">
                        <Zap className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">AI Match Rating</span>
                            <span className="text-sm font-bold text-primary text-glow">89/100</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Profile & Stats */}
                <div className="lg:col-span-3 space-y-6">
                    <section className="glass technical-border rounded-3xl p-6 bg-gradient-to-b from-primary/5 to-transparent">
                        <div className="flex items-center space-x-3 mb-6">
                            <Cpu className="w-5 h-5 text-primary" />
                            <h2 className="font-black text-sm uppercase tracking-[0.2em]">Neural Profile</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-card group">
                                {user?.profile_picture_url ? (
                                    <img src={user.profile_picture_url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-foreground/10 bg-secondary/50">
                                        {user?.email?.[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <button className="text-[10px] font-black uppercase text-white tracking-widest px-3 py-1 bg-primary rounded-full">Update Core</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-bold">{user?.email?.split('@')[0]}</h3>
                                <p className="text-xs text-foreground/40 leading-relaxed">Intelligence Engineer specializing in high-load distributed neural systems.</p>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                                        <span>Skill Cohesion</span>
                                        <span className="text-primary">92%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[92%] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                                        <span>Market Velocity</span>
                                        <span className="text-accent">High</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent w-[85%] shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass technical-border rounded-3xl p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h2 className="font-black text-sm uppercase tracking-[0.2em]">Trust Vault</h2>
                        </div>
                        <div className="space-y-3">
                            {['National ID', 'Degree Cert', 'Background'].map(doc => (
                                <div key={doc} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-primary/30 transition-all">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase">{doc}</span>
                                    {uploadedDocs.includes(doc) ? (
                                        <CheckCircle2 className="w-3 h-3 text-primary" />
                                    ) : (
                                        <UploadCloud className="w-3 h-3 text-foreground/10 group-hover:text-primary transition-colors cursor-pointer" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CENTER COLUMN: Main Feed & Applications */}
                <div className="lg:col-span-6 space-y-8">
                    {/* DROP ZONE / SMART INGESTOR */}
                    <section className="glass technical-border rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UploadCloud className="w-32 h-32 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight mb-2">Smart Ingestor 2.0</h2>
                            <p className="text-foreground/40 text-sm mb-8">Deploy your resume into our neural engine for deep-match optimization.</p>

                            <div
                                onClick={handleResumeUpload}
                                className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer h-64
                                ${isProcessing ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/40 hover:bg-white/[0.02]'}`}
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary animate-pulse">Scanning Neural Paths...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FileUp className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Drop your resume here</p>
                                            <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest mt-1">PDF, DOCX, OR RAW TEXT INGESTION</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ACTIVE APPLICATIONS */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Layers className="w-5 h-5 text-primary" />
                                <h2 className="font-black text-sm uppercase tracking-[0.2em]">Application Streams</h2>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">View All</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {applications.map(app => (
                                <ApplicationTracker key={app.id} application={app} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Opportunities & Feed */}
                <div className="lg:col-span-3 space-y-8">
                    <section className="glass technical-border rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Target className="w-5 h-5 text-primary" />
                                <h2 className="font-black text-sm uppercase tracking-[0.1em]">Radar</h2>
                            </div>
                            <Bell className="w-4 h-4 text-foreground/20 hover:text-primary transition-colors cursor-pointer" />
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Head of AI', company: 'Neuralink Corp', score: 98, type: 'Remote' },
                                { title: 'Lead Data Scientist', company: 'Google Brain', score: 91, type: 'On-site' },
                                { title: 'MLOps Architect', company: 'Anthropic', score: 87, type: 'Hybrid' }
                            ].map((job, i) => (
                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                                        <span className="text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{job.score}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-foreground/30 font-mono uppercase">{job.company}</span>
                                        <span className="text-[10px] text-foreground/20 italic">{job.type}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:border-primary/30 hover:text-primary transition-all">
                                SCAN FOR MORE JOBS
                            </button>
                        </div>
                    </section>

                    <section className="glass technical-border rounded-3xl p-6 bg-secondary/20">
                        <div className="flex items-center space-x-3 mb-6">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h2 className="font-black text-sm uppercase tracking-[0.1em]">Insights</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-primary/5 border-l-2 border-primary rounded-r-xl">
                                <p className="text-[10px] font-bold text-primary uppercase mb-1">Growth Opportunity</p>
                                <p className="text-xs text-foreground/60 leading-relaxed">Your profile matches 85% of high-paying Rust roles. Consider adding 'Tokio' to your skills.</p>
                            </div>
                            <div className="p-3 bg-accent/5 border-l-2 border-accent rounded-r-xl">
                                <p className="text-[10px] font-bold text-accent uppercase mb-1">Network Insight</p>
                                <p className="text-xs text-foreground/60 leading-relaxed">3 recruiters from top AI labs viewed your profile in the last 24 hours.</p>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
