"use client";
import React from 'react';
import { Bell, Sparkles, Briefcase, Zap, Info, Clock } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Neural Match Found',
        description: 'Your profile has a 94% match with a new Senior React Developer position at TECH-X.',
        time: '2 hours ago',
        type: 'match',
        icon: Sparkles,
        color: 'text-accent'
    },
    {
        id: 2,
        title: 'Interview invitation',
        description: 'GLOBAL-LOGIC has requested an initial screening based on your recent CV sync.',
        time: '5 hours ago',
        type: 'action',
        icon: Briefcase,
        color: 'text-primary'
    },
    {
        id: 3,
        title: 'Profile Optimization',
        description: 'The RecruitIntel AI suggested 3 new keywords to improve your reach in Fintech.',
        time: '1 day ago',
        type: 'info',
        icon: Zap,
        color: 'text-yellow-500'
    },
    {
        id: 4,
        title: 'Security Alert',
        description: 'You successfully updated your access key/password.',
        time: '2 days ago',
        type: 'security',
        icon: Info,
        color: 'text-foreground/40'
    }
];

export default function NotificationsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Neural Alerts</h1>
                    <p className="text-foreground/40">Real-time intelligence on your professional sync.</p>
                </div>
                <button className="text-xs font-mono uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className="glass technical-border rounded-2xl p-6 flex items-start space-x-6 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className={`p-3 rounded-xl bg-secondary/50 ${notif.color} border border-border group-hover:border-primary/20`}>
                            <notif.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">{notif.title}</h3>
                                <div className="flex items-center text-[10px] font-mono text-foreground/30 uppercase tracking-widest">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {notif.time}
                                </div>
                            </div>
                            <p className="text-foreground/60 leading-relaxed">{notif.description}</p>
                            <div className="pt-2 flex items-center space-x-4">
                                <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View Details</button>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 hover:text-foreground">Dismiss</button>
                            </div>
                        </div>
                    </div>
                ))}

                {MOCK_NOTIFICATIONS.length === 0 && (
                    <div className="py-20 text-center glass technical-border rounded-2xl border-dashed">
                        <Bell className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                        <p className="text-foreground/40 italic">Your neural feed is quiet. Start syncing your CV to trigger alerts.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
