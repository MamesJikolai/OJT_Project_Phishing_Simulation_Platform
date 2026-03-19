import { useState } from 'react'
import CourseCard from '../../components/CourseCard.tsx'
import Message from '../../components/Message.tsx'
import NavigateButton from '../../components/NavigateButton.tsx'
import type { ColumnDef } from '@tanstack/react-table'
import type { Campaign } from './Campaigns.tsx'
import TableComponent from '../../components/Tables/TableComponent.tsx'
import { courseList } from '../../assets/dummydata/courses.ts'
import { campaigns } from '../../assets/dummydata/campaigns.ts'

function Dashboard() {
    const [data, error] = useState<Campaign[]>(campaigns)

    // Define table columns to pass into table
    const columns: ColumnDef<Campaign, any>[] = [
        { accessorKey: 'name', header: 'Name' },
        {
            accessorKey: 'status',
            header: 'Status',
            meta: { filterVariant: 'select' },
        },
        {
            accessorKey: 'target',
            header: 'Target',
            meta: { filterVariant: 'select' },
        },
        { accessorKey: 'date', header: 'Date', enableColumnFilter: false },
        {
            accessorKey: 'completion',
            header: 'Completion',
            enableColumnFilter: false,
        },
    ]

    return (
        <div className="flex flex-col items-start p-8 overflow-x-hidden max-w-full">
            <Message text="Dashboard" />

            <h2>My Courses</h2>
            <div className="flex justify-start w-full overflow-x-auto gap-4 pb-4">
                {courseList.slice(0, 5).map((item, index) => (
                    <CourseCard
                        title={item.title}
                        caption={item.caption}
                        key={index}
                    />
                ))}
            </div>
            <NavigateButton
                label="View All"
                href="/courses"
                customCSS="mb-[32px]"
            />

            <h2>Analytics</h2>
            <div className="flex justify-start w-full overflow-x-auto gap-4 pb-4">
                <div className="bg-red-200 w-[300px] h-[300px] shrink-0"></div>
                <div className="bg-red-200 w-[300px] h-[300px] shrink-0"></div>
                <div className="bg-red-200 w-[300px] h-[300px] shrink-0"></div>
                <div className="bg-red-200 w-[300px] h-[300px] shrink-0"></div>
                <div className="bg-red-200 w-[300px] h-[300px] shrink-0"></div>
            </div>
            <NavigateButton
                label="View All"
                href="/analytics"
                customCSS="mb-[32px]"
            />

            <h2>Campaign</h2>
            <TableComponent
                data={data.slice(0, 5)}
                columns={columns}
                isPaginated={false}
            />
            <NavigateButton
                label="View All"
                href="/campaigns"
                customCSS="mb-[32px]"
            />
        </div>
    )
}

export default Dashboard
