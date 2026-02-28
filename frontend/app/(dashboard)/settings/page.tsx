"use client";
import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Camera, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
    const { user, token } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateUser } = useAuth();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                updateUser({ profile_picture_url: data.profile_picture_url });
                setMessage({ type: 'success', text: 'Profile picture updated' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Upload failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        // ... existing password change logic ...
        e.preventDefault();
        if (passwords.next !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.next
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setPasswords({ current: '', next: '', confirm: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update password' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <p className="text-foreground/40">Manage your profile identity and security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* PROFILE PICTURE SECTION */}
                <div className="space-y-6">
                    <section className="glass technical-border rounded-2xl p-8 flex flex-col items-center text-center space-y-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-4xl font-bold border-4 border-white/10 overflow-hidden shadow-2xl bg-cover bg-center"
                                style={user?.profile_picture_url ? { backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${user.profile_picture_url})` } : {}}
                            >
                                {!user?.profile_picture_url && user?.email[0].toUpperCase()}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
                            >
                                {isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{user?.email.split('@')[0]}</h2>
                            <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <p className="text-xs text-foreground/40 px-4">Click to upload a new profile picture. AI avatars coming soon.</p>
                    </section>
                </div>

                {/* SETTINGS FORMS */}
                <div className="md:col-span-2 space-y-8">
                    {/* ACCOUNT INFO */}
                    <section className="glass technical-border rounded-2xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 text-primary">
                            <User className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Identity Details</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.email}
                                    className="w-full bg-secondary/30 border border-border rounded-xl p-4 text-foreground/50 font-light outline-none cursor-not-allowed"
                                />
                                <p className="text-[10px] text-foreground/30 italic">Account recovery email cannot be changed through this interface.</p>
                            </div>
                        </div>
                    </section>

                    {/* PASSWORD CHANGE */}
                    <section className="glass technical-border rounded-2xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 text-accent">
                            <Lock className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Security Vault</h2>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-secondary/30 border border-border rounded-xl p-4 text-foreground/80 font-light outline-none focus:border-accent transition-all"
                                        value={passwords.current}
                                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-foreground/40 uppercase tracking-widest">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-secondary/30 border border-border rounded-xl p-4 text-foreground/80 font-light outline-none focus:border-accent transition-all"
                                            value={passwords.next}
                                            onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Confirm New</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-secondary/30 border border-border rounded-xl p-4 text-foreground/80 font-light outline-none focus:border-accent transition-all"
                                            value={passwords.confirm}
                                            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Update Security Key</span></>}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
