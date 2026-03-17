type DefaultButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function DefaultButton({
    className = '',
    children,
    ...props
}: DefaultButtonProps) {
    return (
        <button
            className={`${className} rounded-[8px] px-[16px] py-[4px] cursor-pointer`}
            {...props}
        >
            {children}
        </button>
    )
}

export default DefaultButton
