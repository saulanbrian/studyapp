from django.urls import path
from . import views

urlpatterns = [
    path('request_summary',views.request_summary)
]
