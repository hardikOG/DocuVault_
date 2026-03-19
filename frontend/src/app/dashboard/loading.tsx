export default function DashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-8 w-48 skeleton rounded" />
                    <div className="h-4 w-64 skeleton rounded mt-2" />
                </div>
                <div className="h-10 w-40 skeleton rounded-lg" />
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 skeleton rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-3 w-20 skeleton rounded" />
                                <div className="h-6 w-12 skeleton rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Documents Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 skeleton rounded" />
                    <div className="h-4 w-20 skeleton rounded" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 skeleton rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 skeleton rounded" />
                                <div className="h-3 w-32 skeleton rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
