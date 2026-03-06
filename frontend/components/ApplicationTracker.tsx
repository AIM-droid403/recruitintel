import React from 'react';
import { Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Step {
    label: string;
    status: 'completed' | 'current' | 'upcoming' | 'rejected';
}

interface Application {
    id: string;
    jobTitle: string;
    company: string;
    matchScore: number;
    updatedAt: string;
    steps: Step[];
}

export default function ApplicationTracker({ application }: { application: Application }) {
    return (
        <div className="glass technical-border rounded-2xl p-6 hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{application.jobTitle}</h4>
                    <p className="text-[10px] font-mono text-foreground/30 uppercase">{application.company}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        {application.matchScore}% MATCH
                    </span>
                    <span className="text-[8px] font-mono text-foreground/20 mt-1 uppercase">
                        Updated {new Date(application.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-2.5 left-0 w-full h-[1px] bg-border -z-10" />

                {application.steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 bg-card transition-all duration-500
                            ${step.status === 'completed' ? 'border-primary border-solid' :
                                step.status === 'current' ? 'border-primary border-dashed animate-spin-slow' :
                                    step.status === 'rejected' ? 'border-red-500/50 border-solid' : 'border-border/50 border-solid'}`}
                        >
                            {step.status === 'completed' ? (
                                <CheckCircle2 className="w-3 h-3 text-primary" />
                            ) : step.status === 'rejected' ? (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                            ) : (
                                <Circle className={`w-2 h-2 ${step.status === 'current' ? 'text-primary fill-primary' : 'text-border/20'}`} />
                            )}
                        </div>
                        <span className={`text-[8px] font-mono uppercase tracking-tighter
                            ${step.status === 'current' ? 'text-primary' : 'text-foreground/30'}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
