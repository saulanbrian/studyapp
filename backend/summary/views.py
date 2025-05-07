from rest_framework.generics import GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
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
    file = request.FILES.get('file')
    if not file:
      return Response(
        { 'error':'missing argument "file" '},
        status=status.HTTP_400_BAD_REQUEST
      )

    title = request.data.get('title') or file.name 
    cover_image = request.FILES.get('cover_image')

    summary = Summary.objects.create(
      title=title,
      user=request.user,
      cover=cover_image
    )

    file_base64 = base64.b64encode(file.read()).decode('utf-8')
    summarize_file.delay_on_commit(summary.id,file_base64)
    serializer = self.get_serializer(summary)
    return Response(serializer.data,status=status.HTTP_201_CREATED)

class SummaryRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = SummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Summary.objects.filter(user__clerk_id=self.request.user.clerk_id)
