import { Icons } from '../../assets/icons'
import type { Lesson } from '../../types/models'
import { getEmbedUrl } from '../../utils/getEmbedUrl'
import CourseDetailsField from './CourseDetailsField'
import CourseDetailsInput from './CourseDetailsInput'
import { useState } from 'react'
import LessonVideoPlayer from './LessonVideoPlayer'

interface AdminLessonCardProps {
    item: Lesson
    index: number
    isOpen: boolean
    onToggle: () => void
    onLessonChange: (index: number, field: keyof Lesson, value: string) => void
    onLessonDelete: (index: number) => void
}

function AdminLessonCard({
    item,
    index,
    isOpen,
    onToggle,
    onLessonChange,
    onLessonDelete,
}: AdminLessonCardProps) {
    const embedUrl = getEmbedUrl(item.video_url)
    const [contentToggle, setContentToggle] = useState(
        Boolean(item.content_html && item.content_html.trim() !== '')
    )

    return (
        <div className="bg-[#F8F9FA] rounded-xl px-8 py-6 w-full shadow-sm border border-gray-100">
            {/* Lesson Header */}
            <div
                onClick={onToggle}
                className="flex flex-row justify-between items-center cursor-pointer"
            >
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <CourseDetailsInput
                        type="text"
                        value={item.title || ''}
                        onChange={(e) =>
                            onLessonChange(index, 'title', e.target.value)
                        }
                        className="font-bold text-4xl text-[#121212] w-full"
                    />
                </div>
                <img
                    title="Delete Lesson"
                    src={Icons.deleteDefault}
                    onClick={(e) => {
                        e.stopPropagation()
                        onLessonDelete(index)
                    }}
                    className="w-[24px] h-[24px] mx-4"
                />

                <img
                    src={isOpen ? Icons.iconCollapse : Icons.iconExpand}
                    onClick={onToggle}
                    className="w-[24px] h-[24px]"
                />
            </div>

            {/* Lesson Contents */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'grid-rows-[1fr] opacity-100 mt-4'
                        : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
            >
                <div className="flex flex-col gap-4 overflow-hidden">
                    {/* Lesson Description */}
                    <CourseDetailsField
                        value={item.description || ''}
                        placeholder="Lesson Description"
                        onChange={(e) =>
                            onLessonChange(index, 'description', e.target.value)
                        }
                        className="w-full"
                        rows={8}
                    />

                    {/* Embedded Video */}
                    {(embedUrl || embedUrl.trim() !== '') && (
                        <LessonVideoPlayer url={embedUrl} />
                    )}

                    {/* Video URL Input */}
                    <CourseDetailsInput
                        type="text"
                        placeholder="Video URL"
                        value={item.video_url || ''}
                        onChange={
                            (e) =>
                                onLessonChange(
                                    index,
                                    'video_url',
                                    e.target.value
                                ) // Update this
                        }
                        className="w-full"
                    />

                    {/* Additional Lesson Content */}
                    <CourseDetailsInput
                        type="checkbox"
                        label="Add More Content"
                        onChange={(e) => setContentToggle(e.target.checked)}
                        checked={contentToggle}
                        className="accent-[#3572A1] mr-1 cursor-pointer"
                    />
                    {contentToggle && (
                        <>
                            <CourseDetailsField
                                value={item.content_html || ''}
                                placeholder="More Lesson Content"
                                onChange={(e) =>
                                    onLessonChange(
                                        index,
                                        'content_html',
                                        e.target.value
                                    )
                                }
                                className="w-full"
                                rows={8}
                            />

                            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                                <span className="font-medium text-[#121212] block mb-1">
                                    Clickable link with custom text:
                                </span>
                                <p className="mb-1 text-[#4a4a4a]">
                                    Use{' '}
                                    <code className="bg-[#F8F9FA] px-1 py-0.5 rounded border border-gray-200 font-mono text-xs">
                                        [display text](url)
                                    </code>{' '}
                                    syntax.
                                </p>
                                <p className="text-[#4a4a4a] text-xs mt-2 italic">
                                    e.g. For more information,{' '}
                                    <code className="bg-[#F8F9FA] px-1 py-0.5 rounded border border-gray-200 font-mono text-xs not-italic">
                                        [Read more]({'content link'})
                                    </code>{' '}
                                    on this topic
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminLessonCard
