from django.urls import path
from . import tracking_views

urlpatterns = [
    path('<uuid:token>/', tracking_views.phishing_click, name='phishing_click'),
]
