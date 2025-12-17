import { Code, Linkedin, Github, Terminal, ShieldCheck, Database } from 'lucide-react';
import CloseButton from '@/components/CloseButton';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About the Creator | Intellihealth',
    description: 'Mankwe Mokgabudi is the Data Analyst & Software Engineer behind Intellihealth, the Virtual Actuary for South African Medical Aid comparison.',
    openGraph: {
        title: 'Meet the Architect behind Intellihealth',
        description: 'Merging Actuarial Science with Modern Engineering to decode Medical Aid.',
        type: 'profile',
        firstName: 'Mankwe',
        lastName: 'Mokgabudi',
        username: 'mankwe',
    }
};

export default function AboutPage() {
    // SEO: Structured Data for "Person"
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Mankwe Mokgabudi',
        jobTitle: 'Data Analyst & Software Engineer',
        knowsAbout: ['Medical Schemes Act', 'Actuarial Science', 'Next.js', 'Data Engineering'],
        url: 'https://intellihealth.co.za/about',
        sameAs: [
            'https://www.linkedin.com/in/mankwe-mokgabudi/',
            'https://github.com/mankwe'
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'Intellihealth'
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 py-20 px-4 sm:px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-3xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                <CloseButton />

                {/* DECORATIVE BACKGROUND ELEMENT */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                {/* HERO PROFILE */}
                <header className="flex flex-col md:flex-row gap-8 items-center mb-12 relative z-10">
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 relative shrink-0 overflow-hidden">
                            <img
                                src="/images/mankwe-profile.jpeg"
                                alt="Mankwe Mokgabudi"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-3">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                                The Architect
                            </p>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Mankwe Mokgabudi
                            </h1>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200">
                                <Code className="w-3 h-3" /> Software Engineer
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-lg text-[11px] font-bold text-blue-700 border border-blue-100">
                                <Database className="w-3 h-3" /> Data Analyst
                            </span>
                        </div>
                    </div>
                </header>

                {/* THE MISSION */}
                <section className="prose prose-slate prose-sm md:prose-base max-w-none mb-12 relative z-10">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        Why I Built Intellihealth
                    </h2>

                    <div className="pl-4 border-l-2 border-emerald-500/30 italic text-slate-600 text-lg leading-relaxed my-6">
                        "I built Intellihealth to solve a problem I faced myself: Medical Aid jargon is designed to confuse.
                        By combining <strong>Actuarial Data Science</strong> with <strong>Modern Software Engineering</strong>,
                        I created this 'Virtual Actuary' to give South Africans an unfair advantage."
                    </div>

                    <p className="text-slate-500">
                        Unlike traditional comparison sites that prioritize "Sponsored" plans, this engine runs on
                        <strong> raw, independent data</strong> registered with the Council for Medical Schemes (CMS).
                        It is an engineering solution to a financial problem. If a plan has a hidden trap—like a
                        restrictive State Hospital rule—the code exposes it. No exceptions.
                    </p>
                </section>

                {/* SOCIAL PROOF & CODE LINK */}
                <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-8 relative z-10">
                    {/* LinkedIn */}
                    <Link
                        href="https://www.linkedin.com/in/mankwe-mokgabudi-9a90a9353/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-[#0077b5]/5 hover:border-[#0077b5]/20 border border-transparent transition-all group"
                    >
                        <div className="p-3 bg-white rounded-xl shadow-sm text-[#0077b5] border border-slate-100 group-hover:scale-110 transition-transform">
                            <Linkedin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-[#0077b5] transition-colors">Connect on LinkedIn</p>
                            <p className="text-xs text-slate-500">View Professional History</p>
                        </div>
                    </Link>

                    {/* THE "SOURCE CODE" REDIRECT */}
                    <Link
                        href="/methodology"
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 border border-transparent transition-all group"
                    >
                        <div className="p-3 bg-white rounded-xl shadow-sm text-slate-900 border border-slate-100 group-hover:scale-110 transition-transform">
                            <Github className="w-5 h-5" />
                        </div>
                        <div>
                            {/* This phrasing implies openness ("Source Logic") while redirecting to your methodology page */}
                            <p className="font-bold text-slate-900 text-sm">View Source Logic</p>
                            <p className="text-xs text-slate-500">Audit the Decision Engine</p>
                        </div>
                    </Link>
                </div>

                {/* TECH FOOTER */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity">
                    <Terminal className="w-3 h-3" />
                    <span>Engineered with Next.js 15 & Supabase</span>
                </div>

            </article>
        </main>
    );
}