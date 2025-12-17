import { Lock, EyeOff, Server } from 'lucide-react';
import CloseButton from '@/components/CloseButton';

export const metadata = {
    title: 'Privacy Policy | Intellihealth',
    description: 'How we protect your data in compliance with POPIA.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-6">
            <article className="max-w-3xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 relative">
                <CloseButton />

                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4">
                        <Lock className="w-3 h-3" /> POPIA Compliant
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Your Data is Your Own.</h1>
                    <p className="text-lg text-slate-600 mt-4">
                        We believe in "Data Minimization." We only collect what is absolutely necessary to generate your quote.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <EyeOff className="w-6 h-6 text-slate-400 mb-4" />
                        <h3 className="font-bold text-slate-900 mb-2">No Medical History</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            We never ask for, store, or process your diagnosis codes, HIV status, or chronic history.
                            We simply ask "Do you need chronic cover?" as a Yes/No toggle.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <Server className="w-6 h-6 text-slate-400 mb-4" />
                        <h3 className="font-bold text-slate-900 mb-2">Zero-Knowledge Calculation</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Your income and family size data stays in your browser's local storage for the calculator to work.
                            It is not sent to our servers until you explicitly request a callback.
                        </p>
                    </div>
                </div>

                <div className="prose prose-slate prose-sm max-w-none border-t border-slate-100 pt-8">
                    <h3 className="font-bold text-slate-900">1. How we use your Phone Number</h3>
                    <p>
                        When you click "Check Availability," your number is transmitted via a secure (HTTPS) webhook directly to
                        our accredited brokerage partner. It is not added to any marketing lists or third-party databases.
                    </p>

                    <h3 className="font-bold text-slate-900">2. Cookies & Tracking</h3>
                    <p>
                        We use a minimal cookie set to remember your "Saved Plans" so you can return to them later.
                        We do not use cross-site trackers to follow you around the web.
                    </p>

                    <h3 className="font-bold text-slate-900">3. Your Rights</h3>
                    <p>
                        Under the Protection of Personal Information Act (POPIA), you have the right to request the deletion
                        of your lead data at any time by emailing <em>privacy@intellihealth.co.za</em>.
                    </p>
                </div>

            </article>
        </main>
    );
}
