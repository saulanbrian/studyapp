from django.urls import path
from . import views

urlpatterns = [
    path('hello/<id>',views.hello)
]
