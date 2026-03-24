from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers
from apps.campaigns.models import (
    EmailTemplate, Campaign, CampaignTarget,
    LessonProgress, QuizAttempt,
)
from apps.lms.models import Course, Lesson, Quiz, QuizQuestion, QuizChoice

User = get_user_model()


# ── Auth ───────────────────────────────────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'is_staff', 'is_superuser', 'date_joined',
        ]
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'date_joined']


# ── Email Templates ────────────────────────────────────────────────────────────

class EmailTemplateSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source='created_by.username', read_only=True, default=None
    )

    class Meta:
        model  = EmailTemplate
        fields = [
            'id', 'name', 'subject', 'sender_name', 'body_html',
            'created_by', 'created_by_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_username']
        extra_kwargs = {
            'created_by': {'read_only': True},
        }


# ── LMS ────────────────────────────────────────────────────────────────────────

class QuizChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuizChoice
        fields = ['id', 'text', 'is_correct', 'order']


class QuizChoicePublicSerializer(serializers.ModelSerializer):
    """Used for employees — hides is_correct."""
    class Meta:
        model  = QuizChoice
        fields = ['id', 'text', 'order']


class QuizQuestionSerializer(serializers.ModelSerializer):
    choices = QuizChoiceSerializer(many=True, read_only=True)

    class Meta:
        model  = QuizQuestion
        fields = ['id', 'text', 'question_type', 'order', 'explanation', 'choices']


class QuizQuestionPublicSerializer(serializers.ModelSerializer):
    """Used for employees — hides answer explanations and correct answers."""
    choices = QuizChoicePublicSerializer(many=True, read_only=True)

    class Meta:
        model  = QuizQuestion
        fields = ['id', 'text', 'question_type', 'order', 'choices']


class QuizSerializer(serializers.ModelSerializer):
    questions      = QuizQuestionSerializer(many=True, read_only=True)
    total_questions = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Quiz
        fields = ['id', 'title', 'passing_score', 'instructions',
                  'total_questions', 'questions']


class QuizPublicSerializer(serializers.ModelSerializer):
    """Used for employees — hides correct answers."""
    questions      = QuizQuestionPublicSerializer(many=True, read_only=True)
    total_questions = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Quiz
        fields = ['id', 'title', 'passing_score', 'instructions',
                  'total_questions', 'questions']


class LessonSerializer(serializers.ModelSerializer):
    video_source = serializers.CharField(read_only=True)

    class Meta:
        model  = Lesson
        fields = [
            'id', 'title', 'description', 'video_file', 'video_url',
            'video_source', 'content_html', 'order', 'duration_minutes',
        ]


class CourseListSerializer(serializers.ModelSerializer):
    total_lessons = serializers.IntegerField(read_only=True)
    has_quiz      = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'caption', 'description', 'thumbnail',
            'is_published', 'total_lessons', 'has_quiz', 'created_at',
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    lessons       = LessonSerializer(many=True, read_only=True)
    quiz          = QuizSerializer(read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)
    has_quiz      = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'caption', 'description', 'thumbnail', 'is_published',
            'total_lessons', 'has_quiz', 'lessons', 'quiz',
            'created_at', 'updated_at',
        ]


class CoursePublicSerializer(serializers.ModelSerializer):
    """Employee-facing — includes lessons and quiz without answers."""
    lessons       = LessonSerializer(many=True, read_only=True)
    quiz          = QuizPublicSerializer(read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'caption', 'description', 'thumbnail',
            'total_lessons', 'lessons', 'quiz',
        ]


# ── Campaigns ─────────────────────────────────────────────────────────────────

class CampaignTargetSerializer(serializers.ModelSerializer):
    phishing_link = serializers.CharField(read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)

    class Meta:
        model  = CampaignTarget
        fields = [
            'id', 'campaign', 'campaign_name',
            'email', 'full_name', 'department', 'position',
            'token', 'phishing_link',
            'email_sent_at', 'email_failed', 'email_error',
            'link_clicked_at', 'click_ip',
            'lms_started_at', 'lms_completed_at', 'quiz_score',
        ]
        read_only_fields = [
            'id', 'token', 'phishing_link', 'campaign_name',
            'email_sent_at', 'email_failed', 'email_error',
            'link_clicked_at', 'click_ip',
            'lms_started_at', 'lms_completed_at', 'quiz_score',
        ]


class CampaignListSerializer(serializers.ModelSerializer):
    email_template_name   = serializers.CharField(
        source='email_template.name', read_only=True, default=None
    )
    assigned_course_title = serializers.CharField(
        source='assigned_course.title', read_only=True, default=None
    )
    created_by_username   = serializers.CharField(
        source='created_by.username', read_only=True, default=None
    )
    total_targets  = serializers.IntegerField(read_only=True)
    emails_sent    = serializers.IntegerField(read_only=True)
    links_clicked  = serializers.IntegerField(read_only=True)
    lms_completed  = serializers.IntegerField(read_only=True)
    click_rate     = serializers.FloatField(read_only=True)

    class Meta:
        model  = Campaign
        fields = [
            'id', 'name', 'description', 'status',
            'email_template', 'email_template_name',
            'assigned_course', 'assigned_course_title',
            'from_email', 'created_by_username',
            'total_targets', 'emails_sent', 'links_clicked',
            'lms_completed', 'click_rate',
            'created_at', 'launched_at', 'completed_at', 'scheduled_at',
        ]


