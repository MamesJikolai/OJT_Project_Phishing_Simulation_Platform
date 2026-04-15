import { useState, useEffect } from 'react'
import DefaultButton from '../components/DefaultButton'
import { apiService } from '../services/userService' // Added import
import type { Landing } from '../types/models'

interface TemplateProps {
    landing_title: string
    landing_message1: string
    landing_message2?: string
    landing_button_text: string
    logo_url?: string
    updated_at?: string
}

function PhishingPage({
    previewTemplate,
}: {
    previewTemplate?: TemplateProps
}) {
    const [template, setTemplate] = useState<TemplateProps | null>(null)
    const [isLoading, setIsLoading] = useState(!previewTemplate)

    useEffect(() => {
        if (previewTemplate) return

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        const queryParams = new URLSearchParams(window.location.search)
        const token = queryParams.get('token')

        if (token) {
            localStorage.setItem('lms_token', token)
            // Optional: You could even remove it from the URL here so the user doesn't copy/share it
            // window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [previewTemplate])

    useEffect(() => {
        if (previewTemplate) return

        const fetchTemplate = async () => {
            try {
                const data = await apiService.getSingleton<Landing>('settings')
                setTemplate({
                    landing_title: data.landing_title,
                    landing_message1: data.landing_message1,
                    landing_message2: data.landing_message2,
                    landing_button_text: data.landing_button_text,
                    logo_url: data.logo_url,
                    updated_at: data.updated_at || new Date().toLocaleString(),
                })
            } catch (err) {
                console.error('Failed to fetch phishing template', err)

                setTemplate({
                    landing_title: 'Wait! This was a Phishing Simulation',
                    landing_message1:
                        "Don't worry, your data is safe. However, a real attacker could have used that link to access your personal details, address, and credit information.",
                    landing_message2:
                        'Your security is a priority. Please follow the link below to complete your required phishing awareness module.',
                    landing_button_text: 'Go to Training Portal',
                    logo_url: '',
                    updated_at: new Date().toLocaleString(),
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTemplate()
    }, [previewTemplate])

    const handleNavigate = () => {
        window.location.href = '/home'
    }

    const displayTemplate = previewTemplate || template

    if (isLoading || !displayTemplate) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 bg-[#F8F9FA] px-8 text-center ${
                previewTemplate ? 'h-full' : 'h-screen'
            }`}
        >
            {displayTemplate.logo_url && (
                <img
                    src={displayTemplate.logo_url}
                    alt="Logo"
                    className="max-h-24 object-contain"
                />
            )}
            <h1>{displayTemplate.landing_title}</h1>
            <p>{displayTemplate.landing_message1}</p>
            {displayTemplate.landing_message2 && (
                <p className="text-sm">{displayTemplate.landing_message2}</p>
            )}
            <DefaultButton
                children={displayTemplate.landing_button_text}
                onClick={handleNavigate}
                className="text-[#FFFAFA] bg-[#024C89] hover:bg-[#3572A1]"
            />
        </div>
    )
}

export default PhishingPage
