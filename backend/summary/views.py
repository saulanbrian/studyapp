from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, JSONParser

from .serializers import SummarySerializer
from .models import Summary
from .tasks import summarize_file
import base64

class SummaryPaginator(PageNumberPagination):
  page_size = 10

class SummaryAPIView(GenericAPIView):
  serializer_class = SummarySerializer
  queryset = Summary.objects.all()
  permission_classes = [IsAuthenticated]
  pagination_class = SummaryPaginator
  parser_classes = [JSONParser,MultiPartParser]
  
  def get(self,request,*args,**kwargs):
    user_id = request.user.clerk_id
    summaries = Summary.objects.filter(user__clerk_id=user_id)
    paginator = self.pagination_class()
    paginated_summaries = paginator.paginate_queryset(summaries,request=request)
    
    serialized_summaries = self.get_serializer(paginated_summaries,many=True)
    return paginator.get_paginated_response(serialized_summaries.data)
    
    
  def post(self,request,*args,**kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid():
      summary = serializer.save(user=request.user)
      summarize_file.delay_on_commit(summary.id,)
      return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class SummaryRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
  serializer_class = SummarySerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Summary.objects.filter(user__clerk_id=self.request.user.clerk_id)


class FavoriteSummaryListAPIView(ListAPIView):
  serializer_class = SummarySerializer
  permission_classes = [IsAuthenticated]
  pagination_class = SummaryPaginator

  def get_queryset(self):
    user_id = self.request.user.clerk_id
    return Summary.objects.filter(
      user__clerk_id=user_id,
      favorite=True
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def retry_summary(request):
  summary_id = request.data.get('id',None)

  if not summary_id:
    return Response(
      data={'error':'id field is required'},
      status=status.HTTP_400_BAD_REQUEST
    )
   
  summary = get_object_or_404(Summary,pk=summary_id)
  summary.error_message = None
  summary.status = 'processing'
  summary.save()

  summarize_file.delay_on_commit(summary.id)
  return Response(status=status.HTTP_200_OK)
