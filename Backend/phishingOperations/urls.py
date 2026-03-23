from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django built-in admin panel
    path('admin/', admin.site.urls),

    # nested_admin static files
    path('nested_admin/', include('nested_admin.urls')),

    # All REST API routes
    path('api/v1/', include('api.urls')),

    # Phishing link tracking
    path('go/', include('apps.campaigns.tracking_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# ── SMTP test URL — registered after admin.site.urls to avoid object-ID clash ─
# Must be imported after apps are ready, so we do it at module level here.
def _get_smtp_test_view():
    from apps.settings_app.admin import PlatformSettingsAdmin
    from apps.settings_app.models import PlatformSettings
    instance = PlatformSettingsAdmin(PlatformSettings, admin.site)
    return admin.site.admin_view(instance.smtp_test_view)


urlpatterns = [
    path(
        'admin/settings_app/smtp-test/',
        _get_smtp_test_view(),
        name='settings_app_smtp_test',
    ),
] + urlpatterns

# Hide Token Blacklist from admin sidebar
from django.contrib import admin
from rest_framework_simplejwt.token_blacklist import models as blacklist_models

admin.site.unregister(blacklist_models.OutstandingToken)
admin.site.unregister(blacklist_models.BlacklistedToken)

# Admin site branding
admin.site.site_header  = 'PhishingOps Administration'
admin.site.site_title   = 'PhishingOps Admin'
admin.site.index_title  = 'Manage Phishing Simulations'
