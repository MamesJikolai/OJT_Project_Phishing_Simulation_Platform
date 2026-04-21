import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'

type MenuItem = {
    icon?: string
    label?: string
    action?: string
    options?: any
    type?: 'divider'
}

const bubbleButtons: MenuItem[] = [
    // Text Formatting
    {
        icon: 'format_bold',
        label: 'Bold',
        action: 'toggleBold',
    },
    {
        icon: 'format_italic',
        label: 'Italic',
        action: 'toggleItalic',
    },
    {
        icon: 'format_underlined',
        label: 'Underline',
        action: 'toggleUnderline',
    },
    {
        icon: 'strikethrough_s',
        label: 'Strikethrough',
        action: 'toggleStrike',
    },
    {
        icon: 'format_quote',
        label: 'Blockquote',
        action: 'toggleBlockquote',
    },
    { type: 'divider' },
    // Headings
    {
        icon: 'format_paragraph',
        label: 'Paragraph',
        action: 'setParagraph',
    },
    {
        icon: 'format_h1',
        label: 'Heading 1',
        action: 'toggleHeading',
        options: { level: 1 },
    },
    {
        icon: 'format_h2',
        label: 'Heading 2',
        action: 'toggleHeading',
        options: { level: 2 },
    },
    {
        icon: 'format_h3',
        label: 'Heading 3',
        action: 'toggleHeading',
        options: { level: 3 },
    },
    { type: 'divider' },
    // Alignment
    {
        icon: 'format_align_left',
        label: 'Align Left',
        action: 'setTextAlign',
        options: 'left',
    },
    {
        icon: 'format_align_center',
        label: 'Align Center',
        action: 'setTextAlign',
        options: 'center',
    },
    {
        icon: 'format_align_right',
        label: 'Align Right',
        action: 'setTextAlign',
        options: 'right',
    },
    { type: 'divider' },
    // Lists
    {
        icon: 'format_list_bulleted',
        label: 'Bullet List',
        action: 'toggleBulletList',
    },
    {
        icon: 'format_list_numbered',
        label: 'Numbered List',
        action: 'toggleOrderedList',
    },
]

interface RichTextFieldProps {
    label?: string
    value: string
    onChange: (value: string) => void
    description?: React.ReactNode
    className?: string
}

function RichTextField({
    label,
    value,
    onChange,
    description,
    className = '',
}: RichTextFieldProps) {
    const lastEmittedValue = useRef(value)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-p:my-1 max-w-none focus:outline-none min-h-[150px] p-4 text-[#4A4A4A]',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            lastEmittedValue.current = html
            onChange(html)
        },
    })

    useEffect(() => {
        if (editor && value !== lastEmittedValue.current) {
            editor.commands.setContent(value)
            lastEmittedValue.current = value
        }
    }, [value, editor])

    const defaultStyle = 'text-[#4A4A4A] hover:bg-[#DDE2E5]'
    const buttonClass =
        'w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer'

    // Helper function to render buttons
    const renderButtons = (buttons: MenuItem[]) => {
        return buttons.map((btn, index) => {
            if (btn.type === 'divider') {
                return (
                    <div
                        key={`div-${index}`}
                        className="w-[1px] h-5 bg-[#DDE2E5] mx-1"
                    ></div>
                )
            }

            return (
                <button
                    key={`${btn.action}-${index}`}
                    type="button"
                    title={btn.label}
                    aria-label={btn.label}
                    onClick={() => {
                        const commandChain = editor?.chain().focus() as any
                        const actionName = btn.action as string
                        if (btn.options) {
                            commandChain[actionName](btn.options).run()
                        } else {
                            commandChain[actionName]().run()
                        }
                    }}
                    className={`${buttonClass} ${defaultStyle}`}
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {btn.icon}
                    </span>
                </button>
            )
        })
    }

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            <div className="flex flex-col gap-1">
                {label && (
                    <span className="font-medium text-[#121212]">{label}</span>
                )}

                <div className="flex flex-col border-2 border-[#DDE2E5] rounded-[8px] focus-within:border-[#024C89] transition-colors relative">
                    {/* --- Bubble Menu --- */}
                    {editor && (
                        <BubbleMenu
                            editor={editor}
                            className="flex flex-wrap gap-1 bg-[#F8F9FA] border border-[#DDE2E5] shadow-lg p-1 rounded-lg items-center z-10"
                        >
                            {renderButtons(bubbleButtons)}

                            <div className="w-[1px] h-5 bg-[#DDE2E5] mx-1"></div>

                            {/* Color Controls */}
                            <div className="flex items-center">
                                <label
                                    className="flex items-center gap-1 cursor-pointer hover:bg-[#DDE2E5] p-1 rounded-l"
                                    title="Text Color"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        format_color_text
                                    </span>
                                    <input
                                        type="color"
                                        onInput={(event: any) =>
                                            editor
                                                .chain()
                                                .focus()
                                                .setColor(event.target.value)
                                                .run()
                                        }
                                        value={
                                            editor.getAttributes('textStyle')
                                                .color || '#000000'
                                        }
                                        className="w-5 h-5 p-0 border-0 rounded cursor-pointer"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .unsetColor()
                                            .run()
                                    }
                                    className="flex items-center hover:bg-[#DDE2E5] p-1 rounded-r cursor-pointer"
                                    title="Remove Text Color"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        format_color_reset
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center">
                                <label
                                    className="flex items-center gap-1 cursor-pointer hover:bg-[#DDE2E5] p-1 rounded-l"
                                    title="Highlight Color"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        format_ink_highlighter
                                    </span>
                                    <input
                                        type="color"
                                        onInput={(event: any) =>
                                            editor
                                                .chain()
                                                .focus()
                                                .setHighlight({
                                                    color: event.target.value,
                                                })
                                                .run()
                                        }
                                        value={
                                            editor.getAttributes('highlight')
                                                .color || '#ffffff'
                                        }
                                        className="w-5 h-5 p-0 border-0 rounded cursor-pointer"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .unsetHighlight()
                                            .run()
                                    }
                                    className="flex items-center hover:bg-[#DDE2E5] p-1 rounded-r cursor-pointer"
                                    title="Remove Highlight"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        ink_eraser
                                    </span>
                                </button>
                            </div>
                        </BubbleMenu>
                    )}

                    {/* Editor Content Area */}
                    <EditorContent editor={editor} />
                </div>
            </div>

            {description && (
                <div className="text-[13px] text-[#4A4A4A] mt-1">
                    {description}
                </div>
            )}
        </div>
    )
}

export default RichTextField
