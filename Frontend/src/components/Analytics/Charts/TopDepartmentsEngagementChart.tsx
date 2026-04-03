import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import type { AnalyticsResponse } from '../../../types/models'

interface TopDepartmentsEngagementChartProps {
    data: AnalyticsResponse
}

function TopDepartmentsEngagementChart({
    data,
}: TopDepartmentsEngagementChartProps) {
    const topEngagementData = data?.department_stats
        ? [...data.department_stats]
              .sort((a, b) => b.clicked - a.clicked)
              .slice(0, 10)
        : []

    return (
        <div className="w-full bg-[#F8F9FA] p-6 rounded-lg drop-shadow-md border border-gray-100">
            <h3 className="mb-4">Top 10 Departments By Engagement</h3>

            <div className="h-90 lg:h-120 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={topEngagementData}
                        layout="vertical"
                        margin={{
                            top: 20,
                            right: 20,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                        />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="department"
                            type="category"
                            width={100}
                            tick={{ fontSize: 14 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="clicked"
                            name="Total Clicked"
                            fill="#17A2B8"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive
                        />
                        <Bar
                            dataKey="completed"
                            name="Total Completed"
                            fill="#28A745"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default TopDepartmentsEngagementChart
