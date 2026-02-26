"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileUp, Sparkles, BookOpen, Layers, Target, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

export default function CandidateDashboard() {
    const { user, token, updateTokens } = useAuth();
    const [cvText, setCvText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [activeDocType, setActiveDocType] = useState<string>('');

    const handleCVSync = async () => {
        setIsProcessing(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/cv/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rawText: cvText }),
            });
            const data = await response.json();
            setProfile(data.structured_data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const triggerUpload = (docType: string) => {
        setActiveDocType(docType);
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingDoc(activeDocType);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', activeDocType);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                setUploadedDocs(prev => [...prev, activeDocType]);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploadingDoc(null);
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div className="space-y-8">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Neural Profile</h1>
                    <p className="text-foreground/40">Real-time AI synchronization and job discovery.</p>
                </div>
                <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">AI Readiness: 82%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RESUME INGESTOR */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass technical-border rounded-2xl p-8 space-y-6">
                        <div className="flex items-center space-x-3">
                            <UploadCloud className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">Smart Ingestor</h2>
                        </div>
                        <p className="text-sm text-foreground/40">Paste your raw CV text. Our neural engine will restructure it for employer search optimization.</p>

                        <div className="space-y-4">
                            <textarea
                                placeholder="Paste raw CV content here..."
                                rows={12}
                                className="w-full bg-secondary/30 border border-border rounded-xl p-6 text-foreground/80 font-light outline-none focus:border-primary transition-all resize-none leading-relaxed"
                                value={cvText}
                                onChange={(e) => setCvText(e.target.value)}
                            />
                            <button
                                onClick={handleCVSync}
                                disabled={isProcessing || !cvText}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Synchronize with AI Pool</span>}
                            </button>
                        </div>
                    </section>

                    {/* STRUCTURED DATA VIEW */}
                    {profile && (
                        <section className="glass technical-border rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Extracted Identity</h2>
                                <span className="text-xs font-mono text-accent">VERIFIED BY RECRUITINTEL v1.0</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest block">Core Professional Summary</label>
                                    <p className="text-lg font-light leading-relaxed">{profile.summary}</p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest block mb-2">Technical Skills</label>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-white/5 border border-border rounded-full text-xs hover:border-primary transition-colors cursor-default">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* SIDE ACTIONS */}
                <div className="space-y-6">
                    <div className="glass technical-border rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold flex items-center">
                            <FileUp className="w-4 h-4 mr-2 text-primary" />
                            Document Vault
                        </h3>
                        <p className="text-xs text-foreground/40 leading-relaxed">Mandatory verification documents for high-level technical roles.</p>
                        <div className="space-y-2">
                            {['National ID', 'O-Level Certificate', 'Degree / Diploma'].map((doc) => {
                                const isUploaded = uploadedDocs.includes(doc);
                                const isUploading = uploadingDoc === doc;

                                return (
                                    <div
                                        key={doc}
                                        onClick={() => !isUploaded && !isUploading && triggerUpload(doc)}
                                        className={`p-3 border rounded-xl flex items-center justify-between group transition-all ${isUploaded ? 'bg-green-50/50 border-green-200 cursor-default' : 'bg-secondary/50 border-border cursor-pointer hover:border-primary'}`}
                                    >
                                        <span className={`text-sm font-medium ${isUploaded ? 'text-green-600' : 'text-foreground/60 group-hover:text-foreground'}`}>
                                            {doc}
                                        </span>
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        ) : isUploaded ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <UploadCloud className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass technical-border rounded-2xl p-6 space-y-4 bg-gradient-to-br from-primary/5 to-transparent">
                        <h3 className="font-bold flex items-center">
                            <Target className="w-4 h-4 mr-2 text-primary" />
                            Opportunity Radar
                        </h3>
                        <p className="text-xs text-foreground/40">Jobs matching your neural profile will appear here.</p>
                        <div className="py-8 text-center border border-dashed border-border rounded-xl">
                            <p className="text-xs text-foreground/20">Awaiting Profile Sync...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
