import { TrendingUp, CheckCircle2 } from 'lucide-react';

const INSIGHTS = [
    {
        term: "The Income Cliff",
        definition: "A specific threshold in scheme rules (e.g. R9,000 pm) where a R1 salary increase triggers a disproportionate premium hike.",
        source: "Intellihealth Database"
    },
    {
        term: "Late Joiner Penalty",
        definition: "Wait too long to join, and you could pay up to 75% more for life. It's not a fine; it's back-paying the risk pool you didn't contribute to.",
        source: "Medical Schemes Act"
    },
    {
        term: "PMB Rights",
        definition: "270+ conditions (including emergencies) that schemes MUST cover by law, regardless of your plan option. Know your rights regarding 'at cost' coverage.",
        source: "Council for Medical Schemes"
    },
    {
        term: "Gap Cover Arbitrage",
        definition: "A lower tier plan + Gap Cover often beats a Comprehensive plan numerically. Use the premium savings to self-insure day-to-day expenses.",
        source: "Actuarial Strategy Group"
    },
    {
        term: "Network Efficiency",
        definition: "Network hospitals aren't 'worse'. They simply agree to fixed rates. You save ~20% on premiums just for using specific providers.",
        source: "Health Fund Analytics"
    }
];

export default function DailyInsight() {
    // Deterministic "Daily" Insight based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % INSIGHTS.length;
    const insight = INSIGHTS[index];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Actuarial Insight</h3>
                </div>

                <dl>
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {insight.term}
                    </dt>
                    <dd className="text-sm text-slate-600 leading-relaxed font-medium">
                        "{insight.definition}"
                    </dd>
                </dl>

                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Source: {insight.source}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
            </div>
        </div>
    );
}
