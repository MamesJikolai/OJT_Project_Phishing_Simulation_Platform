function Message({ text }: { text: string }) {
    return (
        <h1 className="font-bold text-4xl text-gray-800 w-[100%] mb-3 pb-4">
            {text}
        </h1>
    )
}

export default Message
