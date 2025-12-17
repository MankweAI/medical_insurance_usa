'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ControlPanel() {
    const router = useRouter();
    const [zipCode, setZipCode] = useState('75001'); // Default to a seed zip
    const [income, setIncome] = useState('45000');
    const [age, setAge] = useState('30');
    const [isEditMode, setIsEditMode] = useState(false);

    // Mock function to simulate a strategy refresh
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditMode(false);
        // In the real app, this would push query params like ?zip=75001&income=45000
        router.refresh();
    };

    if (!isEditMode) {
        return (
            <div className="w-full max-w-2xl mx-auto -mt-6 relative z-20 px-4">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-between gap-4">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</p>
                            <p className="text-sm font-bold text-slate-900">{zipCode} (Texas)</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Income</p>
                            <p className="text-sm font-bold text-slate-900">${parseInt(income).toLocaleString()}/yr</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applicant</p>
                            <p className="text-sm font-bold text-slate-900">{age} yrs • Single</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto -mt-6 relative z-20 px-4">
            <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-xl border border-blue-200 p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Update Strategy</h3>
                    <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Zip Code</label>
                        <input
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="75001"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Annual Income</label>
                        <div className="relative">
                            <span className="absolute left-2 top-2 text-slate-400 text-sm">$</span>
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full p-2 pl-6 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-sm"
                >
                    Recalculate Subsidy & Plans
                </button>
            </form>
        </div>
    );
}