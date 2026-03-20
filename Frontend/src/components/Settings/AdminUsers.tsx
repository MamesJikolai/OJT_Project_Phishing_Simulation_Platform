import { useEffect, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import DefaultButton from '../DefaultButton'
import TableComponent from '../Tables/TableComponent'
import type { Accounts } from '../../types/models'
import { apiService } from '../../services/userService'
import AdminUserModal from './AdminUsersModal'

function AdminUsers() {
    const [data, setData] = useState<Accounts[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setIsLoading(true)
                const fetchedData =
                    await apiService.getAll<Accounts>('accounts')
                setData(fetchedData)
            } catch (err) {
                console.error('Failed to load accounts:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAccount()
    }, [])

    const handleSaveAccount = async (accountData: Accounts) => {
        try {
            const newAccount = await apiService.create<Accounts>(
                'accounts',
                accountData
            )

            setData((prevData: Accounts[]) => [newAccount, ...prevData])
        } catch (err) {
            console.error('Failed to save account:', err)
        }
    }

    const columns: ColumnDef<Accounts, any>[] = [
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
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] self-center"
                />
            </div>

            {isLoading ? (
                <div className="py-8 text-gray-500 animate-pulse">
                    Loading Admin Users...
                </div>
            ) : (
                <TableComponent data={data} columns={columns} />
            )}

            {isModalOpen && (
                <AdminUserModal
                    key="create-modal"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAccount} // 3. Pass the function down to the modal!
                />
            )}
        </div>
    )
}

export default AdminUsers
