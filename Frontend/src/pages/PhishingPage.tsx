import { useEffect } from 'react'

// testing hash
const tempUser = [
    {
        id: 1,
        name: 'James Mikolai Salazar',
        email: 'jmsalazar@mymail.mapua.edu.ph',
        nameHash: '333ed8ce347a9e5c8d12912eb1d8f68e',
        time: '',
    },
]

function PhishingPage() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const userHash = params.get('id')
        const user = tempUser.find((u) => u.nameHash === userHash)

        if (user) {
            console.log(user.name, 'has clicked the link!')
        }
    })

    const handleNavigate = () => {
        localStorage.removeItem('userRole')
        window.location.href = '/'
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 h-screen bg-[#F8F9FA]">
            <h1>Wait! This was a Phishing Simulation</h1>
            <p>
                Don't worry, your data is safe. However, a real attacker could
                have used that link to access your
                <strong>
                    {' '}
                    personal details, address, and credit information.
                </strong>
            </p>
            <p className="text-sm">
                Your security is a priority. Please follow the link below to
                complete your <strong>required</strong> phishing awareness
                module.
            </p>
            <button
                onClick={handleNavigate}
                className="text-[#FFFAFA] bg-[#024C89] hover:bg-[#3572A1] px-4 py-2 cursor-pointer"
            >
                Go to Training Portal
            </button>
        </div>
    )
}

export default PhishingPage
