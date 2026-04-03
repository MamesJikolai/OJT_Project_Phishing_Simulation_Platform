interface AnalyticsCardsProps {
    text: string
    item: number
}

function AnalyticsCards({ text, item }: AnalyticsCardsProps) {
    return (
        <div className="flex flex-col gap-2 bg-[#F8F9FA] w-[100px] rounded-2xl p-4 shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 drop-shadow-md">
            <p className="text-[32px]">{item}</p>
            <p className="text-[12px]">{text}</p>
        </div>
    )
}

export default AnalyticsCards
