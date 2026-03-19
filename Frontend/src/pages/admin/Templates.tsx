import { useState, useCallback } from 'react'
import DefaultButton from '../../components/DefaultButton'
import Message from '../../components/Message'
import TemplateModal from '../../components/Templates/TemplateModal'
import EmailTemplateCard from '../../components/Templates/EmailTemplateCard'
import { emailTemplate } from '../../assets/dummydata/emailTemplate'

export type Template = {
    id: number
    name: string
    author: string
    subject: string
    body: string
    link: string
    created: string
}

function Templates() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>(
        'create'
    )
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    )

    const openCreateModal = useCallback(() => {
        setModalMode('create')
        setSelectedTemplate(null)
        setIsModalOpen(true)
    }, [])

    const openViewModal = useCallback((templateData: Template) => {
        setModalMode('view')
        setSelectedTemplate(templateData)
        setIsModalOpen(true)
    }, [])

    const openEditModal = useCallback((templateData: Template) => {
        setModalMode('edit')
        setSelectedTemplate(templateData)
        setIsModalOpen(true)
    }, [])

    const handleSaveTemplate = () => {
        if (modalMode === 'edit') {
            //
        } else if (modalMode === 'create') {
            //
        }
    }

    const handleDeleteTemplate = (templateData: Template) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${templateData.name}"?`
        )
        if (confirmDelete) {
            //
        }
    }

    return (
        <div className="flex flex-col items-start m-8">
            <Message text="Templates" />

            <DefaultButton
                children="New Template"
                onClick={openCreateModal}
                className="bg-[#024C89] hover:bg-[#3572A1] text-[#F8F9FA]"
            />

            <EmailTemplateCard
                emailTemplate={emailTemplate}
                openViewModal={openViewModal}
                openEditModal={openEditModal}
                handleDeleteTemplate={handleDeleteTemplate}
            />

            {isModalOpen && (
                <TemplateModal
                    key={
                        selectedTemplate ? selectedTemplate.id : 'create-modal'
                    }
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mode={modalMode}
                    initialData={selectedTemplate}
                    onSave={handleSaveTemplate} // 3. Pass the function down to the modal!
                />
            )}
        </div>
    )
}

export default Templates
