from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('nested_admin/', include('nested_admin.urls')),
    path('api/v1/', include('api.urls')),
    path('go/', include('apps.campaigns.tracking_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

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

from django.contrib import admin
from rest_framework_simplejwt.token_blacklist import models as blacklist_models

admin.site.unregister(blacklist_models.OutstandingToken)
admin.site.unregister(blacklist_models.BlacklistedToken)

admin.site.site_header  = 'PhishingOps Administration'
admin.site.site_title   = 'PhishingOps Admin'
admin.site.index_title  = 'Manage Phishing Simulations'
