import nested_admin
from django.contrib import admin
from .models import Course, Lesson, Quiz, QuizQuestion, QuizChoice


# ── Course Admin ───────────────────────────────────────────────────────────────

class LessonInline(admin.StackedInline):
    """
    Use StackedInline so all lesson fields are visible when adding
    lessons directly from the Course change form.
    """
    model       = Lesson
    extra       = 1
    show_change_link = True
    fields      = (
        'title', 'description', 'order', 'duration_minutes',
        'video_url', 'video_file', 'content_html',
    )


class QuizInline(admin.StackedInline):
    model            = Quiz
    extra            = 0
    show_change_link = True


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display    = ('title', 'is_published', 'total_lessons_display',
                       'has_quiz_display', 'created_by', 'created_at')
    list_filter     = ('is_published', 'created_at')
    search_fields   = ('title', 'caption', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines         = [LessonInline, QuizInline]

    fieldsets = (
        ('Course Info', {
            'fields': (
                'title', 'caption', 'description',
                'thumbnail', 'is_published', 'created_by',
            ),
            'description': (
                '<strong>caption</strong> — short subtitle shown below the title '
                'on the LMS landing page, e.g. "Phishing Awareness · 15 min".<br>'
                '<strong>is_published</strong> — must be checked for the course '
                'to be delivered to employees via the phishing link.'
            ),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def total_lessons_display(self, obj):
        return obj.total_lessons
    total_lessons_display.short_description = 'Lessons'

    def has_quiz_display(self, obj):
        return obj.has_quiz
    has_quiz_display.short_description = 'Has Quiz'
    has_quiz_display.boolean = True


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ('title', 'course', 'order', 'duration_minutes')
    list_filter   = ('course',)
    search_fields = ('title', 'course__title')

    fieldsets = (
        ('Lesson Info', {
            'fields': ('course', 'title', 'description', 'order', 'duration_minutes'),
        }),
        ('Video', {
            'fields': ('video_url', 'video_file'),
            'description': (
                'Provide either a video URL (YouTube embed link) or upload a file. '
                'If both are set, the uploaded file takes priority.'
            ),
        }),
        ('Reading Material', {
            'fields': ('content_html',),
            'classes': ('collapse',),
            'description': 'Optional HTML content shown below the video.',
        }),
    )


# ── Quiz Admin — nested inlines ───────────────────────────────────────────────

class NestedQuizChoiceInline(nested_admin.NestedTabularInline):
    model      = QuizChoice
    extra      = 0          # no blank rows when editing existing questions
    min_num    = 2          # require at least 2 choices
    max_num    = 8
    fields     = ('text', 'is_correct', 'order')


class NestedQuizQuestionInline(nested_admin.NestedStackedInline):
    model    = QuizQuestion
    extra    = 0            # no blank question rows when editing
    fields   = ('text', 'question_type', 'order', 'explanation')
    inlines  = [NestedQuizChoiceInline]


@admin.register(Quiz)
class QuizAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'course', 'passing_score', 'total_questions_display')
    inlines      = [NestedQuizQuestionInline]

    fieldsets = (
        (None, {
            'fields': ('course', 'title', 'passing_score', 'instructions'),
            'description': (
                '<strong>Adding questions:</strong> Click "Add another Quiz Question" '
                'below to add a new question. Each question shows its own "Choices" '
                'section — click "Add another Quiz Choice" within a question to add '
                'choices. Tick "Is correct" on the correct answer(s).<br><br>'
                '<strong>Note:</strong> Save the quiz first before adding questions '
                'if this is a new quiz.'
            ),
        }),
    )

    def total_questions_display(self, obj):
        return obj.total_questions
    total_questions_display.short_description = 'Questions'


# ── Standalone QuizQuestion admin ─────────────────────────────────────────────

class QuizChoiceInline(admin.TabularInline):
    model   = QuizChoice
    extra   = 0            # no blank rows when editing
    min_num = 2
    max_num = 8
    fields  = ('text', 'is_correct', 'order')


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'question_type', 'order')
    list_filter  = ('quiz', 'question_type')
    inlines      = [QuizChoiceInline]