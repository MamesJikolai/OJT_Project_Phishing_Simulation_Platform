import Message from '../../components/Message.tsx'
import CampaignModal from '../../components/Campaigns/CampaignModal.tsx'
import DefaultButton from '../../components/DefaultButton.tsx'

import { useState, useCallback } from 'react'
import useMockData from '../../hook/useMockData.ts'
import BasicTable from '../../components/Tables/BasicTable.tsx'
import type { ColumnDef } from '@tanstack/react-table'

export type Campaign = {
    id: number
    name: string
    status: string
    target: string
    date: string
    completion: string
    subject: string
    body: string
}

function Campaigns() {
    const { data, setData, error } = useMockData<Campaign>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
        null
    )

    const openCreateModal = useCallback(() => {
        setModalMode('create')
        setSelectedCampaign(null)
        setIsModalOpen(true)
    }, [])

    const openEditModal = useCallback((campaignData: Campaign) => {
        setModalMode('edit')
        setSelectedCampaign(campaignData)
        setIsModalOpen(true)
    }, [])

    const deleteRowData = useCallback(
        (campaignData: Campaign) => {
            const confirmDelete = window.confirm(
                `Are you sure you want to delete "${campaignData.name}"?`
            )
            if (confirmDelete) {
                setData((prevData: Campaign[]) =>
                    prevData.filter((item) => item.id !== campaignData.id)
                )
            }
        },
        [setData]
    ) // setData goes in here because the function uses it

    const handleLaunchCampaign = () => {
        //
    }

    const handleSaveCampaign = (savedCampaign: Campaign) => {
        if (modalMode === 'edit') {
            // Find the old campaign in the array and replace it with the new one
            setData((prevData: Campaign[]) =>
                prevData.map((item) =>
                    item.id === savedCampaign.id ? savedCampaign : item
                )
            )
        } else if (modalMode === 'create') {
            // Add the brand new campaign to the top of the list
            setData((prevData: Campaign[]) => [savedCampaign, ...prevData])
        }
    }

    // Define table columns
    const columns: ColumnDef<Campaign, any>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'target', header: 'Target' },
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'completion', header: 'Completion' },
        {
            id: 'actions',
            header: 'Actions',
            cell: (info) => {
                const campaignData = info.row.original

                return (
                    <div className="flex flex-row gap-2 text-[12px]">
                        <button
                            onClick={handleLaunchCampaign}
                            className="text-[#F8F9FA] hover:bg-[#28A745] bg-[#45C664] px-2 rounded-md py-1 font-bold cursor-pointer"
                        >
                            ▶︎ Launch
                        </button>
                        <button
                            onClick={() => openEditModal(campaignData)}
                            className="hover:text-[#17A2B8] text-[#4ECFE0] font-bold cursor-pointer"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteRowData(campaignData)}
                            className="hover:text-[#DC3545] text-[#FF6B6B] font-bold cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                )
            },
        },
    ]

    if (error) return <div>{error}</div>
    if (data.length === 0) return <div>Loading...</div>

    return (
        <div className="flex flex-col items-start m-8">
            <Message text="Campaigns" />

            {/* The Create button now lives here, passing control to the states */}
            <DefaultButton
                className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA] mb-[16px] mt-[16px]"
                onClick={openCreateModal}
                children="Create Campaign"
            />

            <BasicTable data={data} columns={columns} tableStyle="w-full" />

            {isModalOpen && (
                <CampaignModal
                    key={
                        selectedCampaign ? selectedCampaign.id : 'create-modal'
                    }
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mode={modalMode}
                    initialData={selectedCampaign}
                    onSave={handleSaveCampaign} // 3. Pass the function down to the modal!
                />
            )}
        </div>
    )
}

export default Campaigns
