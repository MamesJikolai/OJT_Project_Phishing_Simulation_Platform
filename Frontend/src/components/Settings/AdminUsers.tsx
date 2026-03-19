import { accounts } from '../../assets/dummydata/accounts'
import type { ColumnDef } from '@tanstack/react-table'
import DefaultButton from '../DefaultButton'
import TableComponent from '../Tables/TableComponent'

export type AdminUsers = {
    id: number
    username: string
    password: string
    role: string
    firstName: string
    lastName: string
    email: string
    organization: string
    created: string
}

function AdminUsers() {
    const columns: ColumnDef<AdminUsers, any>[] = [
        { accessorKey: 'username', header: 'Username' },
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        {
            accessorKey: 'role',
            header: 'Role',
            meta: { filterVariant: 'select' },
        },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'organization', header: 'Organization' },
        { accessorKey: 'created', header: 'Created' },
    ]

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-2">
                <h2>Admin Users</h2>
                <DefaultButton
                    children="Add Admin"
                    className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] self-center"
                />
            </div>
            <TableComponent data={accounts} columns={columns} />
        </div>
    )
}

export default AdminUsers
