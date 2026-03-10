interface DefaultButtonProps {
    label: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    customCSS?: string
}

function DefaultButton({ label, onClick, customCSS }: DefaultButtonProps) {
    return (
        <button
            className={`text-[#F8F9FA] bg-[#024C89] hover:bg-[#3572A1] rounded-[8px] px-[16px] py-[4px] cursor-pointer ${customCSS}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default DefaultButton
