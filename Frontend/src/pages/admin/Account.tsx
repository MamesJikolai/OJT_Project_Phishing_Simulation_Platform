import { useState } from 'react'
import Message from '../../components/Message'
import TextInput from '../../components/TextInput'
import DefaultButton from '../../components/DefaultButton'
import { users } from '../../assets/users'

function Account() {
    const userId = localStorage.getItem('userId')
    const user = users.find((u) => u.id === Number(userId))
    const [username] = useState(user?.username || '')
    const [role] = useState(user?.role || '')
    const [firstName, setFirstName] = useState(user?.firstName || '')
    const [lastName, setLastName] = useState(user?.lastName || '')
    const [email, setEmail] = useState(user?.email || '')
    const [organization, setOrganization] = useState(user?.organization || '')

    const handleSubmit = () => {
        //
    }

    const handleRoleColor = () => {
        if (role === 'admin') {
            return 'bg-[#00A3AD]'
        } else if (role === 'hr') {
            return 'bg-[#C5A059]'
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('userRole')
        window.location.href = '/home'
    }

    return (
        <div className="flex flex-col items-start m-8">
            <Message text="Account" />

            <div className="flex flex-col gap-4 bg-[#FEF9FA] w-[90%] max-w-[600px] mx-auto px-[48px] py-[32px] rounded-xl drop-shadow-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-row gap-8">
                        <p>
                            USERNAME
                            <br />
                            <span className="font-bold">{username}</span>
                        </p>
                        <p>
                            ROLE
                            <br />
                            <span
                                className={`${handleRoleColor()} text-[#F8F9FA] px-3 py-1 rounded-xl`}
                            >
                                {role}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 py-8 border-[#DDE2E5] border-y-1">
                        <TextInput
                            label="First Name"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full"
                        />
                        <TextInput
                            label="Last Name"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full"
                        />
                        <TextInput
                            label="Email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                        />
                        <TextInput
                            label="Organization"
                            type="text"
                            placeholder="Organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            className="w-full"
                        />
                        <button
                            type="submit"
                            className="text-[#F8F9FA] bg-[#024C89] hover:bg-[#3572A1] rounded-[8px] px-[16px] py-[4px] cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>

                    <DefaultButton
                        children="Sign Out"
                        onClick={handleLogout}
                        className="bg-[#DC3545] hover:bg-[#FF6B6B] text-[#F8F9FA]"
                    />
                </form>
            </div>
        </div>
    )
}

export default Account
