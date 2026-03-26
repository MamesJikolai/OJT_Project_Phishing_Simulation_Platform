import DefaultButton from '../DefaultButton.tsx'
import TextInput from '../TextInput.tsx'
import type { EmailTemplate, Campaign } from '../../types/models.ts'
import { useState, useEffect } from 'react'
import { apiService } from '../../services/userService.ts'
import TextField from '../TextField.tsx'

interface CampaignModalProps {
    isOpen: boolean
    onClose: () => void
    mode: 'create' | 'edit'
    initialData?: Campaign | null
    onSave: (campaign: Partial<Campaign>, file: File | null) => void
}

const getInitialDate = (dateString?: string | null) => {
    if (!dateString) return ''

    const d = new Date(dateString)

    // Fallback if the date is invalid
    if (isNaN(d.getTime())) return ''

    // Extract local time parts and pad them with leading zeros
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    // Returns exact format required by <input type="datetime-local">
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

function CampaignModal({
    isOpen,
    onClose,
    mode,
    initialData,
    onSave,
}: CampaignModalProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(
        initialData?.description || ''
    )
    const [status, setStatus] = useState(
        initialData?.status?.toLowerCase() || 'Draft'
    )
    const [date, setDate] = useState(getInitialDate(initialData?.scheduled_at))
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
        initialData?.email_template
            ? String(initialData.email_template_name)
            : ''
    )
    const [availableTemplates, setAvailableTemplates] = useState<
        EmailTemplate[]
    >([])
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isOpen) return

        const fetchTemplates = async () => {
            setIsLoadingTemplates(true)
            try {
                // Assuming your endpoint for templates is 'templates' or 'email-templates'
                // Update this string to match your exact DRF route!
                const data = await apiService.getAll<EmailTemplate>('templates')
                setAvailableTemplates(data)
            } catch (err) {
                console.error('Failed to load templates:', err)
            } finally {
                setIsLoadingTemplates(false)
            }
        }

        fetchTemplates()
    }, [isOpen])

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!name || !status) {
            setError('Name, status, and date are required!')
            return
        }
        if (mode === 'create' && !file) {
            setError('A target CSV file is required to create a campaign.')
            return
        }

        const formattedDateForBackend = date
            ? new Date(date).toISOString()
            : null

        const campaignDataToSave: Partial<Campaign> = {
            ...(initialData && { id: initialData.id }),
            name,
            status,
            scheduled_at: formattedDateForBackend,
            email_template: selectedTemplateId
                ? Number(selectedTemplateId)
                : null,
        }

        // 3. Send it back up to the parent!
        onSave(campaignDataToSave, file)
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
                    {mode === 'create' && 'Create Campaign'}
                    {mode === 'edit' && 'Edit Campaign'}
                </h2>

                {error && <p className="text-[#DC3545] text-sm m-0">{error}</p>}

                <TextInput
                    label="Name"
                    type="text"
                    placeholder="Campaign Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                />

                <TextField
                    label="Description"
                    placeholder="Campaign Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full"
                    rows={5}
                />

                <label>
                    <span className="font-bold text-[#121212]">Status</span>
                    <br />
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="text-[#4A4A4A] bg-#F8F9FA border-2 border-[#DDE2E5] focus:outline-[#024C89] active:outline-[#024C89] w-full max-w-2xl rounded-4xl px-4 py-1 disabled:bg-gray-200 disabled:opacity-70"
                    >
                        <option value="" disabled hidden>
                            -- Select an option --
                        </option>
                        <option value="Draft">Draft</option>
                        <option value="Running">Running</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>

                <TextInput
                    label="Date"
                    type="datetime-local"
                    placeholder="Campaign Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                />

                {/* <TextInput
                    label="Target"
                    type="text"
                    placeholder="Campaign Target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full"
                /> */}

                <label className="flex flex-col gap-1">
                    <span className="text-[#121212] font-medium">
                        Email Template
                    </span>
                    <select
                        name="template"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        disabled={isLoadingTemplates}
                        className="text-[#4A4A4A] bg-#F8F9FA border-2 border-[#DDE2E5] focus:outline-[#024C89] active:outline-[#024C89] w-full rounded-4xl px-4 py-2 disabled:bg-gray-200 disabled:opacity-70"
                    >
                        <option value="">
                            {isLoadingTemplates
                                ? 'Loading templates...'
                                : '-- Select a Template --'}
                        </option>

                        {availableTemplates.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </label>

                <TextInput
                    label="Upload Targets CSV"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full cursor-pointer"
                />

                <DefaultButton
                    type="submit"
                    className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] self-center mt-4"
                >
                    {mode === 'create' ? 'Create' : 'Save Changes'}
                </DefaultButton>
            </form>
        </div>
    )
}

export default CampaignModal
