import nested_admin
from django.contrib import admin
from .models import Course, Lesson, Quiz, QuizQuestion, QuizChoice


# ── Course Admin ───────────────────────────────────────────────────────────────

class LessonInline(admin.TabularInline):
    model  = Lesson
    extra  = 1
    fields = ('title', 'order', 'duration_minutes', 'video_url', 'video_file')


class QuizInline(admin.StackedInline):
    model       = Quiz
    extra       = 0
    show_change_link = True


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display    = ('title', 'is_published', 'total_lessons_display',
                       'has_quiz_display', 'created_by', 'created_at')
    list_filter     = ('is_published', 'created_at')
    search_fields   = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines         = [LessonInline, QuizInline]

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


# ── Quiz Admin — nested inlines (choices inside questions) ────────────────────

class NestedQuizChoiceInline(nested_admin.NestedTabularInline):
    model  = QuizChoice
    extra  = 4
    fields = ('text', 'is_correct', 'order')


class NestedQuizQuestionInline(nested_admin.NestedStackedInline):
    model    = QuizQuestion
    extra    = 1
    fields   = ('text', 'question_type', 'order', 'explanation')
    inlines  = [NestedQuizChoiceInline]   # ← choices nested inside each question


@admin.register(Quiz)
class QuizAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'course', 'passing_score', 'total_questions_display')
    inlines      = [NestedQuizQuestionInline]

    fieldsets = (
        (None, {
            'fields': ('course', 'title', 'passing_score', 'instructions'),
            'description': (
                '<strong>How to add questions:</strong> '
                'Fill in the question text, type, and order below. '
                'Each question has its own "Choices" section directly underneath it. '
                'Mark exactly one choice as correct for single-choice questions, '
                'or multiple for multi-choice.'
            ),
        }),
    )

    def total_questions_display(self, obj):
        return obj.total_questions
    total_questions_display.short_description = 'Questions'


# ── Standalone QuizQuestion admin (still accessible from the list) ─────────────

class QuizChoiceInline(admin.TabularInline):
    model  = QuizChoice
    extra  = 4
    fields = ('text', 'is_correct', 'order')


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'question_type', 'order')
    list_filter  = ('quiz', 'question_type')
    inlines      = [QuizChoiceInline]