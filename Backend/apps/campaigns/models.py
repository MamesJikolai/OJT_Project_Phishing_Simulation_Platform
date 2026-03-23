import uuid
import logging
from django.db import models
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

# ── Encryption helpers (graceful fallback if key not set) ─────────────────────

def _get_fernet():
    key = settings.FIELD_ENCRYPTION_KEY
    if not key:
        return None
    try:
        from cryptography.fernet import Fernet
        return Fernet(key.encode() if isinstance(key, str) else key)
    except Exception:
        return None


def encrypt_field(plaintext: str) -> str:
    if not plaintext:
        return ''
    f = _get_fernet()
    if f is None:
        logger.warning('FIELD_ENCRYPTION_KEY not set — storing SMTP password unencrypted.')
        return f'plain:{plaintext}'
    return f.encrypt(plaintext.encode()).decode()


def decrypt_field(ciphertext: str) -> str:
    if not ciphertext:
        return ''
    if ciphertext.startswith('plain:'):
        return ciphertext[6:]
    f = _get_fernet()
    if f is None:
        return ''
    try:
        return f.decrypt(ciphertext.encode()).decode()
    except Exception:
        return ''


# ── Models ────────────────────────────────────────────────────────────────────

class EmailTemplate(models.Model):
    """Phishing email templates reused across campaigns."""
    name        = models.CharField(max_length=255)
    subject     = models.CharField(max_length=500)
    sender_name = models.CharField(
        max_length=255,
        help_text='Display name shown in the From field, e.g. "IT Support"'
    )
    body_html   = models.TextField(
        help_text=(
            'HTML email body. Available variables: '
            '{{ target_name }}, {{ target_email }}, {{ target_department }}, '
            '{{ phishing_link }}, {{ company_name }}, {{ campaign_name }}'
        )
    )
    created_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='email_templates'
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Campaign(models.Model):
    STATUS_DRAFT     = 'draft'
    STATUS_RUNNING   = 'running'
    STATUS_PAUSED    = 'paused'
    STATUS_COMPLETED = 'completed'

    STATUS_CHOICES = [
        (STATUS_DRAFT,     'Draft'),
        (STATUS_RUNNING,   'Running'),
        (STATUS_PAUSED,    'Paused'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    name           = models.CharField(max_length=255)
    description    = models.TextField(blank=True)
    email_template = models.ForeignKey(
        EmailTemplate, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='campaigns'
    )
    assigned_course = models.ForeignKey(
        'lms.Course', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='campaigns'
    )

    # SMTP — stored per campaign so different credentials can be used
    smtp_host     = models.CharField(max_length=255, blank=True)
    smtp_port     = models.IntegerField(default=587)
    smtp_user     = models.CharField(max_length=255, blank=True)
    _smtp_password = models.TextField(db_column='smtp_password', blank=True)
    smtp_use_tls  = models.BooleanField(default=True)
    smtp_use_ssl  = models.BooleanField(default=False)
    from_email    = models.EmailField(blank=True)

    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    created_by    = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='campaigns'
    )
    created_at    = models.DateTimeField(auto_now_add=True)
    launched_at   = models.DateTimeField(null=True, blank=True)
    completed_at  = models.DateTimeField(null=True, blank=True)
    scheduled_at  = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    # Transparent encrypt/decrypt for SMTP password
    @property
    def smtp_password(self):
        return decrypt_field(self._smtp_password)

    @smtp_password.setter
    def smtp_password(self, value):
        self._smtp_password = encrypt_field(value)

    # ── Computed stats ─────────────────────────────────────────────────────────
    @property
    def total_targets(self):
        return self.targets.count()

    @property
    def emails_sent(self):
        return self.targets.filter(email_sent_at__isnull=False).count()

    @property
    def links_clicked(self):
        return self.targets.filter(link_clicked_at__isnull=False).count()

    @property
    def lms_completed(self):
        return self.targets.filter(lms_completed_at__isnull=False).count()

    @property
    def click_rate(self):
        sent = self.emails_sent
        return round(self.links_clicked / sent * 100, 1) if sent else 0.0


class CampaignTarget(models.Model):
    """
    One record per employee per campaign.
    Employees have no accounts — identified only by their UUID token.
    """
    campaign   = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='targets')
    email      = models.EmailField()
    full_name  = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    position   = models.CharField(max_length=255, blank=True)

    # Unique token embedded in the phishing link
    token      = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False)

    # Tracking
    email_sent_at    = models.DateTimeField(null=True, blank=True)
    email_failed     = models.BooleanField(default=False)
    email_error      = models.TextField(blank=True)
    link_clicked_at  = models.DateTimeField(null=True, blank=True)
    click_ip         = models.GenericIPAddressField(null=True, blank=True)
    click_user_agent = models.TextField(blank=True)
    lms_started_at   = models.DateTimeField(null=True, blank=True)
    lms_completed_at = models.DateTimeField(null=True, blank=True)
    quiz_score       = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('campaign', 'email')
        ordering = ['full_name', 'email']

    def __str__(self):
        return f'{self.email} — {self.campaign.name}'

    @property
    def phishing_link(self):
        base = settings.PLATFORM_BASE_URL.rstrip('/')
        return f'{base}/go/{self.token}/'

    @property
    def clicked(self):
        return self.link_clicked_at is not None

    @property
    def completed(self):
        return self.lms_completed_at is not None


# ── Employee LMS progress ─────────────────────────────────────────────────────
# Lives in campaigns to avoid a circular import with the lms app.
# campaigns → lms (via assigned_course FK) is fine.
# lms → campaigns would create a cycle, so these models live here instead.

class LessonProgress(models.Model):
    """Tracks whether an employee has watched/completed a lesson."""
    target       = models.ForeignKey(
        CampaignTarget, on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson       = models.ForeignKey(
        'lms.Lesson', on_delete=models.CASCADE
    )
    started_at   = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('target', 'lesson')
        verbose_name_plural = 'Lesson progress'

    def __str__(self):
        return f'{self.target.email} — {self.lesson.title}'

    @property
    def is_completed(self):
        return self.completed_at is not None


class QuizAttempt(models.Model):
    """One quiz submission by one employee."""
    target       = models.ForeignKey(
        CampaignTarget, on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )
    quiz         = models.ForeignKey(
        'lms.Quiz', on_delete=models.CASCADE
    )
    score        = models.FloatField()
    passed       = models.BooleanField(default=False)
    answers      = models.JSONField(default=dict)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f'{self.target.email} — {self.score:.1f}%'
