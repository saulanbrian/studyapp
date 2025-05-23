from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Quiz
from .serializers import QuizSerializer
from summary.models import Summary
from .tasks import generate_quiz 



class QuizRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.request.user.clerk_id
        return Quiz.objects.filter(summary__user__clerk_id=id)


class QuizListAPIView(ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.request.user.clerk_id
        return Quiz.objects.filter(summary__user__clerk_id=id)


@permission_classes([IsAuthenticated]) 
@api_view(['POST'])
def generate_quiz_view(request):
    summary_id = request.data.get('summary_id')
    summary = get_object_or_404(Summary,pk=summary_id)
    if not hasattr(summary,'quiz'):
        quiz = Quiz.objects.create(summary=summary)
        generate_quiz.delay_on_commit(summary_id,quiz.id)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data,status=status.HTTP_201_CREATED)    
    return Response(
        { 'data':'a summary can only have one quiz'},
        status=status.HTTP_409_CONFLICT 
    )

