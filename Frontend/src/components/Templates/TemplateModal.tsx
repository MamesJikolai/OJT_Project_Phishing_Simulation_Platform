import DefaultButton from '../DefaultButton.tsx'
import TextInput from '../TextInput.tsx'
import type { EmailTemplate } from '../../types/models.ts'
import { useState, useEffect } from 'react'
import TextField from '../TextField.tsx'
import { useAuth } from '../../context/AuthContext.tsx'

interface TemplateModalProps {
    isOpen: boolean
    onClose: () => void
    mode: 'create' | 'view' | 'edit'
    initialData?: EmailTemplate | null
    onSave: (template: EmailTemplate) => void
}

function TemplateModal({
    isOpen,
    onClose,
    mode,
    initialData,
    onSave,
}: TemplateModalProps) {
    const { user } = useAuth()
    const [name, setName] = useState(initialData?.name || '')
    const [author, setAuthor] = useState(user?.username)
    const [sender_name, setSenderName] = useState(
        initialData?.sender_name || ''
    )
    const [subject, setSubject] = useState(initialData?.subject || '')
    const [body_html, setBody] = useState(initialData?.body_html || '')
    const [company_name, setCompanyName] = useState(
        initialData?.company_name || ''
    )
    const [error, setError] = useState('')

    const isViewOnly = mode === 'view'

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!name || !author || !sender_name || !subject || !body_html) {
            setError('All fields are required!')
            return
        }

        const templateDataToSave = {
            id: initialData?.id || Date.now(), // Generate a fake ID if creating
            name,
            author,
            sender_name,
            subject,
            body_html,
            company_name,
            created_at: initialData?.created_at || new Date().toLocaleString(),
        }

        onSave(templateDataToSave)
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

                <h2>
                    {mode === 'create' && 'Create Template'}
                    {mode === 'edit' && 'Edit Template'}
                    {mode === 'view' && 'Template Details'}
                </h2>

                {error && (
                    <div className="bg-rose-100 border border-rose-400 text-rose-700 px-2 py-1 my-2 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <TextInput
                    label="Name"
                    type="text"
                    placeholder="Template Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    disabled={isViewOnly}
                />

                <TextInput
                    label="Author"
                    type="text"
                    placeholder="Template Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full"
                    disabled
                />

                <TextInput
                    label="Sender"
                    type="text"
                    placeholder="Sender Name"
                    value={sender_name}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full"
                    disabled={isViewOnly}
                />

                <TextInput
                    label="Company Name"
                    type="text"
                    placeholder="Dummy Company Name"
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full"
                    disabled={isViewOnly}
                />

                <TextInput
                    label="Subject"
                    type="text"
                    placeholder="Email Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full"
                    disabled={isViewOnly}
                />

                <TextField
                    label="Body"
                    description={bodyDescription}
                    placeholder="Email Body"
                    value={body_html}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full"
                    disabled={isViewOnly}
                    rows={10}
                />

                {/* Hide the submit button completely if we are just viewing */}
                {!isViewOnly && (
                    <DefaultButton
                        type="submit"
                        className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] self-center mt-4"
                    >
                        {mode === 'create' ? 'Create' : 'Save Changes'}
                    </DefaultButton>
                )}
            </form>
        </div>
    )
}

export default TemplateModal

const availableVariables = [
    '{{ target_name }}',
    '{{ target_email }}',
    '{{ target_department }}',
    '{{ phishing_link }}',
    '{{ company_name }}',
    '{{ campaign_name }}',
]

const bodyDescription = (
    <div className="flex flex-col gap-4 mt-2">
        <div>
            <span className="font-medium text-[#121212] block mb-2">
                Available variables:
            </span>
            <div className="flex flex-wrap gap-2">
                {availableVariables.map((variable) => (
                    <code
                        key={variable}
                        className="bg-gray-100 border border-gray-200 text-gray-800 px-2 py-1 rounded-md font-mono text-xs"
                    >
                        {variable}
                    </code>
                ))}
            </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
            <span className="font-medium text-[#121212] block mb-1">
                Clickable link with custom text:
            </span>
            <p className="mb-1 text-[#4a4a4a]">
                Use{' '}
                <code className="bg-[#F8F9FA] px-1 py-0.5 rounded border border-gray-200 font-mono text-xs">
                    [display text](url)
                </code>{' '}
                syntax.
            </p>
            <p className="text-[#4a4a4a] text-xs mt-2 italic">
                e.g. Click{' '}
                <code className="bg-[#F8F9FA] px-1 py-0.5 rounded border border-gray-200 font-mono text-xs not-italic">
                    [here]({'{{ phishing_link }}'})
                </code>{' '}
                to verify your account
            </p>
        </div>
    </div>
)
