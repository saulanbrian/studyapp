from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView

from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Quiz
from .serializers import QuizSerializer
from summary.models import Summary
from summary.serializers import SummarySerializer
from .tasks import generate_quiz 


class QuizPaginator(PageNumberPagination):
    page_size = 10


class QuizRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.request.user.clerk_id
        return Quiz.objects.select_related('summary').filter(
            summary__user__clerk_id=id
        )


class QuizListAPIView(ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = QuizPaginator

    def get_queryset(self):
        id = self.request.user.clerk_id
        return Quiz.objects.select_related('summary').filter(
            summary__user__clerk_id=id
        )


@permission_classes([IsAuthenticated]) 
@api_view(['POST'])
def generate_quiz_view(request):
    summary_id = request.data.get('summary_id')
    summary = get_object_or_404(Summary,pk=summary_id)
    if not hasattr(summary,'quiz'):
        quiz = Quiz.objects.create(summary=summary)
        generate_quiz.delay_on_commit(quiz.id)
        serializer = SummarySerializer(summary)
        return Response(serializer.data,status=status.HTTP_201_CREATED)    
    return Response(
        { 'data':'a summary can only have one quiz'},
        status=status.HTTP_409_CONFLICT 
    )


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def retry_quiz_generation(request):
    quiz_id = request.data.get('id')
    if not quiz_id:
        return Response(
            data={
                'error':'argument id is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    quiz = get_object_or_404(Quiz,pk=quiz_id)

    if quiz.status != 'error':
        return Response(
            data={
                'error':'quiz cannot be regenerated unless status is error'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    quiz.status = 'processing'
    quiz.save()
    serialzer = QuizSerializer(quiz)
    generate_quiz.delay_on_commit(quiz.id)
    return Response(serialzer.data,status=status.HTTP_200_OK)
