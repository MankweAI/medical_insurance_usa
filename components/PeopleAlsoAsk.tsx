import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

export default function PeopleAlsoAsk({ questions }: { questions: FAQ[] }) {
    if (!questions || questions.length === 0) return null;

    // Generate JSON-LD for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': questions.map(q => ({
            '@type': 'Question',
            'name': q.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': q.answer
            }
        }))
    };

    return (
        <section className="my-12 px-2">
            {/* Inject Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">People Also Ask</h3>
            </div>

            <div className="space-y-3">
                {questions.map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-slate-100 open:shadow-sm open:border-blue-100 transition-all duration-300">
                        <summary className="flex items-center justify-between p-5 font-bold text-slate-700 cursor-pointer list-none select-none">
                            {faq.question}
                            <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}

