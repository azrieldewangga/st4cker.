import { AcademicTrendChart } from './analytics/AcademicTrendChart';
import { SpendingHabitChart } from './analytics/SpendingHabitChart';
import { ProductivityHeatmap } from './analytics/ProductivityHeatmap';
import { TaskOverviewCard } from './analytics/TaskOverviewCard';
import { QuickInsightsCard } from './analytics/QuickInsightsCard';

export function AnalyticsTab() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <AcademicTrendChart />
                <SpendingHabitChart />
            </div>

            {/* Row 2: Heatmap, Distribution, Insights */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-[43%_1fr_1fr]">
                <ProductivityHeatmap />
                <TaskOverviewCard />
                <QuickInsightsCard />
            </div>
        </div>
    );
}
