from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone
from django.conf import settings
from django.views.decorators.cache import never_cache

from .models import CampaignTarget


def _get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


@never_cache
def phishing_click(request, token):
    """
    Employees land here after clicking the phishing link in their email.

    1. Records the click (timestamp, IP, user-agent)
    2. Redirects to the React frontend LMS page:
           <frontend_url>/<lms_path>?token=<uuid>

       Both frontend_url and lms_path are configurable from:
           /admin/settings_app/platformsettings/

       Example result:  http://localhost:5173/lms?token=<uuid>
       Change lms_path to "training" and it becomes:
                        http://localhost:5173/training?token=<uuid>
    """
    target = get_object_or_404(CampaignTarget, token=token)

    # Record first click only
    if not target.link_clicked_at:
        target.link_clicked_at  = timezone.now()
        target.click_ip         = _get_client_ip(request)
        target.click_user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        target.save(update_fields=['link_clicked_at', 'click_ip', 'click_user_agent'])

    # Read frontend_url and lms_path from PlatformSettings (with .env fallback)
    try:
        from apps.settings_app.models import PlatformSettings
        ps           = PlatformSettings.get()
        frontend_url = ps.frontend_url.rstrip('/')
        lms_path     = ps.lms_path.strip('/')
    except Exception:
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        lms_path     = 'lms'

    return redirect(f'{frontend_url}/{lms_path}?token={token}')