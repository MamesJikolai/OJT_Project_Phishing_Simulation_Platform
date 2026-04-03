import {
    FunnelChart,
    Funnel,
    Tooltip,
    LabelList,
    ResponsiveContainer,
} from 'recharts'
import type { AnalyticsResponse } from '../../../types/models'

interface SimulationStatsChartProps {
    data: AnalyticsResponse
}

function SimulationStatsChart({ data }: SimulationStatsChartProps) {
    const simulationData = data
        ? [
              { name: 'Sent', value: data.summary.total_sent, fill: '#FFC107' },
              {
                  name: 'Clicked',
                  value: data.summary.total_clicked,
                  fill: '#17A2B8',
              },
              {
                  name: 'Completed',
                  value: data.summary.total_completed,
                  fill: '#28A745',
              },
          ]
        : []

    return (
        <div className="w-full bg-[#F8F9FA] p-6 rounded-lg drop-shadow-md border border-gray-100">
            <h3 className="mb-4">Simulation Stats</h3>

            <div className="h-90 lg:h-120 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart
                        margin={{
                            right: 30,
                        }}
                    >
                        <Tooltip />
                        <Funnel
                            dataKey="value"
                            data={simulationData}
                            isAnimationActive
                        >
                            <LabelList
                                position="right"
                                fill="#121212"
                                stroke="none"
                                dataKey="name"
                            />
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SimulationStatsChart
