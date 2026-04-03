import DefaultButton from '../DefaultButton.tsx'
import TextInput from '../TextInput.tsx'
import type { Accounts } from '../../types/models.ts'
import { useState } from 'react'

interface AdminUsersModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (
        account: Omit<
            Accounts,
            'id' | 'is_staff' | 'is_superuser' | 'date_joined'
        >
    ) => void
}

function AdminUserModal({ isOpen, onClose, onSave }: AdminUsersModalProps) {
    const [username, setUsername] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [role, setRole] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!username || !first_name || !last_name || !role || !email) {
            setError('All fields are required!')
            return
        }

        const accountDataToSave = {
            username,
            password: 'TemporaryPassword123!',
            first_name,
            last_name,
            email,
            role,
        }

        onSave(accountDataToSave)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[8px] bg-[#F8F9FA] relative w-full max-w-2xl max-h-[90vh] px-[32px] py-[48px] overflow-y-auto rounded-xl drop-shadow-md"
            >
                <button
                    type="button" // Important so this doesn't submit the form
                    onClick={onClose}
                    className="absolute top-1 right-4 text-[#4A4A4A] hover:text-[#DC3545] text-3xl font-bold z-10 transition-colors"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <h2>Create Account</h2>

                {error && <p className="text-[#DC3545] text-sm m-0">{error}</p>}

                {/* Make sure your TextInput component accepts the 'disabled' prop! */}
                <TextInput
                    label="Username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                />

                <TextInput
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full"
                />

                <TextInput
                    label="Last Name"
                    type="text"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full"
                />

                <div className="flex flex-col gap-1 w-full text-left">
                    <label className="text-sm font-semibold text-gray-700">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="text-[#4A4A4A] w-full border-2 border-[#DDE2E5] rounded-4xl px-3 py-2 focus:outline-none focus:border-[#024C89] transition-colors"
                        required
                    >
                        <option value="" disabled>
                            Select a role...
                        </option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                    </select>
                </div>

                <TextInput
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                />

                <DefaultButton
                    type="submit"
                    className="w-full bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] self-center mt-4"
                >
                    Create
                </DefaultButton>
            </form>
        </div>
    )
}

export default AdminUserModal
