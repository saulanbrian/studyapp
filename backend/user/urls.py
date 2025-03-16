from django.urls import path

from . import views

urlpatterns = [
  path('webhook',views.webhook_listener),
  path('me',views.me)
]