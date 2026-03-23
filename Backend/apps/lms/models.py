from django.db import models
from django.conf import settings


class Course(models.Model):
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    thumbnail   = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='courses'
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def total_lessons(self):
        return self.lessons.count()

    @property
    def has_quiz(self):
        return hasattr(self, 'quiz')


class Lesson(models.Model):
    course          = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title           = models.CharField(max_length=255)
    description     = models.TextField(blank=True)
    video_file      = models.FileField(upload_to='lesson_videos/', null=True, blank=True)
    video_url       = models.URLField(blank=True, help_text='YouTube embed or external URL')
    content_html    = models.TextField(blank=True, help_text='Optional reading material')
    order           = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.course.title} — {self.title}'

    @property
    def video_source(self):
        if self.video_file:
            return self.video_file.url
        return self.video_url


class Quiz(models.Model):
    course        = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='quiz')
    title         = models.CharField(max_length=255, default='Knowledge Check')
    passing_score = models.FloatField(default=70.0)
    instructions  = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return f'Quiz: {self.course.title}'

    @property
    def total_questions(self):
        return self.questions.count()


class QuizQuestion(models.Model):
    SINGLE = 'single'
    MULTI  = 'multi'
    TYPE_CHOICES = [
        (SINGLE, 'Single Choice'),
        (MULTI,  'Multiple Choice'),
    ]

    quiz          = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text          = models.TextField()
    question_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=SINGLE)
    order         = models.PositiveIntegerField(default=0)
    explanation   = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'Q{self.order}: {self.text[:60]}'


class QuizChoice(models.Model):
    question   = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='choices')
    text       = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{"✓" if self.is_correct else "✗"} {self.text[:60]}'


