// components/skeletons/FeedSkeleton.tsx
export default function FeedSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 h-[280px]">
                    <div className="flex justify-between mb-6">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="h-8 w-24 bg-slate-100 rounded" />
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded mb-6" />
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="h-12 bg-slate-50 rounded" />
                        <div className="h-12 bg-slate-50 rounded" />
                        <div className="h-12 bg-slate-50 rounded" />
                    </div>
                    <div className="h-10 w-full bg-slate-100 rounded" />
                </div>
            ))}
        </div>
    );
}
