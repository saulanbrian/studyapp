from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.views import Response

from task.quiz.generate_quiz import generate_quiz


@api_view(['POST'])
def generate_quiz_view(request):
    quiz_id = request.data.get('quiz_id')
    if not quiz_id:
        return Response(
            {
                "error": "Parameter summary_id is missing"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    generate_quiz.delay(quiz_id)
    return Response(
        {
            "success":f"generating questions for quiz: { quiz_id }"
        },
        status=status.HTTP_200_OK
    )

