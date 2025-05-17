from django.urls import path

from . import views

urlpatterns = [
    path('create',views.generate_quiz),
    path('<pk>',views.QuizRetrieveAPIView.as_view())
]
