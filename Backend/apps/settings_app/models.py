from django.db import models


class PlatformSettings(models.Model):
    """
    Singleton model — only one row ever exists (pk=1).
    Stores global platform configuration editable from /admin or the frontend.
    """
    platform_name       = models.CharField(max_length=255, default='PhishingOps')
    platform_base_url   = models.URLField(
        default='http://127.0.0.1:8000',
        help_text='Full URL used to build phishing links sent to employees.'
    )
    frontend_url        = models.URLField(
        default='http://localhost:5173',
        help_text='React frontend URL — employees are redirected here after clicking a link.'
    )
    default_from_name   = models.CharField(
        max_length=255,
        default='IT Security Team',
        help_text='Default sender display name pre-filled when creating campaigns.'
    )
    session_expiry_days = models.PositiveIntegerField(
        default=7,
        help_text='How many days a phishing link remains valid after being clicked.'
    )
    allow_quiz_retake   = models.BooleanField(
        default=False,
        help_text='Allow employees to retake a quiz after failing.'
    )
    lms_path            = models.CharField(
        max_length=100,
        default='',
        blank = True,
        help_text=(
            'Frontend path employees land on after clicking a phishing link. '
            'Do NOT include slashes — e.g. "lms", "training", "courses". '
            'Leave blank to redirect to the root: '
            '{frontend_url}/?token={uuid}'
        )
    )
    # ── Landing page content ──────────────────────────────────────────────────
    landing_title    = models.CharField(
        max_length=255,
        default='Wait! This was a Phishing Simulation',
        help_text='Main heading shown on the employee LMS landing page.'
    )
    landing_message1 = models.TextField(
        default=(
            'Don\'t worry, your data is safe. However, a real attacker could have used that link to access your personal details, address, and credit information.'
        ),
        help_text='First paragraph shown below the title on the landing page.'
    )
    landing_message2 = models.TextField(
        default=(
            'Your security is a priority. Please follow the link below to complete your required phishing awareness module.'
        ),
        help_text='Second paragraph shown below Message 1 on the landing page.'
    )
    landing_button_text = models.CharField(
        max_length=100,
        default='Go to Training Portal',
        help_text='Text displayed on the button that starts the LMS course.'
    )

    logo                = models.ImageField(
        upload_to='platform/', null=True, blank=True
    )
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Platform Settings'
        verbose_name_plural = 'Platform Settings'

    def __str__(self):
        return f'Platform Settings — {self.platform_name}'

    @classmethod
    def get(cls):
        """Always return the single settings instance, creating it if needed."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
