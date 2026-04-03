import { useEffect, useState } from 'react'
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
import AnalyticsCards from '../../components/Analytics/AnalyticsCards.tsx'
import Message from '../../components/Message.tsx'
import type { AnalyticsResponse } from '../../types/models.ts'
import { apiService } from '../../services/userService.ts'

function Analytics() {
    const [data, setData] = useState<AnalyticsResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true)
                const fetchedData =
                    await apiService.getSingleton<AnalyticsResponse>(
                        'analytics'
                    )
                setData(fetchedData)
                console.log(fetchedData)
            } catch (err) {
                console.error('Failed to load analytics', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    if (isLoading) return <div className="p-8">Loading analytics data...</div>

    const summaryMetrics = data
        ? [
              { label: 'Total Campaigns', value: data.summary.total_campaigns },
              { label: 'Total Sent', value: data.summary.total_sent },
              { label: 'Total Clicked', value: data.summary.total_clicked },
              { label: 'Total Completed', value: data.summary.total_completed },
              { label: 'Click Rate', value: data.summary.click_rate },
              { label: 'Completion Rate', value: data.summary.completion_rate },
          ]
        : []

    return (
        <div className="flex flex-col items-start m-8">
            <Message text="Analytics & Reports" />

            {data && (
                <div className="flex flex-col gap-8 w-full max-w-6xl">
                    {/* Summary Metrics */}
                    <div className="flex flex-row flex-wrap gap-4">
                        {summaryMetrics.map((metric, index) => (
                            <AnalyticsCards
                                key={index}
                                text={metric.label}
                                item={metric.value}
                            />
                        ))}
                    </div>

                    {/* Department Stats Chart */}
                    <div className="w-full bg-[#F8F9FA] p-6 rounded-lg drop-shadow-md border border-gray-100">
                        <h3 className="mb-4">Department Engagement</h3>

                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.department_stats}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis dataKey="department" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="clicked"
                                        name="Total Clicked"
                                        fill="#17A2B8"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="completed"
                                        name="Total Completed"
                                        fill="#28A745"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analytics
