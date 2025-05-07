from django.urls import path  
from . import views 

urlpatterns = [
  path('',views.SummaryAPIView.as_view()),
  path('<pk>',views.SummaryRetrieveUpdateDestroyAPIView.as_view())
]
