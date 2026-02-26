import React from 'react';
import Link from 'next/link';
import { Shield, Target, Cpu, Zap, ArrowRight, CheckCircle2, Sparkles, Binary, Shapes } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Background Accents */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-accent/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="p-5 flex justify-between items-center border-b border-border/50 glass sticky top-0 z-50">
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RecruitIntel</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">Platform</a>
                    <a href="#solutions" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">Solutions</a>
                    <a href="#pricing" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">Pricing</a>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-foreground/70 hover:text-primary transition-colors">Sign In</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-sm font-bold text-white rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-bounce-subtle">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Next-Gen Recruitment AI</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tightest mb-8 leading-[0.9] text-slate-900">
                    Hire <span className="text-primary italic">Better.</span> <br />
                    Match <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Faster.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mb-12 leading-relaxed font-medium">
                    The world’s first <span className="text-slate-900 font-bold decoration-accent/30 underline decoration-4">Persona-Centric</span> hiring engine.
                    Stop scanning papers. Start understanding people.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link href="/register" className="px-10 py-6 bg-slate-900 text-white text-lg font-bold rounded-2xl flex items-center shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all group">
                        Create AI Profile <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="px-10 py-6 bg-white border-2 border-slate-200 text-slate-900 text-lg font-bold rounded-2xl flex items-center hover:border-primary/50 transition-all">
                        Watch the Engine
                    </button>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 w-full max-w-5xl aspect-video rounded-3xl border-8 border-white shadow-2xl relative overflow-hidden group bg-slate-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                    <div className="absolute top-4 left-4 right-4 h-8 flex items-center justify-start space-x-2 px-4 border-b border-slate-200">
                        <div className="w-3 h-3 rounded-full bg-red-400/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                        <div className="w-3 h-3 rounded-full bg-green-400/50" />
                    </div>
                    <div className="mt-16 px-12 text-left">
                        <div className="h-4 w-48 bg-slate-200 rounded-full mb-10" />
                        <div className="grid grid-cols-3 gap-6">
                            <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100" />
                            <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100" />
                            <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100" />
                        </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-sm">
                        <div className="px-6 py-3 bg-white shadow-xl rounded-full font-bold text-primary flex items-center">
                            <Sparkles className="mr-2 w-5 h-5" /> Interactive Intelligence Applied
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Built for the <br /> <span className="text-primary italic">Precision Era.</span></h2>
                            <p className="text-xl text-slate-500 font-medium">Keywords are legacy tech. RecruitIntel uses high-dimensional embeddings to map personality to role requirements.</p>
                        </div>
                        <div className="flex space-x-3">
                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                                <Binary className="text-primary w-6 h-6" />
                                <span className="font-bold">Vector Search</span>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                                <Shapes className="text-accent w-6 h-6" />
                                <span className="font-bold">Neural Maps</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Target className="text-white" />}
                            color="bg-primary"
                            title="Persona-Fit Search"
                            description="Find candidates whose behavioral archetypes match your team's existing top performers exactly."
                        />
                        <FeatureCard
                            icon={<Cpu className="text-white" />}
                            color="bg-accent"
                            title="Semantic CV Intel"
                            description="Go beyond text scanning. Gemini analyzes projects, repos, and portfolios to verify raw capability."
                        />
                        <FeatureCard
                            icon={<Zap className="text-white" />}
                            color="bg-orange-500"
                            title="Hyper-Velocity Matching"
                            description="Rank 10,000+ candidates in under 2 seconds with pgvector hardware acceleration."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-accent rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <h2 className="text-4xl md:text-6xl font-black mb-6">Revolutionize your <br /> talent pipeline today.</h2>
                    <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">Join hundreds of hyper-growth companies building better teams with RecruitIntel.</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link href="/register" className="px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95">
                            Start Free Trial
                        </Link>
                        <button className="px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl font-bold hover:bg-white/20 transition-all">
                            Talk to Success Agent
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-6 text-primary">
                            <Shield className="w-8 h-8 fill-primary/10" />
                            <span className="text-2xl font-black tracking-tighter">RecruitIntel</span>
                        </div>
                        <p className="max-w-xs text-slate-500 font-medium">
                            Enterprise-grade intelligence for the next generation of engineering teams.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-slate-900">Platform</h4>
                        <ul className="space-y-4 text-slate-500 font-medium text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Neural Matching</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Vector Insights</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-slate-900">Company</h4>
                        <ul className="space-y-4 text-slate-500 font-medium text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center opacity-60 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <p>© 2026 RecruitIntel — Designed for Excellence.</p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <span>Built with Gemini AI</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Powered by HyperNext</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, color, title, description }: { icon: React.ReactNode, color: string, title: string, description: string }) => (
    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all hover:scale-[1.02] cursor-default group">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-6`}>
            {icon}
        </div>
        <h3 className="text-2xl font-black mb-4 text-slate-900 leading-tight">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
