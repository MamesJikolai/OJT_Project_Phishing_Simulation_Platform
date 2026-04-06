import { useState, useEffect } from 'react'
import DefaultButton from '../DefaultButton.tsx'
import { apiService } from '../../services/userService.ts'
import type { Campaign } from '../../types/models.ts'
import TextInput from '../TextInput.tsx'

interface CsvUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadSuccess: () => void
}

function CsvUploadModal({
    isOpen,
    onClose,
    onUploadSuccess,
}: CsvUploadModalProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaignId, setSelectedCampaignId] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isOpen) return
        apiService
            .getAll<Campaign>('campaigns')
            .then(setCampaigns)
            .catch((err) => console.error('Failed to load campaigns', err))
    }, [isOpen])

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!selectedCampaignId || !file) {
            setError('Please select a campaign and a CSV file.')
            return
        }

        try {
            setIsUploading(true)
            const result = await apiService.uploadCsv(selectedCampaignId, file)
            alert(
                `Success! Created: ${result.created}, Skipped (Duplicates): ${result.skipped}`
            )
            onUploadSuccess()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload CSV.')
        } finally {
            setIsUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-[#F8F9FA] relative w-full max-w-md p-8 rounded-xl drop-shadow-md"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-4 text-2xl hover:text-red-500"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold">Upload Targets via CSV</h2>

                {error && <p className="text-[#DC3545] text-sm m-0">{error}</p>}

                <label className="flex flex-col gap-1">
                    <span className="font-medium">Select Campaign</span>
                    <select
                        value={selectedCampaignId}
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                        className="text-[#4A4A4A] bg-#F8F9FA border-2 border-[#DDE2E5] focus:outline-[#024C89] active:outline-[#024C89] w-full max-w-2xl rounded-4xl px-4 py-1 disabled:bg-gray-200 disabled:opacity-70"
                    >
                        <option value="" disabled>
                            -- Select a Campaign --
                        </option>
                        {campaigns.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <TextInput
                    label="CSV File"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full"
                />

                <DefaultButton
                    type="submit"
                    disabled={isUploading}
                    className="bg-[#024C89] text-white mt-4"
                >
                    {isUploading ? 'Uploading...' : 'Upload Targets'}
                </DefaultButton>
            </form>
        </div>
    )
}

export default CsvUploadModal
