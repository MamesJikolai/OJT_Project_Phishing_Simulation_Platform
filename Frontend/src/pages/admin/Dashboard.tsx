import { useState, useEffect } from 'react'
import CourseCard from '../../components/Courses/CourseCard.tsx'
import Message from '../../components/Message.tsx'
import type { ColumnDef } from '@tanstack/react-table'
import TableComponent from '../../components/Tables/TableComponent.tsx'
import type { DashboardResponse, Course } from '../../types/models.ts'
import type { Campaign } from '../../types/models.ts'
import { apiService } from '../../services/userService.ts'
import { formatDate } from '../../utils/formatters.ts'
import AnalyticsCards from '../../components/Analytics/AnalyticsCards.tsx'

function Dashboard() {
    const [dashboardData, setDashboardData] =
        useState<DashboardResponse | null>(null)
    const [courseData, setCourseData] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)

                // Fetch from the dashboard endpoint and courses in parallel
                const [fetchedDashboardData, fetchedCoursesData] =
                    await Promise.all([
                        apiService.getSingleton<DashboardResponse>('dashboard'),
                        apiService.getAll<Course>('courses'),
                    ])

                setDashboardData(fetchedDashboardData)
                setCourseData(fetchedCoursesData)
            } catch (err) {
                console.error('Failed to load data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const summaryMetrics = dashboardData?.stats
        ? [
              {
                  label: 'Total Campaigns',
                  value: dashboardData.stats.total_campaigns,
              },
              {
                  label: 'Running Campaigns',
                  value: dashboardData.stats.running_campaigns,
              },
              {
                  label: 'Total Targets',
                  value: dashboardData.stats.total_targets,
              },
              { label: 'Total Sent', value: dashboardData.stats.total_sent },
              {
                  label: 'Total Clicked',
                  value: dashboardData.stats.total_clicked,
              },
              {
                  label: 'Total Completed',
                  value: dashboardData.stats.total_completed,
              },
              { label: 'Click Rate', value: dashboardData.stats.click_rate },
              {
                  label: 'Completion Rate',
                  value: dashboardData.stats.completion_rate,
              },
              {
                  label: 'Average Quiz Score',
                  value: dashboardData.stats.avg_quiz_score,
              },
          ]
        : []

    const recentCampaignsColumns: ColumnDef<Campaign, any>[] = [
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
            accessorKey: 'email_template_name',
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
                const numericValue = info.getValue() as number
                let barColor = 'bg-[#DC3545]'
                if (numericValue <= 20) {
                    barColor = 'bg-[#28A745]'
                } else if (numericValue <= 40) {
                    barColor = 'bg-[#FFC107]'
                }

                return (
                    <div className="w-full min-w-[120px] px-1 flex items-center gap-3">
                        <span className="w-fit text-right text-xs font-bold text-gray-700">
                            {numericValue}%
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                                style={{ width: `${numericValue}%` }}
                            />
                        </div>
                    </div>
                )
            },
        },
    ]

    const recentClickColumns: ColumnDef<any, any>[] = [
        { accessorKey: 'full_name', header: 'Name', enableColumnFilter: false },
        { accessorKey: 'email', header: 'Email', enableColumnFilter: false },
        {
            accessorKey: 'campaign',
            header: 'Campaign',
            enableColumnFilter: false,
        },
        {
            accessorKey: 'clicked_at',
            header: 'Time',
            enableColumnFilter: false,
            cell: (info) => formatDate(info.getValue() as string),
        },
    ]

    return (
        <div className="flex flex-col items-start p-4 md:p-8 w-full box-border overflow-x-hidden">
            <Message text="Dashboard" />

            <div className="flex flex-col gap-8 max-w-full">
                {dashboardData && (
                    <div className="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
                        {summaryMetrics.map((metric, index) => (
                            <AnalyticsCards
                                key={index}
                                text={metric.label}
                                item={metric.value}
                            />
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="py-8 text-gray-500 animate-pulse">
                        Loading Campaigns...
                    </div>
                ) : (
                    <TableComponent
                        data={dashboardData?.recent_campaigns || []}
                        columns={recentCampaignsColumns}
                        isPaginated={false}
                        customTablePadding="!py-2 !px-1"
                        title="Recent Campaigns"
                    />
                )}

                {isLoading ? (
                    <div className="py-8 text-gray-500 animate-pulse">
                        Loading Recent Clicks...
                    </div>
                ) : (
                    <TableComponent
                        data={dashboardData?.recent_clicks || []}
                        columns={recentClickColumns}
                        isPaginated={false}
                        customTablePadding="!py-2 !px-1"
                        title="Recent Clicks"
                    />
                )}

                {isLoading ? (
                    <div className="py-8 text-gray-500 animate-pulse">
                        Loading Courses...
                    </div>
                ) : (
                    <div>
                        <h2>Recent Courses</h2>
                        <div className="flex justify-start w-full overflow-x-auto gap-4">
                            {courseData.slice(0, 5).map((item, index) => (
                                <CourseCard
                                    item={item}
                                    key={index}
                                    isDashboard
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
