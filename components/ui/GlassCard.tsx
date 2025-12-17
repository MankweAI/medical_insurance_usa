import clsx from 'clsx';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function GlassCard({ children, className, hoverEffect = false }: GlassCardProps) {
    return (
        <div className={clsx(
            "relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg shadow-emerald-900/5",
            hoverEffect && "transition-all duration-500 hover:bg-white/90 hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-900/10 group cursor-pointer",
            className
        )}>
            {/* NOISE TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* GLOW EFFECT (Only visible on hover if hoverEffect is on) */}
            {hoverEffect && (
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            )}

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
