import { useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

interface LessonVideoPlayerProps {
    url: string
    onMilestoneReached?: () => void
}

function LessonVideoPlayer({
    url,
    onMilestoneReached,
}: LessonVideoPlayerProps) {
    const hasReached90 = useRef(false)

    useEffect(() => {
        hasReached90.current = false
    }, [url])

    return (
        <div className="flex flex-col w-[90%] aspect-video mx-auto">
            {/* <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe> */}
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls
                onEnded={() => console.log('Video ended')}
                onProgress={(state) => {
                    if (state.played >= 0.9 && !hasReached90.current) {
                        console.log('Reached 90% of the video')
                        hasReached90.current = true

                        if (onMilestoneReached) {
                            onMilestoneReached()
                        }
                    }
                }}
            />
        </div>
    )
}

export default LessonVideoPlayer
