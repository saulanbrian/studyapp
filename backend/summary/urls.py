from django.urls import path  
from . import views 

urlpatterns = [
  path('',views.SummaryAPIView.as_view()),
  path('favorites',views.FavoriteSummaryListAPIView.as_view()),
  path('retry-summary',views.retry_summary),
  path('<pk>',views.SummaryRetrieveUpdateDestroyAPIView.as_view())
]
