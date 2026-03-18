import { users } from '../../assets/users'
import BasicTable from '../Tables/BasicTable'
import type { ColumnDef } from '@tanstack/react-table'
import DefaultButton from '../DefaultButton'

function AdminUsers() {
    const columns: ColumnDef<string>[] = [
        { accessorKey: 'username', header: 'Username' },
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'role', header: 'Role' },
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
            <BasicTable data={users} columns={columns} />
        </div>
    )
}

export default AdminUsers
