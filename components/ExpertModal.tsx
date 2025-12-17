'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, Loader2, Check, User } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import clsx from 'clsx';
// 1. Import the Server Action
import { submitLead } from '@/app/actions';

interface ExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    context: string;
}

export default function ExpertModal({ isOpen, onClose, planName, context }: ExpertModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // 2. Prepare the data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);

        // 3. Call the Server Action
        const result = await submitLead(formData, { planName, persona: context });

        if (result.success) {
            setStatus('success');
        } else {
            setStatus('error');
            // Optional: Handle error UI
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Coverage Check">
            <div className="space-y-6">
                {/* 1. Context Card - Redesigned for Mental Appeal */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                    <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Confirm Your Savings & Network</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            You've identified <span className="font-bold text-slate-700">{planName}</span> as a match.
                            Let's ensure you don't face unexpected <span className="font-bold text-emerald-700">co-pays</span> or <span className="font-bold text-emerald-700">waiting periods</span>.
                        </p>
                    </div>
                </div>

                {/* 2. The Form */}
                {status !== 'success' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* New Name Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 font-medium text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="082 123 4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 font-medium text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting' || phone.length < 10 || name.length < 2}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                                status === 'submitting' || phone.length < 10 || name.length < 2
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                            )}
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Verify My Benefits"
                            )}
                        </button>
                        <p className="text-[10px] text-center text-slate-400">
                            100% Free. Secure connection to an accredited specialist.
                        </p>
                    </form>
                ) : (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Request Received</h3>
                        <p className="text-slate-500 text-sm">
                            Thanks {name}. Our partner team will call you on <span className="font-bold">{phone}</span> within 15 minutes to confirm your coverage.
                        </p>
                        <button onClick={onClose} className="mt-6 text-emerald-600 font-bold text-sm hover:underline">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </BottomSheet>
    );
}