import { useState, useEffect } from 'react'
import CourseCard from '../../components/Courses/CourseCard.tsx'
import Message from '../../components/Message.tsx'
import NavigateButton from '../../components/NavigateButton.tsx'
import type { ColumnDef } from '@tanstack/react-table'
import TableComponent from '../../components/Tables/TableComponent.tsx'
import type { AnalyticsResponse, Course } from '../../types/models.ts'
import type { Campaign } from '../../types/models.ts'
import { apiService } from '../../services/userService.ts'
import { formatDate } from '../../utils/formatters.ts'
import AnalyticsCards from '../../components/Analytics/AnalyticsCards.tsx'

function Dashboard() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse>()
    const [courseData, setCourseData] = useState<Course[]>([])
    const [campaignData, setCampaignData] = useState<Campaign[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setIsLoading(true)
                const fetchedAnalyticsData =
                    await apiService.getSingleton<AnalyticsResponse>(
                        'analytics'
                    )
                const fetchedCampaignData =
                    await apiService.getAll<Campaign>('campaigns')
                const fetchedCoursesData =
                    await apiService.getAll<Course>('courses')
                setAnalyticsData(fetchedAnalyticsData)
                setCampaignData(fetchedCampaignData)
                setCourseData(fetchedCoursesData)
            } catch (err) {
                console.error('Failed to load data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTemplate()
    }, [])

    const summaryMetrics = analyticsData
        ? [
              {
                  label: 'Total Campaigns',
                  value: analyticsData.summary.total_campaigns,
              },
              { label: 'Total Sent', value: analyticsData.summary.total_sent },
              {
                  label: 'Total Clicked',
                  value: analyticsData.summary.total_clicked,
              },
              {
                  label: 'Total Completed',
                  value: analyticsData.summary.total_completed,
              },
              { label: 'Click Rate', value: analyticsData.summary.click_rate },
              {
                  label: 'Completion Rate',
                  value: analyticsData.summary.completion_rate,
              },
          ]
        : []

    // Define table columns to pass into table
    const columns: ColumnDef<Campaign, any>[] = [
        { accessorKey: 'name', header: 'Name', enableColumnFilter: false },
        {
            accessorKey: 'status',
            header: 'Status',
            enableColumnFilter: false,
        },
        {
            accessorKey: 'total_targets',
            header: 'Target',
            enableColumnFilter: false,
        },
        {
            accessorKey: 'email_template_name', // Changed from 'template'
            header: 'Template',
            enableColumnFilter: false,
            cell: (info) =>
                info.getValue() || (
                    <span className="text-gray-400 italic">None</span>
                ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            enableColumnFilter: false,
            cell: (info) => formatDate(info.getValue() as string),
        },
        {
            accessorKey: 'click_rate',
            header: 'Click Rate',
            enableColumnFilter: false,
            cell: (info) => {
                // Since your data type is already a number, we can just grab it directly!
                const numericValue = info.getValue() as number

                // Optional: Change color based on progress (red for low, green for high)
                let barColor = 'bg-[#28A745]' // Default Green
                if (numericValue < 30) {
                    barColor = 'bg-[#DC3545]' // Red for low completion
                } else if (numericValue < 70) {
                    barColor = 'bg-[#FFC107]' // Yellow for medium completion
                }

                return (
                    <div className="w-full min-w-[120px] px-1 flex items-center gap-3">
                        {/* Text Label (e.g., "65%") */}
                        <span className="w-fit text-right text-xs font-bold text-gray-700">
                            {numericValue}%
                        </span>

                        {/* The Gray Background Track */}
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            {/* The Colored Progress Fill */}
                            <div
                                className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                                // The inline style sets the exact width dynamically
                                style={{ width: `${numericValue}%` }}
                            />
                        </div>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="flex flex-col items-start p-8 overflow-x-hidden max-w-full">
            <Message text="Dashboard" />

            <div className="flex flex-col gap-4 max-w-full">
                <div className="pb-4">
                    {analyticsData && (
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

                {isLoading ? (
                    <div className="py-8 text-gray-500 animate-pulse">
                        Loading Courses...
                    </div>
                ) : (
                    <div className="flex justify-start w-full overflow-x-auto gap-4 pb-4">
                        {courseData.slice(0, 5).map((item, index) => (
                            <CourseCard item={item} key={index} isDashboard />
                        ))}
                    </div>
                )}
                {isLoading ? (
                    <div className="py-8 text-gray-500 animate-pulse">
                        Loading Campaigns...
                    </div>
                ) : (
                    <TableComponent
                        data={campaignData.slice(0, 5)}
                        columns={columns}
                        isPaginated={false}
                        customTablePadding="!py-2 !px-1"
                    />
                )}
            </div>
        </div>
    )
}

export default Dashboard
