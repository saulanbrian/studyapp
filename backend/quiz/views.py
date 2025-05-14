from rest_framework.generics import RetrieveAPIView

from rest_framework.permissions import IsAuthenticated

from .models import Quiz
from .serializers import QuizSerializer


class QuizRetrieveAPIView(RetrieveAPIView):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
