from django.urls import path

from quiz import views

urlpatterns = [
    path("generate_quiz",views.generate_quiz_view)
]
