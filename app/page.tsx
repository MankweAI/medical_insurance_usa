import { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import HomeHero from '@/components/home/HomeHero';
import DailyInsight from '@/components/DailyInsight';
import { Server, Radio, Database, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Intellihealth | Strategy Console',
  description: 'Access the 2026 Virtual Actuary engine. Calculate risk, compare premiums, and verify benefits.',
};

export default function AppHome() {
  return (
    <main className="min-h-screen bg-slate-50 relative selection:bg-emerald-500/30 font-sans overflow-hidden">
      <AppHeader />

      {/* TECHNICAL GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* TOP GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 pt-32 px-4 container mx-auto max-w-6xl flex flex-col min-h-[calc(100vh-100px)]">

        {/* 1. THE CONSOLE (Central Interaction Layer) */}
        <div className="flex-1 flex flex-col justify-center pb-20">
          <HomeHero />
        </div>

        {/* 2. SYSTEM STATUS DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-12 items-end">

          {/* Left: Unified Telemetry Bar */}
          <div className="lg:col-span-12 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/60 border border-white/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-900/5">
              <StatusModule
                icon={Server}
                label="CMS Rules"
                value="2026.1"
                statusColor="text-emerald-500"
                indicatorColor="bg-emerald-500"
              />
              <StatusModule
                icon={Database}
                label="Dataset"
                value="Verified"
                statusColor="text-emerald-500"
                indicatorColor="bg-emerald-500"
              />
              <StatusModule
                icon={Radio}
                label="Latency"
                value="12ms"
                statusColor="text-blue-500"
                indicatorColor="bg-blue-500"
              />
              <StatusModule
                icon={Activity}
                label="Engine"
                value="Online"
                statusColor="text-amber-500"
                indicatorColor="bg-amber-500"
              />
            </div>
          </div>

          {/* Right: Actuarial Insight */}
          <div className="lg:col-span-12 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />

              <div className="bg-white/60 border border-white/60 rounded-2xl p-1.5 backdrop-blur-xl shadow-sm relative hover:shadow-md transition-all">
                <DailyInsight />
              </div>
            </div>
          </div>

        </div>


      </div>
    </main>
  )
}

// Updated UI Component for the Telemetry Bar
function StatusModule({ icon: Icon, label, value, statusColor, indicatorColor }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 transition-colors group cursor-default h-full">
      <div className="flex items-center gap-3">
        {/* Icon Box with Micro-Interaction */}
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
          <Icon className={`w-4 h-4 ${statusColor} opacity-70 group-hover:opacity-100`} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-slate-500 transition-colors">
            {label}
          </span>
          <span className="text-sm font-bold text-slate-700 font-mono tracking-tight">
            {value}
          </span>
        </div>
      </div>

      {/* Status Indicator Dot with Pulse */}
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${indicatorColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${indicatorColor}`}></span>
      </span>
    </div>
  );
}