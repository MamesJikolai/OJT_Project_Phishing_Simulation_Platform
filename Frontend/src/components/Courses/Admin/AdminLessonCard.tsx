import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from '../../../assets/icons'
import type { Lesson } from '../../../types/models'
import { getEmbedUrl } from '../../../utils/getEmbedUrl'
import CourseDetailsField from '../CourseDetailsField'
import CourseDetailsInput from '../CourseDetailsInput'
import LessonVideoPlayer from '../LessonVideoPlayer'

interface AdminLessonCardProps {
    item: Lesson & { _tempId?: string } // Support for unsaved lessons
    index: number
    isOpen: boolean
    sortableId: string
    onToggle: () => void
    onLessonChange: (index: number, field: keyof Lesson, value: string) => void
    onLessonDelete: (index: number) => void
}

function AdminLessonCard({
    item,
    index,
    isOpen,
    sortableId,
    onToggle,
    onLessonChange,
    onLessonDelete,
}: AdminLessonCardProps) {
    const embedUrl = getEmbedUrl(item.video_url)
    const [contentToggle, setContentToggle] = useState(
        Boolean(item.content_html && item.content_html.trim() !== '')
    )

    // dnd-kit hooks
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: sortableId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-row bg-[#F8F9FA] rounded-xl w-full shadow-sm border border-gray-100 z-10 relative"
        >
            {/* Drag Handle (Left Side) */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center px-4 cursor-grab active:cursor-grabbing border-r border-gray-200 hover:bg-gray-200 rounded-l-xl transition-colors"
                title="Drag to reorder"
            >
                {/* 6-dot grip icon */}
                <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M4 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5.5-11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 px-6 py-6 overflow-hidden">
                {/* Lesson Header */}
                <div
                    onClick={onToggle}
                    className="flex flex-row justify-between items-center cursor-pointer"
                >
                    <div
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                        className="w-[24px] h-[24px] mx-4 cursor-pointer hover:opacity-75"
                        alt="Delete"
                    />

                    <img
                        src={isOpen ? Icons.iconCollapse : Icons.iconExpand}
                        onClick={onToggle}
                        className="w-[24px] h-[24px]"
                        alt="Toggle"
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
                        <CourseDetailsField
                            value={item.description || ''}
                            placeholder="Lesson Description"
                            onChange={(e) =>
                                onLessonChange(
                                    index,
                                    'description',
                                    e.target.value
                                )
                            }
                            className="w-full"
                            rows={8}
                        />

                        {(embedUrl || embedUrl.trim() !== '') && (
                            <LessonVideoPlayer url={embedUrl} />
                        )}

                        <CourseDetailsInput
                            type="text"
                            placeholder="Video URL"
                            value={item.video_url || ''}
                            onChange={(e) =>
                                onLessonChange(
                                    index,
                                    'video_url',
                                    e.target.value
                                )
                            }
                            className="w-full"
                        />

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
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLessonCard
