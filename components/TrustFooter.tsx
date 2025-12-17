'use client';

import Link from 'next/link';
import { ShieldCheck, ExternalLink, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import ContactModal from './ContactModal';

export default function TrustFooter() {
    const currentYear = new Date().getFullYear();
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <footer className="bg-slate-50 border-t border-slate-100 mt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* COLUMN 1: AUTHORITY SIGNAL (Expanded) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Independent Actuarial Data
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                            Intellihealth is an algorithmic analysis tool designed to simplify medical scheme complexity.
                            We are not a financial services provider.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-white/50 px-3 py-2 rounded-lg border border-slate-100 w-fit">
                            <Lock className="w-3 h-3" />
                            <span>SSL Secured & POPIA Compliant</span>
                        </div>
                    </div>

                    {/* COLUMN 2: DATA PROVENANCE (New) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Data Provenance</h6>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Benefit structures and premiums are sourced directly from the 2026 registered rules of the
                            <a
                                href="https://www.medicalschemes.co.za/"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium ml-1"
                            >
                                Council for Medical Schemes (CMS) <ExternalLink className="w-3 h-3" />
                            </a>
                            . While rigorous, this data serves as a guide and does not replace the official scheme brochure.
                        </p>
                    </div>

                    {/* COLUMN 3: LINKS (Organized) */}
                    <div className="lg:col-span-3 flex flex-col gap-2 text-xs font-medium text-slate-500">
                        <h6 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Platform</h6>
                        <Link href="/about" className="hover:text-emerald-600 transition-colors flex items-center gap-2">
                            About the Creator
                        </Link>
                        <Link href="/methodology" className="hover:text-emerald-600 transition-colors">
                            Methodology & Logic
                        </Link>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="hover:text-emerald-600 transition-colors flex items-center gap-2 text-left"
                        >
                            <Mail className="w-3 h-3" /> Contact Support
                        </button>
                    </div>
                </div>

                <ContactModal
                    isOpen={isContactOpen}
                    onClose={() => setIsContactOpen(false)}
                />

                {/* BOTTOM BAR: LEGAL & DISCLAIMER */}
                <div className="mt-12 pt-8 border-t border-slate-200/60">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Link href="/disclaimer" className="hover:text-slate-600 transition-colors">Disclaimer</Link>
                            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Use</Link>
                            <span>© {currentYear} Intellihealth</span>
                        </div>

                        {/* Explicit Disclaimer Text (Critical for YMYL) */}
                        <div className="md:max-w-md text-[10px] text-slate-400 leading-relaxed text-right">
                            <span className="font-bold">Important:</span> Information presented is factual (FAIS definition) and does not constitute financial advice.
                            Consult an accredited FSP before changing cover.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}