class CampaignDetailSerializer(serializers.ModelSerializer):
    targets               = CampaignTargetSerializer(many=True, read_only=True)
    email_template_name   = serializers.CharField(
        source='email_template.name', read_only=True, default=None
    )
    assigned_course_title = serializers.CharField(
        source='assigned_course.title', read_only=True, default=None
    )
    total_targets  = serializers.IntegerField(read_only=True)
    emails_sent    = serializers.IntegerField(read_only=True)
    links_clicked  = serializers.IntegerField(read_only=True)
    lms_completed  = serializers.IntegerField(read_only=True)
    click_rate     = serializers.FloatField(read_only=True)
    # Write-only field for SMTP password — never returned in responses
    smtp_password  = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=''
    )

    class Meta:
        model  = Campaign
        fields = [
            'id', 'name', 'description', 'status',
            'email_template', 'email_template_name',
            'assigned_course', 'assigned_course_title',
            'smtp_host', 'smtp_port', 'smtp_user',
            'smtp_password', 'smtp_use_tls', 'smtp_use_ssl',
            'from_email', 'scheduled_at',
            'created_at', 'launched_at', 'completed_at',
            'total_targets', 'emails_sent', 'links_clicked',
            'lms_completed', 'click_rate',
            'targets',
        ]
        read_only_fields = [
            'id', 'status', 'created_at', 'launched_at', 'completed_at',
            'email_template_name', 'assigned_course_title',
        ]
        extra_kwargs = {
            'email_template':  {'required': False, 'allow_null': True},
            'assigned_course': {'required': False, 'allow_null': True},
            'description':     {'required': False, 'allow_blank': True, 'default': ''},
            'scheduled_at':    {'required': False, 'allow_null': True},
            'smtp_host':       {'required': False, 'allow_blank': True, 'default': ''},
            'smtp_user':       {'required': False, 'allow_blank': True, 'default': ''},
            'from_email':      {'required': False, 'allow_blank': True, 'default': ''},
        }

    def create(self, validated_data):
        password = validated_data.pop('smtp_password', '')
        campaign = Campaign(**validated_data)
        campaign.smtp_password = password
        campaign.created_by    = self.context['request'].user
        campaign.save()
        return campaign

    def update(self, instance, validated_data):
        password = validated_data.pop('smtp_password', '')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.smtp_password = password
        instance.save()
        return instance


# ── LMS Session (employee-facing) ─────────────────────────────────────────────

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model  = LessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'started_at', 'completed_at', 'is_completed']
        read_only_fields = ['id', 'started_at', 'lesson_title', 'is_completed']


class QuizAttemptSerializer(serializers.ModelSerializer):
    target_email  = serializers.CharField(source='target.email',            read_only=True)
    target_name   = serializers.CharField(source='target.full_name',        read_only=True)
    campaign_name = serializers.CharField(source='target.campaign.name',    read_only=True)
    course_title  = serializers.CharField(source='quiz.course.title',       read_only=True)
    quiz_title    = serializers.CharField(source='quiz.title',              read_only=True)

    class Meta:
        model  = QuizAttempt
        fields = [
            'id', 'target_email', 'target_name', 'campaign_name',
            'course_title', 'quiz_title', 'score', 'passed',
            'answers', 'submitted_at',
        ]
        read_only_fields = [
            'id', 'target_email', 'target_name', 'campaign_name',
            'course_title', 'quiz_title', 'submitted_at',
        ]


# ── Analytics ─────────────────────────────────────────────────────────────────

class AnalyticsSummarySerializer(serializers.Serializer):
    total_campaigns  = serializers.IntegerField()
    total_targets    = serializers.IntegerField()
    total_sent       = serializers.IntegerField()
    total_clicked    = serializers.IntegerField()
    total_completed  = serializers.IntegerField()
    click_rate       = serializers.FloatField()
    completion_rate  = serializers.FloatField()
    avg_quiz_score   = serializers.FloatField()


# ── Platform Settings ─────────────────────────────────────────────────────────

class PlatformSettingsSerializer(serializers.Serializer):
    platform_name        = serializers.CharField(max_length=255)
    platform_base_url    = serializers.URLField()
    frontend_url         = serializers.URLField()
    default_from_name    = serializers.CharField(max_length=255)
    session_expiry_days  = serializers.IntegerField(min_value=1)
    allow_quiz_retake    = serializers.BooleanField()
    # Landing page content
    landing_title        = serializers.CharField(max_length=255)
    landing_message1     = serializers.CharField()
    landing_message2     = serializers.CharField()
    landing_button_text  = serializers.CharField(max_length=100)
    logo_url             = serializers.SerializerMethodField()
    updated_at           = serializers.DateTimeField(read_only=True)

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class SMTPTestSerializer(serializers.Serializer):
    smtp_host     = serializers.CharField()
    smtp_port     = serializers.IntegerField(default=587)
    smtp_user     = serializers.CharField()
    smtp_password = serializers.CharField()
    smtp_use_tls  = serializers.BooleanField(default=True)
    smtp_use_ssl  = serializers.BooleanField(default=False)
    from_email    = serializers.EmailField()
    to_email      = serializers.EmailField()