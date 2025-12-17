'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, DollarSign, User, Settings2, X, ArrowRight, Search, Sparkles } from 'lucide-react';

export default function ControlPanel() {
    const router = useRouter();
    const [zipCode, setZipCode] = useState('75001');
    const [income, setIncome] = useState('45000');
    const [age, setAge] = useState('30');
    const [isEditMode, setIsEditMode] = useState(false);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditMode(false);
        router.refresh();
    };

    // 1. THE "COMMAND BAR" (View Mode)
    if (!isEditMode) {
        return (
            <div className="w-full max-w-3xl mx-auto -mt-8 relative z-30 px-4 sm:px-6">
                <div className="bg-white/95 backdrop-blur-xl rounded-full sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-white/50 p-1.5 sm:p-2 flex items-center justify-between gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 duration-700 ring-1 ring-slate-900/5">

                    {/* DATA PILLS SCROLLER */}
                    <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right py-1 px-1">

                        {/* Mobile Optimized Pills (Compact) */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">{zipCode}</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shrink-0">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">${parseInt(income).toLocaleString('en-US')}</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shrink-0">
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-700">{age}</span>
                        </div>
                    </div>

                    {/* MODIFY BUTTON (Adaptive) */}
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="
                            shrink-0 relative group
                            h-10 w-10 sm:w-auto sm:h-11 
                            sm:px-6 
                            bg-blue-600 hover:bg-blue-700 text-white 
                            rounded-full 
                            font-bold text-sm 
                            shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                            transition-all duration-300
                            flex items-center justify-center gap-2
                        "
                    >
                        {/* Icon rotates on hover */}
                        <Settings2 className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />

                        {/* Text hidden on mobile, visible on desktop */}
                        <span className="hidden sm:inline">Modify</span>

                        {/* Mobile-only pulsing indicator */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full sm:hidden animate-pulse"></span>
                    </button>
                </div>
            </div>
        );
    }

    // 2. THE "CONTROL DECK" (Edit Mode)
    return (
        <div className="w-full max-w-3xl mx-auto -mt-8 relative z-30 px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-2xl ring-1 ring-slate-900/5 p-1 animate-in zoom-in-95 duration-200">
                <form onSubmit={handleUpdate} className="bg-slate-50/50 rounded-[1.25rem] p-4 sm:p-6 border border-slate-100">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Update Strategy</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                        {/* Zip Input */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 group-focus-within:text-blue-600 transition-colors">
                                Zip Code
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
                                    placeholder="00000"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        {/* Income Input */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 group-focus-within:text-emerald-600 transition-colors">
                                Annual Income
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        {/* Age Input */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Applicant Age
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        className="w-full group bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <span>Update My Strategy</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}