from django.urls import path
from . import views

urlpatterns = [
    path('request_summary/<id>',views.request_summary)
]
