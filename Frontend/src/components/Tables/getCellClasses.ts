export default function getCellClasses(cell: any) {
    const cellValue = String(cell.getValue()).toLowerCase()

    if (cell.column.id.toLowerCase() === 'role') {
        if (cellValue === 'admin') {
            return 'text-[#00A3AD] font-bold'
        } else if (cellValue === 'hr') {
            return 'text-[#C5A059] font-bold'
        }
    } else if (cell.column.id.toLowerCase() === 'status') {
        if (cellValue === 'completed') {
            return 'text-[#28A745] font-bold'
        } else if (cellValue === 'cancelled') {
            return 'text-[#DC3545] font-bold'
        } else if (cellValue === 'active') {
            return 'text-[#17A2B8] font-bold'
        } else if (cellValue === 'draft') {
            return 'text-[#FFC107] font-bold'
        }
    } else if (cell.column.id.toLowerCase() === 'email status') {
        if (cellValue === 'sent') {
            return 'text-[#28A745] font-bold'
        } else if (cellValue === 'failed') {
            return 'text-[#DC3545] font-bold'
        }
    }

    // Always return an empty string if no conditions are met
    return ''
}
