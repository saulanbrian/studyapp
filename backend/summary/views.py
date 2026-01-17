from rest_framework.decorators import api_view
from rest_framework.response import Response
from task.summary.summarize import process_summary
from rest_framework import status

@api_view(['POST'])
def request_summary(request):
    id = request.data.get("id")
    if not id:
        return Response(
            data={
                "error":"Parameter id is missing"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    process_summary.delay(id)
    return Response(
        data={"data":f"summary for {id} is being processed"},
        status=status.HTTP_202_ACCEPTED
    )
