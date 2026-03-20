import SmallButton from './SmallButton'

interface CourseCardProps {
    title: string
    caption: string
    image?: string
    customCSS?: string
}

function CourseCard({ title, caption, customCSS }: CourseCardProps) {
    return (
        <div
            className={`flex flex-col bg-[#F8F9FA] w-[300px] rounded-2xl p-4 shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 ${customCSS}`}
        >
            <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3572A1] to-[#024C89]" />
            </div>
            <div className="flex flex-col grow mt-3">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm mt-1 grow">{caption}</p>
            </div>
            <SmallButton label="Start Lesson" />
        </div>
    )
}
export default CourseCard
