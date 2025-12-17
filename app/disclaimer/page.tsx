import { AlertTriangle, FileText } from 'lucide-react';
import CloseButton from '@/components/CloseButton';

export const metadata = {
    title: 'Legal Disclaimer | Intellihealth',
    description: 'Important legal information regarding the use of the Intellihealth platform.',
};

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-6">
            <article className="max-w-3xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 relative">
                <CloseButton />

                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
                    <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Important Legal Disclosures</h1>
                </div>

                <div className="prose prose-slate prose-sm max-w-none">
                    <h3 className="font-bold text-slate-900">1. Information, Not Advice</h3>
                    <p>
                        Intellihealth is an algorithmic analysis tool designed to organize and compare public medical scheme data.
                        The information provided on this website constitutes <strong>factual information</strong> as defined
                        in the Financial Advisory and Intermediary Services Act (FAIS). It does <strong>not</strong> constitute
                        financial advice, recommendation, or guidance.
                    </p>

                    <h3 className="font-bold text-slate-900 mt-8">2. The Role of the Specialist</h3>
                    <p>
                        While our algorithms are rigorous, they cannot account for your personal medical history (e.g., specific pre-existing conditions).
                        Therefore, Intellihealth facilitates a connection to an <strong>Accredited Healthcare Broker</strong> (FSP Registered)
                        for the final "Advice" step. No policy can be activated without this verification.
                    </p>

                    <h3 className="font-bold text-slate-900 mt-8">3. Data Accuracy</h3>
                    <p>
                        Benefits, premiums, and limits are sourced from the 2026 Scheme Rules. While we strive for 100% accuracy,
                        errors may occur. The official brochure from the Medical Scheme remains the final authority in any dispute.
                    </p>

                    <h3 className="font-bold text-slate-900 mt-8">4. Indemnity</h3>
                    <p>
                        By using Intellihealth, you agree that the owners and developers are not liable for any decisions made based
                        on these calculations. You are urged to verify all benefits with the scheme directly before joining.
                    </p>
                </div>
            </article>
        </main>
    );
}
