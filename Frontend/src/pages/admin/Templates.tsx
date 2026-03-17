import DefaultButton from '../../components/DefaultButton'
import Message from '../../components/Message'

const emailTemplate = [
    {
        name: 'TEST',
        author: 'IT Support',
        subject: 'Action Required: Your Password Expires in 24 Hours',
        body: 'Dear User,\n\nYour network password is set to expire in 24 hours. To avoid service disruption, please click the link below to sync your credentials.\n\n[Click Here to Update Password]\n\nThank you,\n\nIT Department',
        link: '',
        created: '03-16-26',
    },
    {
        name: 'VPN_ACCESS',
        author: 'IT Helpdesk',
        subject: 'Urgent: VPN Access Verification Required',
        body: 'Dear User,\n\nWe detected a login attempt to the VPN from an unrecognized device. Please verify your access immediately to avoid temporary suspension.\n\n[Verify VPN Access]\n\nRegards,\n\nIT Helpdesk',
        link: '',
        created: '03-17-26',
    },
    {
        name: 'MAILBOX_LIMIT',
        author: 'System Administrator',
        subject: 'Warning: Mailbox Storage Limit Reached',
        body: 'Dear User,\n\nYour mailbox has reached its storage limit. You may not be able to send or receive new messages.\n\nPlease click below to increase your storage quota.\n\n[Upgrade Mailbox]\n\nThank you,\n\nAdmin Team',
        link: '',
        created: '03-17-26',
    },
    {
        name: 'SECURITY_ALERT',
        author: 'Security Team',
        subject: 'Security Alert: Suspicious Login Attempt Detected',
        body: 'Dear User,\n\nA suspicious login attempt was detected on your account. If this was not you, please secure your account immediately.\n\n[Secure My Account]\n\nStay safe,\n\nSecurity Team',
        link: '',
        created: '03-17-26',
    },
    {
        name: 'ACCOUNT_UPDATE',
        author: 'HR Department',
        subject: 'Reminder: Update Your Employee Information',
        body: 'Dear Employee,\n\nOur records indicate that your profile information is incomplete or outdated. Please review and update your details as soon as possible.\n\n[Update Profile]\n\nBest regards,\n\nHR Department',
        link: '',
        created: '03-17-26',
    },
    {
        name: 'PAYROLL_NOTICE',
        author: 'Finance Team',
        subject: 'Important: Payroll Issue Requires Your Attention',
        body: 'Dear Employee,\n\nWe encountered an issue processing your latest payroll. Kindly confirm your banking details to avoid delays.\n\n[Confirm Details]\n\nThank you,\n\nFinance Team',
        link: '',
        created: '03-17-26',
    },
]

function Templates() {
    const handleCreateTemplate = () => {
        //
    }

    return (
        <div className="flex flex-col items-start m-8">
            <Message text="Templates" />

            <DefaultButton
                children="New Template"
                onClick={handleCreateTemplate}
                className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA]"
            />

            <div className="flex flex-row flex-wrap justify-center items-start gap-8 mt-8 mx-auto">
                {emailTemplate.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-[#F8F9FA] px-8 py-4 rounded-xl drop-shadow-md"
                    >
                        <div className="flex flex-col gap-2 pb-2 border-b-2 border-[#DDE2E5]">
                            <h3>{item.name}</h3>
                            <p className="text-[12px]">
                                From:{' '}
                                <span className="font-bold">{item.author}</span>
                            </p>
                            <div className="bg-[#DDE2E5] text-[14px] h-fit w-[400px] px-4 py-2 rounded-xl">
                                <p>{item.subject}</p>
                                <br />
                                <p className="whitespace-pre-wrap">
                                    {item.body}
                                </p>
                            </div>
                            <p className="text-[12px]">
                                Created {item.created}
                            </p>
                        </div>
                        <div className="flex flex-row justify-around text-[12px]">
                            <DefaultButton
                                children="View"
                                className="text-[#17A2B8] hover:text-[#4ECFE0] font-bold"
                            />
                            <DefaultButton
                                children="Edit"
                                className="text-[#28A745] hover:text-[#45C664] font-bold"
                            />
                            <DefaultButton
                                children="Delete"
                                className="text-[#DC3545] hover:text-[#FF6B6B] font-bold"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Templates
