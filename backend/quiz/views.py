from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.views import Response

from task.quiz.generate_quiz import generate_quiz


@api_view(['POST'])
def generate_quiz_view(request):
    summary_id = request.data.get('summary_id')
    if not summary_id:
        return Response(
            {
                "error": "Parameter summary_id is missing"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    generate_quiz.delay(summary_id)
    return Response(
        {
            "success":f"generating quiz for summary {summary_id}"
        },
        status=status.HTTP_200_OK
    )

