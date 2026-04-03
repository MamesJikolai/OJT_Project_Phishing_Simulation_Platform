import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import type { AnalyticsResponse } from '../../../types/models'

interface LatestCampaignsClickRateChartProps {
    data: AnalyticsResponse
}

function LatestCampaignsClickRateChart({
    data,
}: LatestCampaignsClickRateChartProps) {
    const recentCampaigns = data?.campaigns
        ? [...data.campaigns]
              .sort(
                  (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
              )
              .slice(0, 10)
        : []

    return (
        <div className="w-full bg-[#F8F9FA] p-6 rounded-lg drop-shadow-md border border-gray-100">
            <h3 className="mb-4">Latest Campaigns Click Rate</h3>

            <div className="h-90 lg:h-120 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={recentCampaigns}
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
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 14 }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="click_rate"
                            name="Click Rate"
                            fill="#17A2B8"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default LatestCampaignsClickRateChart
