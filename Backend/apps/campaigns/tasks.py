import logging
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.core.mail.backends.smtp import EmailBackend

logger = logging.getLogger(__name__)


def render_body(body_html: str, target, campaign) -> str:
    """Replace {{ variable }} placeholders in the email body."""
    if campaign.created_by:
        company = campaign.created_by.get_full_name() or campaign.created_by.username
    else:
        company = 'Your Company'

    target_name = target.full_name or target.email.split('@')[0]

    replacements = {
        '{{ target_name }}':       target_name,
        '{{target_name}}':         target_name,
        '{{ target_email }}':      target.email,
        '{{target_email}}':        target.email,
        '{{ target_department }}': target.department or '',
        '{{target_department}}':   target.department or '',
        '{{ phishing_link }}':     target.phishing_link,
        '{{phishing_link}}':       target.phishing_link,
        '{{ company_name }}':      company,
        '{{company_name}}':        company,
        '{{ campaign_name }}':     campaign.name,
        '{{campaign_name}}':       campaign.name,
    }

    body = body_html
    for placeholder, value in replacements.items():
        body = body.replace(placeholder, value)
    return body


def _send_single_email(target_id: int):
    """
    Core send logic — plain function called by both async and sync paths.
    Returns (success: bool, error: str).
    """
    from apps.campaigns.models import CampaignTarget

    try:
        target = CampaignTarget.objects.select_related(
            'campaign', 'campaign__email_template', 'campaign__created_by'
        ).get(id=target_id)
    except CampaignTarget.DoesNotExist:
        msg = f'CampaignTarget {target_id} not found.'
        logger.error(msg)
        return False, msg

    campaign = target.campaign
    template = campaign.email_template

    if not template:
        msg = f'Campaign {campaign.id} has no email template.'
        logger.error(msg)
        return False, msg

    if not campaign.smtp_host:
        msg = 'SMTP host is not configured on this campaign.'
        target.email_failed = True
        target.email_error  = msg
        target.save(update_fields=['email_failed', 'email_error'])
        return False, msg

    try:
        backend = EmailBackend(
            host=campaign.smtp_host,
            port=campaign.smtp_port,
            username=campaign.smtp_user,
            password=campaign.smtp_password,
            use_tls=campaign.smtp_use_tls,
            use_ssl=campaign.smtp_use_ssl,
            fail_silently=False,
            timeout=15,
        )

        html_body   = render_body(template.body_html, target, campaign)
        from_header = f'{template.sender_name} <{campaign.from_email}>'

        msg = EmailMultiAlternatives(
            subject=template.subject,
            body='Please enable HTML to view this security awareness email.',
            from_email=from_header,
            to=[target.email],
            connection=backend,
        )
        msg.attach_alternative(html_body, 'text/html')
        msg.send()

        target.email_sent_at = timezone.now()
        target.email_failed  = False
        target.email_error   = ''
        target.save(update_fields=['email_sent_at', 'email_failed', 'email_error'])
        logger.info(f'Email sent to {target.email}')
        return True, ''

    except Exception as exc:
        err = str(exc)
        logger.error(f'Failed to send to {target.email}: {err}')
        target.email_failed = True
        target.email_error  = err
        target.save(update_fields=['email_failed', 'email_error'])
        return False, err


# ── Django-Q2 task functions ───────────────────────────────────────────────────
# These are plain functions — Django-Q2 calls them by import path,
# no decorators needed.

def send_campaign_email(target_id: int):
    """
    Django-Q2 task — sends one phishing email.
    Queued by launch_campaign_async() via async_task().
    """
    success, error = _send_single_email(target_id)
    if not success:
        raise Exception(error)   # causes Django-Q2 to mark task as failed


def launch_campaign_async(campaign_id: int):
    """
    Django-Q2 task — marks campaign as running then queues one
    send_campaign_email task per unsent target.

    Called by the admin launch action via async_task().
    """
    from apps.campaigns.models import Campaign
    from django_q.tasks import async_task

    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        logger.error(f'Campaign {campaign_id} not found.')
        return

    campaign.status      = Campaign.STATUS_RUNNING
    campaign.launched_at = timezone.now()
    campaign.save(update_fields=['status', 'launched_at'])

    targets = campaign.targets.filter(email_sent_at__isnull=True, email_failed=False)
    count = 0
    for t in targets:
        async_task(
            'apps.campaigns.tasks.send_campaign_email',
            t.id,
            task_name=f'send-email-{t.id}',
        )
        count += 1

    logger.info(f'Campaign {campaign_id} — queued {count} email tasks.')
    return count


def _launch_sync(campaign_id: int):
    """
    Synchronous fallback — sends all unsent emails in the current thread.
    Used when qcluster worker is not running.
    Returns (sent: int, failed: int, first_error: str).
    """
    from apps.campaigns.models import Campaign

    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return 0, 0, f'Campaign {campaign_id} not found.'

    campaign.status      = Campaign.STATUS_RUNNING
    campaign.launched_at = timezone.now()
    campaign.save(update_fields=['status', 'launched_at'])

    targets = campaign.targets.filter(email_sent_at__isnull=True, email_failed=False)
    sent = failed = 0
    first_error = ''

    for t in targets:
        ok, err = _send_single_email(t.id)
        if ok:
            sent += 1
        else:
            failed += 1
            if not first_error:
                first_error = err

    logger.info(
        f'Campaign {campaign_id} sync launch — {sent} sent, {failed} failed.'
    )
    return sent, failed, first_error
