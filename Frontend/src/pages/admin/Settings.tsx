import Message from '../../components/Message.tsx'
import PlatformConfigurationForm from '../../components/Settings/PlatformConfigurationForm.tsx'
import SMTPConfigurationForm from '../../components/Settings/SMTPConfigurationForm.tsx'
import AdminUsers from '../../components/Settings/AdminUsers.tsx'

function Settings() {
    return (
        <div className="flex flex-col items-start p-4 md:p-8 w-full box-border">
            <Message text="Settings" />

            <div className="flex flex-row justify-center flex-wrap gap-4 md:gap-8 w-full">
                <PlatformConfigurationForm />

                <SMTPConfigurationForm />

                <AdminUsers />
            </div>
        </div>
    )
}

export default Settings
