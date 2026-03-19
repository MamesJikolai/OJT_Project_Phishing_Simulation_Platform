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
    score: number
}

function Users() {
    const openEditModal = (userData: Users) => {
        //
    }
    const deleteUser = (userData: Users) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${userData.name}"?`
        )
        if (confirmDelete) {
            //
        }
    }

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
            {
                accessorKey: 'emailStatus',
                header: 'Status',
                meta: { filterVariant: 'select' },
            },
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
            {
                accessorKey: 'score',
                header: 'Score',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                enableColumnFilter: false,
                cell: (info) => {
                    const userData = info.row.original

                    return (
                        <div className="flex flex-row gap-2 text-[12px]">
                            <button
                                onClick={() => openEditModal(userData)}
                                className="hover:text-[#17A2B8] text-[#4ECFE0] font-bold cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteUser(userData)}
                                className="hover:text-[#DC3545] text-[#FF6B6B] font-bold cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    )
                },
            },
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
