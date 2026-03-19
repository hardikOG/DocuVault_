export default function DocumentsLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-8 w-40 skeleton rounded" />
                    <div className="h-4 w-56 skeleton rounded mt-2" />
                </div>
                <div className="h-10 w-40 skeleton rounded-lg" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-11 skeleton rounded-lg" />
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-20 skeleton rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Documents Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 skeleton rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 skeleton rounded" />
                                <div className="h-3 w-32 skeleton rounded" />
                            </div>
                            <div className="w-8 h-8 skeleton rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
