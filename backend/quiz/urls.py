from django.urls import path

from . import views

urlpatterns = [
    path('create',views.generate_quiz_view),
    path('all',views.QuizListAPIView.as_view()),
    path('<pk>',views.QuizRetrieveUpdateDestroyAPIView.as_view()),
]
