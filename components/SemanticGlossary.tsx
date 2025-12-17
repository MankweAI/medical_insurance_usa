import { BookOpen } from 'lucide-react';

interface Term {
    term: string;
    definition: string;
}

export default function SemanticGlossary({ terms }: { terms: Term[] }) {
    if (!terms || terms.length === 0) return null;

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm my-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-full">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Key Terms for this Strategy</h3>
            </div>

            <dl className="space-y-6">
                {terms.map((item, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                        <dt className="text-sm font-bold text-slate-900 mb-1">{item.term}</dt>
                        <dd className="text-sm text-slate-600 leading-relaxed" suppressHydrationWarning>
                            {item.definition}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}