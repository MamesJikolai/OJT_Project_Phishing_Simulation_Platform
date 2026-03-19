import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { userData } from '../../assets/dummydata/userData.ts'
import Message from '../../components/Message.tsx'
import TableComponent from '../../components/Tables/TableComponent.tsx'

export type Users = {
    id: number
    name: string
    email: string
    department: string
    campaign: string
    emailStatus: string
    clicked: string
    training: string
    score: string
}

function Users() {
    const columns = useMemo<ColumnDef<Users, any>[]>(
        () => [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'email', header: 'Email' },
            {
                accessorKey: 'department',
                header: 'Department',
                meta: { filterVariant: 'select' },
            },
            {
                accessorKey: 'campaign',
                header: 'Campaign',
                meta: { filterVariant: 'select' },
            },
            { accessorKey: 'emailStatus', header: 'Status' },
            {
                accessorKey: 'clicked',
                header: 'Clicked?',
                meta: { filterVariant: 'select' },
            },
            {
                accessorKey: 'training',
                header: 'Training',
                meta: { filterVariant: 'select' },
            },
            { accessorKey: 'score', header: 'Score' },
        ],
        []
    )

    return (
        <div className="flex flex-col items-center m-8">
            <Message text="Users" />
            <TableComponent data={userData} columns={columns} />
        </div>
    )
}

export default Users
