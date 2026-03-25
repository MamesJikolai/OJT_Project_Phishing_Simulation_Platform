import { useEffect, useState } from 'react'
import AnalyticsCards from '../../components/Analytics/AnalyticsCards.tsx'
import Message from '../../components/Message.tsx'
import type { Analytics, AnalyticsResponse } from '../../types/models.ts'
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
            } catch (err) {
                console.error('Failed to load analytics', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    if (isLoading) return <div className="p-8">Loading course details...</div>

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
                <div className="flex flex-row flex-wrap gap-4">
                    {summaryMetrics.map((metric, index) => (
                        <AnalyticsCards
                            key={index}
                            text={metric.label}
                            item={metric.value}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Analytics
