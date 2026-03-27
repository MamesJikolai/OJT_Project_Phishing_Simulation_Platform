import { useState } from 'react'
import DefaultButton from '../DefaultButton'
import TextInput from '../TextInput'
import { apiService } from '../../services/userService'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handlePasswordSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        setPasswordError('')

        // if (
        //     !passwordData.current_password ||
        //     !passwordData.new_password ||
        //     !passwordData.confirm_password
        // ) {
        //     setPasswordError('All password fields are required.')
        //     return
        // } else if (
        //     passwordData.new_password !== passwordData.confirm_password
        // ) {
        //     setPasswordError('New passwords do not match.')
        //     return
        // }

        try {
            setIsChangingPassword(true)

            await apiService.changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password,
            })

            setPasswordSuccess('Password changed successfully!')

            setTimeout(() => {
                onClose()
            }, 1000)
        } catch (error: any) {
            if (error.response?.data?.error) {
                setPasswordError(error.response.data.error)
            } else {
                setPasswordError(
                    'An unexpected error occurred. Please try again.'
                )
            }
        } finally {
            setIsChangingPassword(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col bg-[#F8F9FA] relative w-full max-w-2xl max-h-[90vh] px-[32px] py-[48px] overflow-y-auto rounded-xl drop-shadow-md"
            >
                <DefaultButton
                    type="button"
                    onClick={onClose}
                    className="absolute top-1 right-4 text-[#4A4A4A] hover:text-[#DC3545] text-3xl font-bold z-10 transition-colors"
                    aria-label="Close modal"
                >
                    &times;
                </DefaultButton>

                {/* ERROR MESSAGE DISPLAY */}
                {passwordError && (
                    <div className="bg-rose-100 border border-rose-400 text-rose-700 px-2 py-1 my-2 rounded relative">
                        <span className="block sm:inline">{passwordError}</span>
                    </div>
                )}

                {/* SUCCESS MESSAGE DISPLAY */}
                {passwordSuccess && (
                    <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-2 py-1 my-2 rounded relative">
                        <span className="block sm:inline">
                            {passwordSuccess}
                        </span>
                    </div>
                )}

                <TextInput
                    label="Current Password"
                    name="current_password"
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full"
                    disabled={isChangingPassword || !!passwordSuccess}
                />

                <TextInput
                    label="New Password"
                    name="new_password"
                    type="password"
                    placeholder="New Password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full"
                    disabled={isChangingPassword || !!passwordSuccess}
                />

                <TextInput
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full"
                    disabled={isChangingPassword || !!passwordSuccess}
                />

                <DefaultButton
                    type="submit"
                    className="text-[#F8F9FA] bg-[#024C89] hover:bg-[#3572A1] disabled:opacity-50 mt-4"
                    disabled={isChangingPassword || !!passwordSuccess}
                >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                </DefaultButton>
            </form>
        </div>
    )
}

export default ChangePasswordModal
